const express = require('express');
const router = express.Router();

const controller = require('../../controllers/users');

router.route('/')
	.get(controller.get)
	.post(controller.create);

router.route('/:id')
	.get(controller.getById)
	.put(controller.update)
	.delete(controller.delete);

module.exports = router;