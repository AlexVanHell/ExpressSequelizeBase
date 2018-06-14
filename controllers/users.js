const debug = require('debug')('controllers:users');
const resHandler = require('../lib/util/http-response-handler');
const db = require('../models');
const User = db.User;

exports.get = async function (req, res, next) {
	let responseBody = {}

	try {
		const users = await User.findAll();
		responseBody = users;

		resHandler.handleSuccess(req, res, responseBody, 'OK');
	} catch (err) {
		debug(err);
		resHandler.handleError(req, res, err, 'INTERNAL_SERVER_ERROR');
	}
}

exports.getById = async function (req, res, next) {
	const userId = req.params.id;
	let responseBody = {}

	try {
		const user = await User.findById(userId);
		responseBody = user;

		resHandler.handleSuccess(req, res, responseBody, 'OK');
	} catch (err) {
		debug(err);
		resHandler.handleError(req, res, err, 'INTERNAL_SERVER_ERROR');
	}
}

exports.create = function (req, res, next) {
	const data = req.body;
	let responseBody = {}

	User.create({
		firstName: data.firstName,
		lastName: data.lastName,
		email: data.email,
		phone: data.phone
	}).then(function (user) {
		responseBody = user;

		resHandler.handleSuccess(req, res, responseBody, 'CREATED', 'USER_CREATED');
	}).catch(function (err) {
		debug(err);
		resHandler.handleError(req, res, err, 'INTERNAL_SERVER_ERROR', 'USER_CREATION_ERROR');
	});
}

exports.update = function (req, res, next) {
	const userId = req.params.id;
	const data = req.body;
	let responseBody = {}

	User.update({
		firstName: data.firstName,
		lastName: data.lastName,
		email: data.email,
		phone: data.phone
	}, {
			where: { id: userId }
		}).then(function (result) {
			responseBody = { affectedCount: result[0], affectedRows: result[1] };

			resHandler.handleSuccess(req, res, responseBody, 'OK', 'USER_UPDATED');
		}).catch(function (err) {
			debug(err);
			resHandler.handleError(req, res, err, 'INTERNAL_SERVER_ERROR', 'USER_CREATION_ERROR');
		});
}