const debug = require('debug')('controllers:users');
const resHandler = require('../lib/util/http-response-handler');
const util = require('../lib/util');

const db = require('../models');
const Access = db.Access;
const Privilege = db.Privilege;

exports.get = async function (req, res, next) {
	let responseBody = {};

	try {
		const rows = await Privilege.findAll({ where: { visible: true } });
		responseBody = rows;

		resHandler.handleSuccess(req, res, responseBody, 'OK');
	} catch (err) {
		debug(err);
		resHandler.handleError(req, res, err, 'INTERNAL_SERVER_ERROR', 'INTERNAL_SERVER_ERROR');
	}
}

exports.getById = async function (req, res, next) {
	const itemId = req.params.id;
	let responseBody = {};

	try {
		const item = await Privilege.findOne({
			where: { id: itemId, visible: true },
			attributes: ['id', 'name', 'description', 'active', 'createdAt', 'updatedAt'],
			include: [{
				model: Privilege,
				as: 'privilege',
				attributes: ['id', 'name', 'description'],
				include: [{
					model: Access,
					attributes: ['id', 'name', 'description'],
					through: {
						as: 'access',
						attributes: ['id', 'permission']
					},
					as: 'accesses'
				}]
			}, {
				model: Access,
				attributes: ['id', 'name', 'description'],
				through: {
					as: 'access',
					attributes: ['id', 'permission']
				},
				as: 'accesses'
			}]
		});

		responseBody = item;

		resHandler.handleSuccess(req, res, responseBody, 'OK');
	} catch (err) {
		debug(err);
		resHandler.handleError(req, res, err, 'INTERNAL_SERVER_ERROR', 'INTERNAL_SERVER_ERROR');
	}
}

exports.create = async function (req, res, next) {
	const data = req.body;
	let responseBody = {};

	try {
		const item = await Privilege.create({
			name: data.name,
			description: data.description
		});

		responseBody = item;

		resHandler.handleSuccess(req, res, responseBody, 'CREATED', 'PRIVILEGE_CREATED');
	} catch (err) {
		debug(err);
		resHandler.handleError(req, res, err, 'INTERNAL_SERVER_ERROR', 'INTERNAL_SERVER_ERROR');
	}
}

exports.update = async function (req, res, next) {
	const itemId = req.params.id;
	const data = req.body;
	let responseBody = {};

	try {
		const result = await Privilege.update({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			phone: data.phone
		}, {
				where: { id: itemId }
			});

		responseBody = { affectedCount: result[0], affectedRows: result[1] };

		resHandler.handleSuccess(req, res, responseBody, 'OK', 'PRIVILEGE_UPDATED');
	} catch (err) {
		debug(err);
		resHandler.handleError(req, res, err, 'INTERNAL_SERVER_ERROR', 'INTERNAL_SERVER_ERROR');
	};
}