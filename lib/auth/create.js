const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

const settings = require('../../settings');

/**  
 * @param {Object.<any>} data Object to encrypt
 * @param {string} key Custom key to create token
 * @returns {Promise.<string>} Promise<string>
*/

module.exports = function (data, key) {
	const usedKey = (typeof key === 'string') ? key : settings.JWT.KEY;

	return new Promise(function (resolve, reject) {
		jwt.sign(data, usedKey, {
			expiresIn: settings.JWT.LIFETIME,
			subject: data.id ? data.id : undefined
		}, function (err, token) {
			if (err) {
				return reject(err);
			}
			return resolve(token);
		});
	});
}