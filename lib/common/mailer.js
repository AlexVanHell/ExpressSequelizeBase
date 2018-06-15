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

// Public method that actually sends the email
exports.sendMail = function (params, next) {
	let success = '[INFO] Message Sent: ';

	const options = {
		from: config.USER_NAME + ' <' + params.from + '>',
		to: params.to,
		//replyTo: params.fromAddress,
		subject: params.subject,
		cc: params.cc,
		html: params.content
	};

	// send the email!
	smtpTransport.sendMail(options, function (err, response) {
		if (err) {
			console.log('[MAIL ERROR] Message Not sent: ', err);
			success = '[MAIL ERROR] Message Not sent: ';
		} else {
			console.log('[MAIL] Message sent: ' + response.envelope);
		}
		next(err, success);
	});
};