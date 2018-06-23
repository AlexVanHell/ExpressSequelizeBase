const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

module.exports = [
	body('firstName').exists().matches(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ \s]*$/),
	body('lastName').exists().matches(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ \s]*$/),
	body('email').exists().trim().isEmail(),
	body('phone').isString().matches(/^[0-9]*$/).isLength({ min: 7, max: 15 }).optional(),
	body('active').isBoolean().optional(),
	body('privilege').optional(),
	body('privilege.id').matches(/^[0-9]*$/).custom(value => value > 0).optional(),
	body('accesses').isArray().optional(),
	body('accesses.*.id').matches(/^[0-9]*$/).custom(value => value > 0),
	body('accesses.*.access').not().isEmpty(),
	body('accesses.*.access.permission').matches(/^[0-9]*$/).custom(value => value > 0),
	// Sanitize
	sanitizeBody(['firstName', 'lastName', 'email', 'phone']).trim(),
];