const express = require('express');
const router = express.Router();

const controller = require('../../controllers/users');

router.route('/')
	.get(controller.get)
	.post(controller.create);

module.exports = router;