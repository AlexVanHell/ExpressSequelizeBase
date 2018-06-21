const fs = require('fs');
const settings = require('../settings');

const config = settings.DB.MYSQL;

const object = {
	username: config.USERNAME,
	password: config.PASSWORD,
	database: config.DATABASE,
	host: config.HOST,
	dialect: config.DIALECT,
	seederStorage: config.SEEDER_STORAGE,
	define: {
		freezeTableNames: true,
		underscored: true
	},
};

// Only for production
if ( settings.PRODUCTION ) {
	object.dialectOptions = {
		ssl: {
			ca: fs.readFileSync(__dirname + '/mysql-ca-master.crt')
		}
	}
}

module.exports = object;