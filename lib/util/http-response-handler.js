const constants = require('../../constants');

const HTTP_STATUS_CODES = constants.HTTP_STATUS_CODES;
const ERROR_CODES = constants.ERROR_CODES;

/** 
 * @param {Request} req Express Request
 * @param {Response} res Express Response
 * @param {Object.<any>} body Response Body
 * @param {string} httpStatus Http status -- http status underscored and uppercase
 * @param {string} message Response message
 * @returns {void}
*/
exports.handleSuccess = function (req, res, body, httpStatus, message) {
	const httpResponse = HTTP_STATUS_CODES.SUCCESS[httpStatus] || { code: 200, message: 'Success.' };

	if (typeof message !== 'string' || message.trim() === '') message = 'Se realizó la operación exitosamente.';

	return res.status(httpResponse.code).json({
		httpCode: httpResponse.code,
		httpMessage: httpResponse.message,
		message: message,
		result: body
	});
}

/** 
 * @param {Request} req Express Request
 * @param {Response} res Express Response
 * @param {Object.<any>} err Response Error Body
 * @param {string} httpStatus Http status -- http status underscored and uppercase
 * @param {string} errorCode Response code -- error code underscored and uppercase
 * @param {string} message Response message
 * @returns {void}
*/
exports.handleError = function (req, res, err, httpStatus, errorCode, message) {
	let httpResponse = HTTP_STATUS_CODES.ERROR[httpStatus] || { code: 500, message: 'Internal server error.' };
	let responseCode = ERROR_CODES[errorCode] || { code: 1000, message: 'Hubo un error al procesar la solicitud. Favor de comunicarse con el administrador.' };

	if (typeof err === 'object') {
		if (err.name === 'SequelizeValidationError') {
			let validationsErrors = err.errors.map(x => {
				return {
					message: x.message,
					name: x.path,
					value: x.value
				}
			});
			httpResponse = HTTP_STATUS_CODES.ERROR['CONFLICT'];
			responseCode = ERROR_CODES['CONFLICT'];
			responseCode.message = validationsErrors[0].message;
			err = {
				name: err.name,
				errors: validationsErrors
			}
		}

		if (err.type === 'MailError') {
			httpResponse = HTTP_STATUS_CODES.ERROR['INTERNAL_SERVER_ERROR'];
			responseCode = ERROR_CODES['INTERNAL_SERVER_ERROR'];
			if (err.name === 'MailTransportError') responseCode.message = err.message + err.address;
			err = {
				name: err.name,
				message: err.message
			}
		}
	}

	if (typeof message === 'string' && message.trim() !== '') responseCode.message = message;

	return res.status(httpResponse.code).json({
		errorCode: responseCode.code,
		httpCode: httpResponse.code,
		httpMessage: httpResponse.message,
		message: responseCode.message,
		error: err
	});
}