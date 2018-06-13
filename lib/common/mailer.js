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
	let success = true;
	const mailOptions = {
		from: config.USER_NAME + ' <' + params.from + '>',
		to: params.to,
		//replyTo: params.fromAddress,
		subject: params.subject,
		cc: params.cc,
		html: params.content
	};

	// send the email!
	smtpTransport.sendMail(mailOptions, function (error, response) {
		if (error) {
			console.log('[ERROR] Message NOT sent: ', error);
			success = false;
		} else {
			console.log('[INFO] Message Sent: ' + response.envelope);
		}
		next(error, success);
	});
};