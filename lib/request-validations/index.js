const checkErrors = require('./lib/check-errors');

/**
 * Available request validations
 */
const validations = {
	login: 'login',
	createUser: 'create-user'
};

/**
 * 
 * @param {string} name Validation name
 * @returns {Function} function
 */
exports.validate = function (name) {
	if (typeof validations[name] === 'undefined') {
		throw new Error('File is not indexed.');
	}

	const fn = require('./' + validations[name]);

	return [fn, checkErrors];
}