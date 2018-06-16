const fs = require('fs');
const config = require('../settings').DB;

const developmentEngine = config.DEVELOPMENT.MYSQL;
const testEngine = config.TEST.MYSQL;
const productionEngine = config.PRODUCTION.MYSQL;

module.exports = {
	development: {
		username: developmentEngine.USERNAME,
		password: developmentEngine.PASSWORD,
		database: developmentEngine.DATABASE,
		host: developmentEngine.HOST,
		dialect: developmentEngine.DIALECT,
		seederStorage: developmentEngine.SEEDER_STORAGE,
		define: {
			freezeTableNames: true,
			underscored: false
		}
	},
	test: {
		username: testEngine.USERNAME,
		password: testEngine.PASSWORD,
		database: testEngine.DATABASE,
		host: testEngine.HOST,
		dialect: testEngine.DIALECT,
		seederStorage: testEngine.SEEDER_STORAGE,
		define: {
			freezeTableNames: true,
			underscored: false
		}
	},
	production: {
		username: productionEngine.USERNAME,
		password: productionEngine.PASSWORD,
		database: productionEngine.DATABASE,
		host: productionEngine.HOST,
		dialect: productionEngine.DIALECT,
		seederStorage: productionEngine.SEEDER_STORAGE,
		define: {
			freezeTableNames: true,
			underscored: true
		}
		/* dialectOptions: {
			ssl: {
				ca: fs.readFileSync(__dirname + '/mysql-ca-master.crt')
			}
		} */
	}
};