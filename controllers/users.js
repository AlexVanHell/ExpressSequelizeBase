'use strict';
const debug = require('debug')('controllers:users');
const crypto = require('crypto');
const Promise = require('bluebird');
const settings = require('../settings');

const responseHandler = require('../lib/common/http-response-handler');
const util = require('../lib/util');
const db = require('../models');
// Models
/* 
const Person = db.Person;
const Access = db.Access;
const PersonAccess = db.PersonAccess;
const Privilege = db.Privilege; 
*/

exports.get = async function (req, res, next) {
	const pagination = util.pagination(req.query.limit, req.query.offset);
	let responseBody = [];

	try {
		const rows = await db.Person.findAll({
			where: { visible: true },
			limit: pagination.limit,
			offset: pagination.offset,
			attributes: ['id', 'firstName', 'lastName', 'username', 'email', 'phone', 'active', 'createdAt', 'updatedAt'],
			include: [{
				model: db.Privilege,
				as: 'privilege',
				attributes: ['id', 'name']
			}]
		});

		const count = await db.Person.findOne({
			attributes: [[db.sequelize.fn('COUNT', db.sequelize.col('id')), 'total']],
			where: { visible: true },
		});

		responseBody = { list: rows, rows: count.get('total') };

		responseHandler.handleSuccess(req, res, responseBody, 'OK');
	} catch (err) {
		debug('GET', err);
		responseHandler.handleError(req, res, err);
	}
};

exports.getById = async function (req, res, next) {
	const itemId = req.params.id;
	let responseBody = {};

	try {
		const item = await db.Person.findOne({
			where: { id: itemId, visible: true },
			attributes: ['id', 'firstName', 'lastName', 'username', 'email', 'phone', 'active', 'createdAt', 'updatedAt'],
			include: [{
				model: db.Privilege,
				as: 'privilege',
				attributes: ['id', 'name'],
				where: { active: true, visible: true },
				required: false,
				include: [{
					model: db.Access,
					as: 'accesses',
					attributes: ['id', 'name'],
					where: { active: true, visible: true },
					required: false,
					through: {
						as: 'access',
						attributes: ['permission'],
						where: { active: true, visible: true }
					}
				}]
			}, {
				model: db.Access,
				as: 'accesses',
				attributes: ['id', 'name'],
				where: { active: true, visible: true },
				required: false,
				through: {
					as: 'access',
					attributes: ['permission'],
					where: { active: true, visible: true }
				}
			}]
		});

		if (!item) {
			throw {
				name: 'NotFound',
				message: 'USER_NOT_EXISTS'
			}
		}

		responseBody = item.get({ plain: true }); // Returns the JSON sent to response

		// If user has privilege set accesses from privilege
		if (responseBody.privilege) {
			responseBody.accesses = Object.assign([], responseBody.privilege.accesses); // Avoid point to the same memory direction to delete below

			delete responseBody.privilege.accesses;
		}

		responseHandler.handleSuccess(req, res, responseBody, 'OK');
	} catch (err) {
		debug('GET BY ID', err);
		responseHandler.handleError(req, res, err);
	}
};

exports.create = async function (req, res, next) {
	const body = req.body;
	const verificationUrl = settings.HOST.FRONTEND + 'verification?token=';
	let responseBody = {};
	let usernameUpdated = false;
	let item = {};

	try {
		const randomPassword = util.randomString(12);

		// Find if email is already registered but is not visible
		let find = await db.Person.findOne({
			where: { email: body.email, visible: false },
			attributes: ['id', 'firstName', 'lastName', 'username', 'email', 'phone', 'createdAt', 'updatedAt']
		});

		const username = await db.Person.generateUsername(body.firstName, body.lastName);

		const dataInsert = {
			firstName: body.firstName,
			lastName: body.lastName,
			email: body.email,
			phone: body.phone,
			password: randomPassword,
			active: (typeof body.active === 'boolean') ? body.active : true,
			privilegeId: body.privilege && body.privilege.id ? body.privilege.id : null
		}

		if (find) {
			dataInsert.active = true;
			dataInsert.visible = true;
			dataInsert.verified = false;
			dataInsert.createdAt = new Date();
			dataInsert.password = await db.Person.generateHash(randomPassword);

			// It will change the username value
			if (find.firstName !== body.firstName || find.lastName !== find.lastName) {
				dataInsert.username = username;
				usernameUpdated = true;
			}

			const updateResult = await db.Person.update(dataInsert, { where: { id: find.id } });

			item = find;
		} else {
			dataInsert.username = username;
			// Person hook 'breforeCreate' automaticaly encrypts password
			item = await db.Person.create(dataInsert);
		}

		if (!body.accesses) item.accesses = [];

		// If request has no 'privilege' attribute, insert or update custom accesses
		if (!body.privilege || !body.privilege.id) {
			// Disable all user accesses
			const disableAccesses = await db.PersonAccess.update({
				active: false, visible: false
			}, {
					where: { personId: item.id }
				});

			// Generate an array of promises tu update or create access(es)
			const accessesArr = body.accesses.map(async function (x) {
				const hasAccess = await item.hasAccess(x.id);

				if (hasAccess) {
					return db.PersonAccess.update({
						active: true, visible: true, permission: x.access.permission
					}, {
							where: { personId: item.id, accessId: x.id }
						});
				} else {
					return item.addAccess(x.id, { through: { permission: x.access.permission } });
				}
			});

			const updateAccesses = await Promise.all(accessesArr);
		}

		const tokenKey = crypto.randomBytes(16).toString('hex');

		const createToken = await db.Token.create({
			value: tokenKey,
			email: item.email,
			personId: item.id,
			type: 1 // 1: Email verification
		});

		const url = verificationUrl + tokenKey;

		const mailSent = await util.sendMail({
			to: body.email,
			subject: 'Registro exitoso en la plataforma',
			body: `
				<h1>¡Bienvenido a ${settings.APP.NAME} ${body.firstName} ${body.lastName}!</h1>
				<p>
					Haz click sobre el siguiente enlace para activar tu cuenta:
					<br />
					<b><a href="${url}">${url}</a></b>
				</p>
				<p>
					Te hemos asignado una contraseña temporal:
					<br />
					${randomPassword}
				</p>
			`
		});

		responseBody = {
			id: item.id,
			username: usernameUpdated ? username : item.username,
			createdAt: new Date(),
			updatedAt: new Date()
		};

		responseHandler.handleSuccess(req, res, responseBody, 'CREATED', 'USER_CREATED', { email: item.email });
	} catch (err) {
		debug('CREATE', err);
		responseHandler.handleError(req, res, err);
	}
};

