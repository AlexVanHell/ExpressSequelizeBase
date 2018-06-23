const express = require('express');
const router = express.Router();

const controller = require('../../controllers/login');
const validations = require('../../lib/request-validations');

router.post('/login', validations.validate('login'), controller.login);

router.route('/recovery')
	.get(controller.verifyRecovery)
	.post(controller.recovery);

router.post('/restore', controller.restore);

router.post('/update-password', controller.update);

module.exports = router;