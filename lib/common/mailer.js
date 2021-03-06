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
	const options = {
		from: config.USER_NAME + ' <' + params.from + '>',
		to: params.to,
		//replyTo: params.fromAddress,
		subject: params.subject,
		cc: params.cc,
		html: params.content
	};

	smtpTransport.sendMail(options, function (err, info) {
		if (err) {
			console.log('[MAIL ERROR] Message not sent: ', err);
			return callback(err);
		} 

		console.log('[MAIL] Message sent: ' + info.envelope);
		callback(null, info);
	});
};