const debug = require('debug')('controllers:users');
const resHandler = require('../lib/util/http-response-handler');
const db = require('../models');
const User = db.User;

exports.get = function (req, res, next) {
	let responseBody = {}

	User.findAll()
		.then(function (users) {
			responseBody = users;

			resHandler.handleSuccess(req, res, responseBody, 'OK');
		}).catch(function (err) {
			debug(err);
			resHandler.handleError(req, res, err, 'INTERNAL_SERVER_ERROR');
		});
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