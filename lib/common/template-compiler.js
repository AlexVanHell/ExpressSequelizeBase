const pug = require('pug');
const fs = require('fs');
const path = require('path');
const config = require('../../settings').MAIL_CONFIG;

/**  
 * @param {string} templateName Name of the template
 * @param {Object.<any>} data Data to pass to the template
 * @param {function} callback Callback function
*/
exports.compile = function (templateName, data, callback) {
	const templatePath = path.join(__dirname, config.TEMPLATES_DIR, templateName + '.pug');

	// Get our compiled template by passing path and data to pug
	pug.renderFile(templatePath, data, function (err, compiled) {
		if (err) {
			console.log(err);
			return callback('Problem compiling template(double check relative template path):' + templatePath);
		}
		console.log('[MAIL] Compiled Template: '/*, compiled*/);
		callback(null, compiled);
	});
};