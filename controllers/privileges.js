const debug = require('debug')('controllers:privileges');
const Promise = require('bluebird');
const settings = require('../settings');

const responseHandler = require('../lib/common/http-response-handler');
const util = require('../lib/util');
const db = require('../models');
// Models
/* 
const Privilege = db.Privilege; 
const Access = db.Access;
const PrivilegeAccess = db.PrivilegeAccess;
*/

exports.get = async function (req, res, next) {
	const pagination = util.pagination(req.query.limit, req.query.offset);
	let responseBody = [];

	try {
		const rows = await db.Privilege.findAll({
			where: { visible: true },
			limit: pagination.limit,
			offset: pagination.offset,
			attributes: ['id', 'name', 'description', 'active', 'createdAt', 'updatedAt'],
		});

		responseBody = rows;

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
		const item = await db.Privilege.findOne({
			where: { id: itemId, visible: true },
			attributes: ['id', 'name', 'description', 'active', 'createdAt', 'updatedAt'],
			include: [{
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
			throw {
				name: 'NotFound',
				message: 'PRIVILEGE_NOT_EXISTS'
			}
		}

		responseBody = item.get({ plain: true }); // Returns the JSON sent to response

		responseHandler.handleSuccess(req, res, responseBody, 'OK');
	} catch (err) {
		debug('GET BY ID', err);
		responseHandler.handleError(req, res, err);
	}
};

exports.create = async function (req, res, next) {
	const body = req.body;
	let responseBody = {};
	let item = {};

	try {
		// Find if privilege with name = body.name is already registered but is not visible
		let find = await db.Privilege.findOne({
			where: { name: body.name, visible: false },
			attributes: ['id', 'name', 'description', 'createdAt', 'updatedAt']
		});

		const dataInsert = {
			name: body.name,
			description: body.description,
			active: (typeof body.active === 'boolean') ? body.active : true
		}

		if (find) {
			dataInsert.active = true;
			dataInsert.visible = true;
			dataInsert.createdAt = new Date();

			const result = await db.Privilege.update(dataInsert, { where: { id: find.id } });

			item = find;
		} else {
			item = await db.Privilege.create(dataInsert);
		}

		if (!body.accesses) item.accesses = [];

		// Disable all privilege accesses
		const disableAccesses = await db.PrivilegeAccess.update({
			active: false, visible: false
		}, {
				where: { privilegeId: item.id }
			});

		// Generate an array of promises tu update or create access(es)
		const accessesArr = body.accesses.map(async function (x) {
			const hasAccess = await item.hasAccess(x.id);

			if (hasAccess) {
				return db.PrivilegeAccess.update({
					active: true, visible: true, permission: x.access.permission
				}, {
						where: { privilegeId: item.id, accessId: x.id }
					});
			} else {
				return item.addAccess(x.id, { through: { permission: x.access.permission } });
			}
		});

		const updateAccesses = await Promise.all(accessesArr);

		responseBody = {
			id: item.id,
			createdAt: new Date(),
			updatedAt: new Date()
		};

		responseHandler.handleSuccess(req, res, responseBody, 'CREATED', 'PRIVILEGE_CREATED');
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
		const item = await db.Privilege.findOne({
			where: { id: itemId, visible: true },
			attributes: ['id', 'name', 'description', 'active', 'createdAt']
		});

		if (!item) {
			throw {
				name: 'NotFound',
				message: 'PRIVILEGE_NOT_EXISTS'
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

		const result = await db.Privilege.update(dataUpdate, {
			where: { id: itemId }
		});

		if (!body.accesses) item.accesses = [];

		// If request has no 'privilege' attribute insert or update custom accesses
		if (!body.privilege || !body.privilege.id) {
			// Disable all user accesses
			const disableAccesses = await db.PrivilegeAccess.update({
				active: false, visible: false
			}, {
					where: { personId: item.id }
				});

			const accessesArr = body.accesses.map(async function (x) {
				const hasAccess = await item.hasAccess(x.id);

				if (hasAccess) {
					return db.PrivilegeAccess.update({
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

		responseHandler.handleSuccess(req, res, responseBody, 'OK', 'PRIVILEGE_UPDATED');
	} catch (err) {
		debug('UPDATE', err);
		responseHandler.handleError(req, res, err);
	};
};

exports.delete = async function (req, res, next) {
	const itemId = req.params.id;
	let responseBody = null;

	try {
		const find = await db.Privilege.findOne({
			where: { id: itemId, visible: true },
			attributes: ['id']
		});

		if (!find) {
			throw {
				name: 'NotFound',
				message: 'PRIVILEGE_NOT_EXISTS'
			}
		}

		const result = db.Privilege.update({ active: false, visible: false }, {
			where: { id: itemId }
		});

		responseHandler.handleSuccess(req, res, responseBody, 'OK', 'PRIVILEGE_DELETED');
	} catch (err) {
		debug('DELETE', err);
		responseHandler.handleError(req, res, err);
	}
};

exports.lock = async function (req, res, next) {
	const itemId = req.params.id;
	let responseBody = {};

	try {
		const find = await db.Privilege.findOne({
			where: { id: itemId, visible: true },
			attributes: ['id', 'active']
		});

		if (!find) {
			throw {
				name: 'NotFound',
				message: 'PRIVILEGE_NOT_EXISTS'
			}
		}

		const result = db.Privilege.update({ active: !find.active }, {
			where: { id: itemId }
		});

		let messageKey = find.active ? 'PRIVILEGE_LOCKED' : 'PRIVILEGE_UNLOCKED';

		responseBody = {
			updatedAt: new Date()
		};

		responseHandler.handleSuccess(req, res, responseBody, 'OK', messageKey);
	} catch (err) {
		debug('LOCK', err);
		responseHandler.handleError(req, res, err);
	}
};