const express = require('express');
const router = express.Router();

const controller = require('../../controllers/login');
const validations = require('../../lib/request-validations');
const auth = require('../../lib/auth');

router.route('/login')
	.post(validations.validate('login'), controller.login);

router.route('/recovery')
	.get(controller.verifyRecovery)
	.post(controller.recovery);

router.route('/restore')
	.post(controller.restore);

router.route('/update-password')
	.post(auth.authRequest, controller.update);

module.exports = router;