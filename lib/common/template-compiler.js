const pug = require('pug');
const fs = require('fs');
const path = require('path');
const config = require('../../settings').MAIL_CONFIG;

/**  
 * @param templateName Name of the template
 * @param data Data to pass to the template
*/
exports.compile = function (templateName, data, next) {
	const templatePath = path.join(__dirname, config.TEMPLATES_DIR, templateName + '.pug');

	// Get our compiled template by passing path and data to pug
	pug.renderFile(templatePath, data, function (err, compiled) {
		if (err) {
			next('Problem compiling template(double check relative template path): ' + templatePath);
		}
		console.log('[INFO] COMPILED TEMPLATE: '/*, compiled*/);
		next(null, compiled);
	});
};