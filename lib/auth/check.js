const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

const settings = require('../../settings');

/**  
 * @param {Object.<any>} token Token to verify and decrypt
 * @returns {Promise.<any>} Promise
*/

module.exports = function (token) {
	return new Promise(function (resolve, reject) {
		jwt.verify(token, settings.JWT.KEY,
			function (err, decoded) {
				if (err) {
					return reject(err);
				}
				return resolve(decoded);
			});
	});
}