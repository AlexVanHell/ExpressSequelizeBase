


/**
 * Interpolation. Replaces "{{}}" with obj attribute name
 * @param {string} string String to interpolate
 * @param {Object.<any>} obj Object with variables to make interpolation
 * @returns {string}
 */
module.exports = function (string, obj) {
	if (typeof string !== 'string' || string.trim() === '') return '';

	if (!obj) obj = {};

	const regex = /{{\s?[\w\s]*\s?}}/g;
	const replaceBraces = /[{}]/g;

	if (!regex.test(string)) return string;

	const variables = string.match(regex);

	variables.forEach((item) => {
		const varName = item.replace(replaceBraces, '');
		let value = obj[varName] || '';
		const varRegexReplace = new RegExp('\{\{(?:\\s+)?(' + varName + ')(?:\\s+)?\}\}')

		string = string.replace(varRegexReplace, value ? value : '');
	});

	return string;
}