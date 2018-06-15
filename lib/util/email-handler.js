const Promise = require('bluebird');

const templateCompiler = require('../common/template-compiler');
const mailer = require('../common/mailer');
const settings = require('../../settings');

/**
 * 
 * @param obj Parameters @type {Object.<any>}
 * @property obj.to @type {string | Array.<string>} Email(s) to send
 * @property obj.body @type {string} Email body (html)
 */
exports.sendMail = function (obj) {
	if (typeof obj !== 'object') {
		return Promise.reject({ type: 'EMAIL', code: 'INVALID_PARAM_TYPE', message: 'Argument must be an object' });
	}

	if (!obj.to || !obj.body) {
		return Promise.reject({ type: 'EMAIL', code: 'NO_PARAMS', message: 'First argument must have "to" and "body" properties, got: [ to: ' + params.to + ', body: ' + params.body + ']' });
	}

	const IMAGES_URL = settings.MAIL_CONFIG.IMAGES_URL;
	const FROM_ADDRESS = settings.MAIL_CONFIG.ACCOUNT_USER;
	const TO_ADDRESS = obj.to;
	const SUBJECT = settings.APP.NAME + ' | ' + obj.subject;
	const CC_RECIPIENTS = obj.cc;
	const BODY = obj.body;
	const TEMPLATE_NAME = obj.template || 'confirmation';

	let data = {
		title: obj.subject,
		from: FROM_ADDRESS,
		email: TO_ADDRESS,
		body: BODY,
		staticURL: IMAGES_URL
	};

	return new Promise(function (resolve, reject) {
		templateCompiler.compile(TEMPLATE_NAME, data, function (err, html) {
			if (err) {
				return reject({
					type: 'EMAIL',
					code: 'COMPILE_ERROR',
					message: 'Problem compiling template(double check relative path): ' + TEMPLATE_NAME
				});
			}
			// now we have the html populated with our data so lets send an email!
			mailer.sendMail({ from: FROM_ADDRESS, to: TO_ADDRESS, subject: SUBJECT, content: html, cc: CC_RECIPIENTS }, function (err, success) {
				if (err) {
					return reject({
						type: 'EMAIL',
						code: 'TRANSPORT_ERROR',
						message: 'Problem sending email to:' + TO_ADDRESS,
						error: err
					});
				}
				// Yay! Email was sent, now either do some more stuff or send a response back to the client
				return resolve({
					type: 'EMAIL',
					code: 'SUCCESS',
					result: success,
					mail: {
						from: FROM_ADDRESS,
						to: TO_ADDRESS,
						subject: SUBJECT,
						content: html,
						cc: CC_RECIPIENTS
					}
				});
			});
		});
	});
};