const maxLimit = 100;
const minLimit = 1;
const minOffset = 0;
const defaultLimit = 20;

/**
 * 
 * @param {number} limit Limit must be greater than 0 and lower than or equal to 100. If undefined or null = 20
 * @param {number} offset Offset must be greater than -1. If undefined or null = 0
 * @returns {Object.<any>} { limit: number, offset: number }
 */
module.exports = function (limit, offset) {
	if (!limit) limit = defaultLimit;
	if (!offset) offset = minOffset;

	if (isNaN(limit)) throw new Error('Argument "limit" must be a number');
	if (isNaN(offset)) throw new Error('Argument "offset" must be a number');

	if (limit > maxLimit) limit = maxLimit;
	if (limit < minLimit) limit = minLimit;
	if (offset < minOffset) offset = minOffset;

	return { limit: parseInt(limit), offset: parseInt(offset) };
}