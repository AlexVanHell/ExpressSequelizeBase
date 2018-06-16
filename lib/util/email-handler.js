const Promise = require('bluebird');

const templateCompiler = require('../common/template-compiler');
const mailer = require('../common/mailer');
const settings = require('../../settings');

/**
 * 
 * @param {Object.<any>} obj Parameters 
 * @property {string | Array.<string>} obj.to Email(s) to send
 * @property {string} obj.body  Email body (html)
 * @property {string} obj.subject  Email subject
 * @returns {Promise.<any>} Promise.<any>
 */
exports.sendMail = function (obj) {
	if (typeof obj !== 'object') {
		return Promise.reject({
			type: 'EMAIL',
			code: 'INVALID_ARGUMENTS',
			message: 'Argument must be an object'
		});
	}

	if (!obj.to || !obj.body || !obj.subject) {
		return Promise.reject({
			type: 'EMAIL',
			code: 'INVALID_PROPERTIES',
			message: 'First argument must have "to" and "body" properties, got: { to: ' + obj.to + ', body: ' + obj.body + ', subject: ' + obj.subject + ' }'
		});
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
			} else {
				mailer.sendMail({
					from: FROM_ADDRESS,
					to: TO_ADDRESS,
					subject: SUBJECT,
					content: html,
					cc: CC_RECIPIENTS
				}, function (err, success) {
					if (err) {
						return reject({
							type: 'EMAIL',
							code: 'TRANSPORT_ERROR',
							message: 'Problem sending email to:' + TO_ADDRESS,
							error: err
						});
					}
					
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
			}
		});
	});
};