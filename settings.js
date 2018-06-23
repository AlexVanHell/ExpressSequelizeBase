const envs = require('./environments');
const env = process.env.NODE_ENV || 'development';
const environment = envs[env];


// Production Mode
exports.PRODUCTION = environment.PRODUCTION;

// App Info
exports.APP = environment.APP;

// JSON Web Token Settings
exports.JWT = environment.JWT;

// Databases Settings
exports.DB = environment.DB;

// Email settings
exports.MAIL_CONFIG = environment.MAIL_CONFIG;