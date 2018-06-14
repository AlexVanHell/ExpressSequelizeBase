const fs = require('fs');
const config = require('../settings').DB;

const developmentEngine = config.MYSQL;
const testEngine = config.MYSQL;
const productionEngine = config.MYSQL;

module.exports = {
	development: {
		username: developmentEngine.USERNAME,
		password: developmentEngine.PASSWORD,
		database: developmentEngine.DATABASE,
		host: developmentEngine.HOST,
		dialect: developmentEngine.DIALECT,
		seederStorage: developmentEngine.SEEDER_STORAGE
	},
	test: {
		username: testEngine.USERNAME,
		password: testEngine.PASSWORD,
		database: testEngine.DATABASE,
		host: testEngine.HOST,
		dialect: testEngine.DIALECT,
		seederStorage: testEngine.SEEDER_STORAGE
	},
	production: {
		username: productionEngine.USERNAME,
		password: productionEngine.PASSWORD,
		database: productionEngine.DATABASE,
		host: productionEngine.HOST,
		dialect: productionEngine.DIALECT,
		seederStorage: productionEngine.SEEDER_STORAGE
		/* dialectOptions: {
			ssl: {
				ca: fs.readFileSync(__dirname + '/mysql-ca-master.crt')
			}
		} */
	}
};