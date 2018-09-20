const debug = require('debug')('util:http-response-handler');
const constants = require('../../constants');
const settings = require('../../settings');
const translation = require('../../translations/lib');

const httpStatusCodes = constants.HTTP_STATUS_CODES;
const errorCodes = constants.ERROR_CODES;

const okString = 'OK';
const internalErrorString = 'INTERNAL_SERVER_ERROR';

/** 
 * Handle success response
 * @param {Request} req Express Request
 * @param {Response} res Express Response
 * @param {Object.<any>} body Response Body
 * @param {string} httpStatus Http status -- http status underscored and uppercase
 * @param {string} label Response message label
 * @param {string} obj Response message arguments for replacing
 * @returns {void}
*/
exports.handleSuccess = function (req, res, body, httpStatus, label, obj) {
	if (typeof label !== 'string' || label.trim() === '') label = 'SUCCESS';

	const lang = req.headers['accept-language'];
	let httpResponse = httpStatusCodes.SUCCESS[httpStatus];

	if (!httpResponse) httpResponse = httpStatusCodes.SUCCESS[okString];

	const message = translation.translate(label, lang, obj);

	return res.status(httpResponse.code).json({
		httpCode: httpResponse.code,
		message: message,
		result: body
	});
}

/** 
 * Handler error response
 * @param {Request} req Express Request
 * @param {Response} res Express Response
 * @param {Object.<any>} error Response Error Body
 * @param {string} httpStatus Http status -- http status underscored and uppercase. If null or undefined = 'INTERNAL_SERVER_ERROR'
 * @param {string} errorCode Response code -- error code underscored and uppercase. If null or undefined = 'INTERNAL_SERVER_ERROR'
 * @param {string} label Response message label underscored and uppercase
 * @param {string} obj Response message arguments for replacing
 * @returns {void}
*/
exports.handleError = function (req, res, error, httpStatus, errorCode, label, obj) {
	const lang = req.headers['accept-language'];
	let response = {};

	try {
		if (!httpStatus) httpStatus = internalErrorString;
		if (!errorCode) httpStatus = internalErrorString;

		let httpResponse = httpStatusCodes.ERROR[httpStatus];
		let responseCode = errorCodes[errorCode];

		if (!httpResponse) httpResponse = httpStatusCodes.ERROR[internalErrorString];
		if (!responseCode) responseCode = errorCodes[internalErrorString];

		if (typeof error === 'object') {
			switch (error.name) {
				case 'SequelizeValidationError':
					label = 'CONFLICT';

					let validationsErrors = error.errors.map(x => {
						if (!x.message) x.message = { name: '', params: undefined };
						return {
							label: x.message.name,
							message: translation.translate(x.message.name, lang, x.message.params),
							name: x.path,
							value: x.value,
							params: x.message.params
						}
					});

					httpResponse = httpStatusCodes.ERROR[label];
					responseCode = errorCodes[label];
					label = validationsErrors[0].label;
					obj = validationsErrors[0].params;
					error = {
						name: error.name,
						errors: validationsErrors
					};
					break;
				case 'EmailInvalidArguments':
				case 'EmailInvalidProperties':
				case 'EmailTemplateCompileError':
				case 'EmailTransportError':
					label = 'INTERNAL_SERVER_ERROR';
					httpResponse = httpStatusCodes.ERROR[label];
					responseCode = errorCodes['EMAIL_ERROR'];

					if (error.name === 'EmailTransportError') {
						label = error.message;
						obj = { email: error.address };
					}

					error = {
						name: error.name,
						message: error.message
					};
					break;
				case 'NotFound':
					label = 'NOT_FOUND';
					httpResponse = httpStatusCodes.ERROR[label];
					responseCode = errorCodes[label];

					if (typeof error.message === 'string') label = error.message + ' | ' + label;

					error = {
						name: error.name,
						message: translation.translate(label, lang, obj)
					};
					break;
				default:
					break;
			}
		}

		if (typeof label !== 'string' || label.trim() === '') label = errorCode;

		const message = translation.translate(label, lang, obj);

		response = {
			errorCode: responseCode.code,
			httpCode: httpResponse.code,
			message: message,
			error: error
		}

		debug(response);

		return res.status(httpResponse.code).json(response);
	} catch (err) {
		debug(err);
	}
}