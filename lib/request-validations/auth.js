const auth = require('../auth');
const settings = require('../../settings');
const responseHandler = require('../util/http-response-handler');

module.exports = function (req, res, next) {
	let token = req.headers.authorization;

	if (typeof token !== 'string' || token === '') {
		return responseHandler.handleError(req, res, { name: 'NO_TOKEN_PROVIDED' }, 'UNAUTHORIZED', 'NO_TOKEN_PROVIDED');
	}

	auth.check(token)
		.then(function (data) {
			req.decoded = data; // usuario
			next();
		})
		.catch(function (err) {
			return responseHandler.handleError(req, res, { name: 'INVALID_TOKEN', error: err }, 'FORBBIDEN', 'INVALID_TOKEN');
		});
}

