const constants = require('../../constants');

const HTTP_STATUS_CODES = constants.HTTP_STATUS_CODES;
const RESPONSE_CODES = constants.RESPONSE_CODES;

/** 
 * @param req @type {Object.<any>} Express Request
 * @param res @type {Object.<any>} Express Response
 * @param body @type {Object.<any>} Response Body
 * @param status @type {string} Http status
 * @param code @type {string} Response code
*/
exports.handleSuccess = function (req, res, body, status, code) {
	const httpResponse = HTTP_STATUS_CODES.SUCCESS[status] || { code: 200, message: 'Petición exitosa.' };
	const responseCode = RESPONSE_CODES.SUCCESS[code] || { code: 1000, message: 'Se realizó la operación exitosamente.' };

	return res.status(httpResponse.code).json({
		httpCode: httpResponse.code,
		httpMessage: httpResponse.message,
		message: responseCode.message,
		result: body
	});
}

/** 
 * @param req @type {Object.<any>} Express Request
 * @param res @type {Object.<any>} Express Response
 * @param err @type {Object.<any>} Response Error
 * @param status @type {string} Http status
 * @param code @type {string} Response code
*/
exports.handleError = function (req, res, err, status, code) {
	const httpResponse = HTTP_STATUS_CODES.ERROR[status] || { code: 500, message: 'Error interno del servidor.' };
	const responseCode = RESPONSE_CODES.ERROR[code] || { code: 1000, message: 'Hubo un error al procesar la solicitud. Favor de comunicarse con el administrador.' };

	return res.status(httpResponse.code).json({
		errorCode: responseCode.code,
		httpCode: httpResponse.code,
		httpMessage: httpResponse.message,
		message: responseCode.message,
		error: err
	});
}