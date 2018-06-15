const debug = require('debug')('controllers:users');
const resHandler = require('../lib/util/http-response-handler');
const util = require('../lib/util');

const db = require('../models');
const Person = db.Person;
const Access = db.Access;
const Privilege = db.Privilege;

exports.get = async function (req, res, next) {
	let responseBody = {};

	try {
		const rows = await Person.findAll({ where: { visible: true } });
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
		const item = await Person.findOne({
			where: { id: itemId, visible: true },
			attributes: ['id', 'firstName', 'lastName', 'username', 'email', 'phone', 'active', 'createdAt', 'updatedAt'],
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
	let randomPassword = util.randomString(12);

	try {
		const hashedPassword = await Person.generateHash(randomPassword);

		const item = await Person.create({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			phone: data.phone,
			password: hashedPassword,
			privilegeId: data.privilege.id
		});

		responseBody = item;

		const email = await util.emailHandler.sendMail({
			to: data.email,
			body: `
				<h1>Bienvenido a la plataforma ${data.firstName} ${data.lastName}</h1>
				<p>
					Tu nueva contraseña es: ${randomPassword}
				</p>
			`
		});

		resHandler.handleSuccess(req, res, responseBody, 'CREATED', 'USER_CREATED');
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
		const result = await Person.update({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			phone: data.phone
		}, {
				where: { id: itemId }
			});

		responseBody = { affectedCount: result[0], affectedRows: result[1] };

		resHandler.handleSuccess(req, res, responseBody, 'OK', 'USER_UPDATED');
	} catch (err) {
		debug(err);
		resHandler.handleError(req, res, err, 'INTERNAL_SERVER_ERROR', 'INTERNAL_SERVER_ERROR');
	};
}