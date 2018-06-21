'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(__filename);
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.js')[env];
var db = {};

if (config.use_env_variable) {
	var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

sequelize.addHook('beforeDefine', function(attributes) {
	Object.keys(attributes).forEach(function (name) {
		if (typeof attributes[name] !== 'function') {
			let attribute = attributes[name];
			const _underscored = attribute.underscored === undefined ? sequelize.options.define.underscored : attribute.underscored;
			if (attribute.field === undefined && _underscored !== undefined) {
				attribute.field = sequelize.Utils.underscoredIf(name, _underscored);
			}
		}
	});
});

fs
	.readdirSync(__dirname)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	})
	.forEach(file => {
		var model = sequelize['import'](path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
