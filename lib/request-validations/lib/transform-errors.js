
/**
 * Transform express validator errors
 * @param {Object.<any>} errors Mapped errors
 * @returns {Array.<any>}
 */
module.exports = function (errors) {
	const errArray = [];

	for (const err in errors) {
		let index = errArray.findIndex(x => x.location === errors[err].location);

		if (index < 0) {
			errArray.push({ location: errors[err].location, attrs: [] });
			index = errArray.length - 1;
		}

		errArray[index].attrs.push({ name: err, message: errors[err].msg });
	}

	return errArray;
}