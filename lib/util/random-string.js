/** 
 * @param length @type {number} Length of the random string
 * @returns {string} {string} Random string
 */

module.exports = function (length) {
	let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let text = '';

	for (let i = 0; i < length; i++) {
		text += charset.charAt(Math.floor(Math.random() * charset.length));
	}

	return text;
}