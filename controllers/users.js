const debug = require('debug')('controllers:users');
const crypto = require('crypto');
const Promise = require('bluebird');

const resHandler = require('../lib/util/http-response-handler');
const util = require('../lib/util');
const constants = require('../constants');
const settings = require('../settings');
const auth = require('../lib/auth');

const db = require('../models');
// Models
/* 
const Person = db.Person;
const Access = db.Access;
const PersonAccess = db.PersonAccess;
const Privilege = db.Privilege; 
*/

exports.get = async function (req, res, next) {
	let responseBody = {};

	try {
		const rows = await db.Person.findAll({
			where: { visible: true },
			attributes: ['id', 'firstName', 'lastName', 'username', 'email', 'phone', 'active', 'createdAt', 'updatedAt'],
			include: [{
				model: db.Privilege,
				as: 'privilege',
				attributes: ['id', 'name']
			}]
		});
		responseBody = rows;

		resHandler.handleSuccess(req, res, responseBody, 'OK');
	} catch (err) {
		debug('GET', err);
		resHandler.handleError(req, res, err, 'INTERNAL_SERVER_ERROR', 'INTERNAL_SERVER_ERROR');
	}
}

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
				include: [{
					model: db.Access,
					attributes: ['id', 'name'],
					where: { active: true, visible: true },
					as: 'accesses',
					through: {
						as: 'access',
						attributes: ['permission'],
						where: { active: true, visible: true }
					}
				}]
			}, {
				model: db.Access,
				attributes: ['id', 'name'],
				where: { active: true, visible: true },
				as: 'accesses',
				required: false,
				through: {
					as: 'access',
					attributes: ['permission'],
					where: { active: true, visible: true }
				}
			}]
		});

		if (!item) {
			const error = {
				name: 'DatabaseNotFound',
				message: constants.STRINGS.USER_NOT_EXISTS
			}
			return resHandler.handleError(req, res, error, 'NOT_FOUND', 'NOT_FOUND', error.message);
		}

		responseBody = item.get({ plain: true }); // Returns the JSON sent to response

		// If user has privilege set accesses from privilege
		if (responseBody.privilege) {
			responseBody.accesses = Object.assign([], responseBody.privilege.accesses); // Avoid point to the same memory direction to delete below

			delete responseBody.privilege.accesses;
		}

		resHandler.handleSuccess(req, res, responseBody, 'OK');
	} catch (err) {
		debug('GET BY ID', err);
		resHandler.handleError(req, res, err, 'INTERNAL_SERVER_ERROR', 'INTERNAL_SERVER_ERROR');
	}
}

exports.create = async function (req, res, next) {
	const body = req.body;
	let responseBody = {};
	let usernameUpdated = false;
	let item = {};

	try {
		let randomPassword = util.randomString(12);

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

			const result = await db.Person.update(dataInsert, { where: { email: body.email } });

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

		const url = `http://${req.headers.host}/verification?token=${tokenKey}`;

		const email = await util.emailHandler.sendMail({
			to: body.email,
			subject: 'Registro exitoso en la plataforma',
			body: `
				<h1>Bienvenido a ${settings.APP.NAME} ${body.firstName} ${body.lastName}!</h1>
				<p>
					Haz click sobre el siguiente enlace para activar tu cuenta:
					<br>
					<b>
						<a href="${url}">
							${url}
						</a>
					</b>
				</p>
			`
		});

		responseBody = {
			id: item.id,
			username: usernameUpdated ? username : item.username,
			createdAt: new Date(),
			updatedAt: new Date()
		};

		resHandler.handleSuccess(req, res, responseBody, 'CREATED', constants.STRINGS.USER_CREATED + item.email);
	} catch (err) {
		debug('CREATE', err);
		resHandler.handleError(req, res, err, 'INTERNAL_SERVER_ERROR', 'INTERNAL_SERVER_ERROR');
	}
}

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
			const error = {
				name: 'DatabaseNotFound',
				message: constants.STRINGS.USER_NOT_EXISTS
			}
			return resHandler.handleError(req, res, error, 'NOT_FOUND', 'NOT_FOUND', error.message);
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

		resHandler.handleSuccess(req, res, responseBody, 'OK', constants.STRINGS.USER_UPDATED);
	} catch (err) {
		debug('UPDATE', err);
		resHandler.handleError(req, res, err, 'INTERNAL_SERVER_ERROR', 'INTERNAL_SERVER_ERROR');
	};
}

exports.delete = async function (req, res, next) {
	const itemId = req.params.id;
	let responseBody = null;

	try {
		const find = await db.Person.findOne({
			where: { id: itemId, visible: true },
			attributes: ['id']
		});

		if (!find) {
			const error = {
				name: 'DatabaseNotFound',
				message: constants.STRINGS.USER_NOT_EXISTS
			}
			return resHandler.handleError(req, res, error, 'NOT_FOUND', 'NOT_FOUND', error.message);
		}

		const result = db.Person.update({ active: false, visible: false }, {
			where: { id: itemId }
		});

		resHandler.handleSuccess(req, res, responseBody, 'OK', constants.STRINGS.USER_DELETED);
	} catch (err) {
		debug('DELETE', err);
		resHandler.handleError(req, res, err, 'INTERNAL_SERVER_ERROR', 'INTERNAL_SERVER_ERROR');
	}
}

exports.lock = async function (req, res, next) {
	const itemId = req.params.id;
	let responseBody = null;

	try {
		const find = await db.Person.findOne({
			where: { id: itemId, visible: true },
			attributes: ['id']
		});

		if (!find) {
			const error = {
				name: 'DatabaseNotFound',
				message: constants.STRINGS.USER_NOT_EXISTS
			}
			return resHandler.handleError(req, res, error, 'NOT_FOUND', 'NOT_FOUND', error.message);
		}

		const result = db.Person.update({ active: !find.active }, {
			where: { id: itemId }
		});

		let constantKey = find.active ? 'USER_LOCKED' : 'USER_UNLOCKED';

		resHandler.handleSuccess(req, res, responseBody, 'OK', constants.STRINGS[constantKey]);
	} catch (err) {
		debug('LOCK', err);
		resHandler.handleError(req, res, err, 'INTERNAL_SERVER_ERROR', 'INTERNAL_SERVER_ERROR');
	}
}