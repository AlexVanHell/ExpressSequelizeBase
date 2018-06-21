const constants = require('../../constants');

const HTTP_STATUS_CODES = constants.HTTP_STATUS_CODES;
const ERROR_CODES = constants.ERROR_CODES;

/** 
 * @param {Object.<any>} req Express Request
 * @param {Object.<any>} res Express Response
 * @param {Object.<any>} body Response Body
 * @param {string} status Http status
 * @param {string} message Response message
 * @returns {void}
*/
exports.handleSuccess = function (req, res, body, status, message) {
	const httpResponse = HTTP_STATUS_CODES.SUCCESS[status] || { code: 200, message: 'Petición exitosa.' };

	if (typeof message !== 'string' || message.trim() === '') message = 'Se realizó la operación exitosamente.';

	return res.status(httpResponse.code).json({
		httpCode: httpResponse.code,
		httpMessage: httpResponse.message,
		message: message,
		result: body
	});
}

/** 
 * @param {Object.<any>} req Express Request
 * @param {Object.<any>} res Express Response
 * @param {Object.<any>} err Response Error Body
 * @param {string} status Http status
 * @param {string} code Response code
 * @param {string} message Response message
 * @returns {void}
*/
exports.handleError = function (req, res, err, status, code, message) {
	let httpResponse = HTTP_STATUS_CODES.ERROR[status] || { code: 500, message: 'Error interno del servidor.' };
	let responseCode = ERROR_CODES[code] || { code: 1000, message: 'Hubo un error al procesar la solicitud. Favor de comunicarse con el administrador.' };

	if (typeof err === 'object') {
		if (err.name === 'SequelizeValidationError') {
			let validationsErrors = err.errors.map(x => {
				return {
					message: x.message,
					type: x.type,
					path: x.path,
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

		if (err.type === 'EMAIL') {
			httpResponse = HTTP_STATUS_CODES.ERROR['INTERNAL_SERVER_ERROR'];
			responseCode = ERROR_CODES['INTERNAL_SERVER_ERROR'];
			if (err.name === 'TRANSPORT_ERROR') responseCode.message = err.message;
			err = {
				name: err.name,
				error: err.message
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