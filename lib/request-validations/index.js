const checkErrors = require('./lib/check-errors');

/**
 * Available request validations
 */
const validations = {
	login: 'login',
	createUser: 'create-user'
};

/**
 * Express validator handler
 * @param {string} name Validation name
 * @returns {Array.<function>} function
 */
exports.validate = function (name) {
	if (typeof validations[name] === 'undefined') {
		throw new Error('File is not indexed.');
	}

	const fn = require('./' + validations[name]);

	return [fn, checkErrors];
}