const validationResult = require('express-validator/check').validationResult;
const responseHandler = require('../../common/http-response-handler');
const transform = require('./transform-errors');

module.exports = function (req, res, next) {
	let errors = validationResult(req);

	if (!errors.isEmpty()) {
		const errArray = transform(errors.mapped());

		return responseHandler.handleError(req, res, { name: 'RequestValidationError', errors: errArray }, 'BAD_REQUEST', 'BAD_REQUEST');
	}

	next();
};