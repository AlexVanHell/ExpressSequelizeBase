const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

const settings = require('../../settings');

/**  
 * @param {Object.<any>} token Token to verify and decrypt
 * @param {string} key Custom key to encrypt
 * @returns {Promise.<any>} Promise
*/

module.exports = function (token, key) {
	const usedKey = (typeof key === 'string') ? key : settings.JWT.KEY;

	return new Promise(function (resolve, reject) {
		jwt.verify(token, usedKey,
			function (err, decoded) {
				if (err) {
					return reject(err);
				}
				return resolve(decoded);
			});
	});
}