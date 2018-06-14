const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

const settings = require('../../settings');

/**  
 * @param {Object.<any>} data Object to encrypt
 * @returns {Promise.<string>} Promise<string>
*/

module.exports = function (data) {
	return new Promise(function (resolve, reject) {
		jwt.sign(data, settings.SECRET, {
			expiresIn: settings.JWT.LIFETIME,
			subject: data.id
		}, function (err, token) {
			if (err) {
				return reject(err);
			}
			return resolve(token);
		});
	});
}