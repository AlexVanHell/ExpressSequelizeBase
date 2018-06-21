const express = require('express');
const router = express.Router();

const controller = require('../../controllers/verifications');

router.route('/')
	.get(controller.verifyEmail)
	.post(controller.sendEmailVerificationToken);

module.exports = router;