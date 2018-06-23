const check = require('./check');
const responseHandler = require('../util/http-response-handler');

/**
 * Authenticate request adding req.decoded that contains the responsible user
 * @param {Request} req Express request
 * @param {Response} res Express response
 * @param {function} next Callback
 * @returns {void} Pass to the next function
 */
module.exports = async function (req, res, next) {
	let token = req.headers.authorization;

	try {
		if (typeof token !== 'string' || token === '') {
			throw {
				name: 'NoTokenProvided',
				message: 'NO_TOKEN_PROVIDED'
			}
		}

		const data = await check(token);

		req.decoded = data;
		next();
	} catch (err) {
		let httpCode = 'UNAUTHORIZED';
		let errorCode = 'INVALID_TOKEN';

		if (err.name === 'NoTokenProvided') {
			errorCode = err.message;
		}

		return responseHandler.handleError(req, res, err, httpCode, errorCode);
	}
}

