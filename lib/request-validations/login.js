const { body } = require('express-validator/check');

module.exports = [
	body('user').exists(),
	body('password').exists()
];