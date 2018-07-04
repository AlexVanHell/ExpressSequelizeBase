const Promise = require('bluebird');

const templateCompiler = require('../common/template-compiler');
const mailer = require('../common/mailer');
const settings = require('../../settings');
const constants = require('../../constants');

/**
 * Send mail using pug template
 * @param {Object.<any>} obj Parameters
 * @property {string | Array.<string>} obj.to Email(s) to send
 * @property {string} obj.body  Email body (html)
 * @property {string} obj.subject  Email subject
 * @property {string | Array.<string>} obj.cc  Email CC
 * @property {string} obj.template Template name
 * @returns {Promise.<any>} Promise.<any>
 */
module.exports = function (obj) {
	if (typeof obj !== 'object') {
		return Promise.reject({
			type: 'EmailError',
			name: 'EmailInvalidArguments',
			message: 'Argument must be an object'
		});
	}

	if (!obj.to || !obj.body || !obj.subject) {
		return Promise.reject({
			type: 'EmailError',
			name: 'EmailInvalidProperties',
			message: 'First argument must have "to", "body" and "subject" properties, got: { to: ' + obj.to + ', body: ' + obj.body + ', subject: ' + obj.subject + ' }'
		});
	}

	const imagesURL = settings.MAIL_CONFIG.IMAGES_URL;
	const from = settings.MAIL_CONFIG.ACCOUNT_USER;
	const to = obj.to;
	const subject = settings.APP.NAME + ' | ' + obj.subject;
	const cc = obj.cc;
	const body = obj.body;
	const templateName = obj.template || 'confirmation';

	let data = {
		title: obj.subject,
		from: from,
		email: to,
		body: body,
		imagesURL: imagesURL
	};

	return new Promise(function (resolve, reject) {
		templateCompiler.compile(templateName, data, function (err, html) {
			if (err) {
				return reject({
					type: 'EmailError',
					name: 'EmailTemplateCompileError',
					message: 'Problem compiling template: ' + templateName
				});
			}

			mailer.sendMail({ from: from, to: to, subject: subject, content: html, cc: cc },
				function (err, info) {
					if (err) {
						return reject({
							type: 'EmailError',
							name: 'EmailTransportError',
							message: 'PROBLEM_SENDING_EMAIL',
							address: to,
							error: err
						});
					}

					resolve({
						result: info,
						mail: { from: from, to: to, subject: subject, content: html, cc: cc }
					});
				});
		});
	});
};