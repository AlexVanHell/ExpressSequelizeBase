const express = require('express');
const router = express.Router();

const loginRouter = require('./login');
const usersRouter = require('./users');
const privilegesRouter = require('./privileges');

router.use('/', loginRouter);
router.use('/users', usersRouter);
router.use('/privileges', privilegesRouter);

module.exports = router;