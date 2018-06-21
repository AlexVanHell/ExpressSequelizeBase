const express = require('express');
const router = express.Router();

const loginRouter = require('./login');
const usersRouter = require('./users');
const privilegesRouter = require('./privileges');
const verificationsRouter = require('./verifications');

// Login
router.use('/', loginRouter);

// Users
router.use('/users', usersRouter);

// Privileges
router.use('/privileges', privilegesRouter);

// Email verification
router.use('/verification', verificationsRouter);

module.exports = router;