exports.update = async function (req, res, next) {
	const itemId = req.params.id;
	const body = req.body;
	let responseBody = {};

	try {
		const item = await db.Person.findOne({
			where: { id: itemId, visible: true },
			attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'username', 'active', 'createdAt']
		});

		if (!item) {
			throw {
				name: 'NotFound',
				message: 'USER_NOT_EXISTS'
			}
		}

		const dataUpdate = {
			firstName: body.firstName,
			lastName: body.lastName,
			phone: body.phone,
			active: (typeof body.active === 'boolean') ? body.active : true,
			privilegeId: body.privilege && body.privilege.id ? body.privilege.id : null
		}

		// Person.prototype.ownsEmail is a instance method defined in Person model
		if (!item.ownsEmail(body.email)) {
			dataInsert.email = body.email;
		}

		const result = await db.Person.update(dataUpdate, {
			where: { id: itemId }
		});

		body.updatedAt = new Date();

		if (!body.accesses) item.accesses = [];

		// If request has no 'privilege' attribute insert or update custom accesses
		if (!body.privilege || !body.privilege.id) {
			// Disable all user accesses
			const disableAccesses = await db.PersonAccess.update({
				active: false, visible: false
			}, {
					where: { personId: item.id }
				});

			const accessesArr = body.accesses.map(async function (x) {
				const hasAccess = await item.hasAccess(x.id);

				if (hasAccess) {
					return db.PersonAccess.update({
						active: true, visible: true, permission: x.access.permission
					}, {
							where: { personId: item.id, accessId: x.id }
						});
				} else {
					return item.addAccess(x.id, { through: { permission: x.access.permission } });
				}
			});

			const updateAccesses = await Promise.all(accessesArr);
		}

		responseBody = {
			updatedAt: new Date()
		};

		responseHandler.handleSuccess(req, res, responseBody, 'OK', 'USER_UPDATED');
	} catch (err) {
		debug('UPDATE', err);
		responseHandler.handleError(req, res, err);
	};
};

exports.delete = async function (req, res, next) {
	const itemId = req.params.id;
	let responseBody = null;

	try {
		const find = await db.Person.findOne({
			where: { id: itemId, visible: true },
			attributes: ['id']
		});

		if (!find) {
			throw {
				name: 'NotFound',
				message: 'USER_NOT_EXISTS'
			}
		}

		const updateResult = db.Person.update({ active: false, visible: false }, {
			where: { id: itemId }
		});

		responseHandler.handleSuccess(req, res, responseBody, 'OK', 'USER_DELETED');
	} catch (err) {
		debug('DELETE', err);
		responseHandler.handleError(req, res, err);
	}
};

exports.lock = async function (req, res, next) {
	const itemId = req.params.id;
	let responseBody = {};

	try {
		const find = await db.Person.findOne({
			where: { id: itemId, visible: true },
			attributes: ['id', 'active']
		});

		if (!find) {
			throw {
				name: 'NotFound',
				message: 'USER_NOT_EXISTS'
			}
		}

		const updateResult = db.Person.update({ active: !find.active }, {
			where: { id: itemId }
		});

		let messageKey = find.active ? 'USER_LOCKED' : 'USER_UNLOCKED';

		responseBody = {
			updatedAt: new Date()
		};

		responseHandler.handleSuccess(req, res, responseBody, 'OK', messageKey);
	} catch (err) {
		debug('LOCK', err);
		responseHandler.handleError(req, res, err);
	}
};