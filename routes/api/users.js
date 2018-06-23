const express = require('express');
const router = express.Router();

const controller = require('../../controllers/users');
const validations = require('../../lib/request-validations');
const auth = require('../../lib/auth');

router.route('/')
	.get(controller.get)
	.post(auth.authRequest, validations.validate('createUser'), controller.create);

router.route('/:id')
	.get(controller.getById)
	.put(controller.update)
	.delete(controller.delete);

router.route('/:id/lock')
	.get(controller.lock);

module.exports = router;