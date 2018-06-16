const nodemailer = require('nodemailer');
const config = require('../../settings').MAIL_CONFIG;

const smtpTransport = nodemailer.createTransport({
	host: config.HOST,
	port: config.PORT,
	secure: config.SECURE,
	auth: {
		user: config.ACCOUNT_EMAIL_ADDRESS,
		pass: config.ACCOUNT_PASSWORD
	}
});

/**
 * Send email using nodemailer
 * @param {Object.<any>} params Email params
 * @property {string} params.from Sender email 
 * @property {string | Array.<string>} params.to Recipient email(s) 
 * @property {string} params.subject Email subject 
 * @property {string} params.cc Copied recipient email(s) 
 * @property {string} params.html Email body 
 * @param {function} callback Callback function
 */

exports.sendMail = function (params, callback) {
	let success = '[INFO] Message Sent: ';

	const options = {
		from: config.USER_NAME + ' <' + params.from + '>',
		to: params.to,
		//replyTo: params.fromAddress,
		subject: params.subject,
		cc: params.cc,
		html: params.content
	};

	smtpTransport.sendMail(options, function (err, response) {
		if (err) {
			console.log('[MAIL ERROR] Message Not sent: ', err);
			success = '[MAIL ERROR] Message Not sent: ';
		} else {
			console.log('[MAIL] Message sent: ' + response.envelope);
		}
		callback(err, success);
	});
};