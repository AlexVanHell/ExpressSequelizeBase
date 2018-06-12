const resHandler = require('../lib/common/http-response-handler');

exports.create = function (req, res, next) {
	const user = req.body;

	resHandler.handleSuccess(req, res, responseBody, 'OK', 'LOGIN');
}