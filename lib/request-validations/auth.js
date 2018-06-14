const auth = require('../auth');
const settings = require('../../settings');
const resHandler = require('../util/http-response-handler');

module.exports = function (req, res, next) {
	let token = req.headers.authorization;

	if (typeof token !== 'string' || token === '') {
		return resHandler.handleError(req, res, { name: 'NO_TOKEN_PROVIDED' }, 'UNAUTHORIZED', 'NO_TOKEN_PROVIDED');
	}

	auth.check(token)
		.then(function (data) {
			req.decoded = data; // usuario
			next();
		})
		.catch(function (err) {
			return resHandler.handleError(req, res, { name: 'INVALID_TOKEN', error: err }, 'FORBBIDEN', 'INVALID_TOKEN');
		});
}

