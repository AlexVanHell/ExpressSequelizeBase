const { body } = require('express-validator/check');

module.exports = [
	body('user')
		.exists().withMessage('must exists.')
		.isString().withMessage('must be an string.'),
	body('password')
		.exists().withMessage('must exists.')
		.isString().withMessage('must be an string.')
];