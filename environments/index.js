

/**
 * Available environments. Add new property if is required to use another enviroment.
 *
 * [development,
 * production,
 * test]
*/

exports.development = require('./environment');
exports.production = require('./environment.production');
exports.test = require('./environment.test');