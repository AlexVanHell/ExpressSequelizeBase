'use strict';
const debug = require('debug')('base-line:settings');
const envs = require('./environments');
const env = envs[process.env.NODE_ENV || 'development'];

debug('Using environment "' + (env.NAME || 'no-name') + '"');

// Production Mode
exports.PRODUCTION = env.PRODUCTION;

// App Info
exports.APP = env.APP;

// Host Variables
exports.HOST = env.HOST;

// JSON Web Token Settings
exports.JWT = env.JWT;

// Databases Settings
exports.DB = env.DB;

// Email Settings
exports.MAIL_CONFIG = env.MAIL_CONFIG;