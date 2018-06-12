const Sequelize = require('sequelize');
const settings = require('../../settings');

const engine = settings.DB.MYSQL;

const sequelize = new Sequelize(engine.DATABASE, engine.USERNAME, engine.PASSWORD, {
	host: engine.HOST,
	dialect: engine.DIALECT, // | 'sqlite' | 'postgres' | 'mssql' 
	operatorsAliases: false,
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
	// SQLite only
	//storage: 'path/to/database.sqlite'
});

module.exports = sequelize;