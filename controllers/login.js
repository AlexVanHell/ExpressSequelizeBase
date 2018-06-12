const resHandler = require('../lib/common/http-response-handler');

exports.login = function (req, res, next) {
	const responseBody = { token: 'ASDASD92343298ASDASD' };

	resHandler.handleSuccess(req, res, responseBody, 'OK', 'LOGIN');
}