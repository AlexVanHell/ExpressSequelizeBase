const express = require('express');
const router = express.Router();

const controller = require('../../controllers/login');

router.post('/login', controller.login);

router.route('/recovery')
	.get(controller.verifyRecovery)
	.post(controller.recovery);

router.post('/restore', controller.restore);

router.post('/update-password', controller.update);

module.exports = router;