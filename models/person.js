'use strict';
const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
	var Person = sequelize.define('Person', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		firstName: {
			type: DataTypes.STRING({ length: 80 }),
			allowNull: false,
			field: 'first_name'
		},
		lastName: {
			type: DataTypes.STRING({ length: 80 }),
			allowNull: false,
			field: 'last_name'
		},
		email: {
			type: DataTypes.STRING({ length: 100 }),
			allowNull: false,
		},
		phone: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.STRING({ length: 80 }),
			allowNull: false
		},
		privilegeId: {
			type: DataTypes.INTEGER,
			references: {
				table: 'privilege',
				field: 'id'
			},
			field: 'privilege_id'
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			//defaultValue: true
		},
		visible: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			//defaultValue: true
		},
		fromSystem: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			//defaultValue: 0,
			field: 'from_system'
		},
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE(3),
			//defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
			field: 'created_at'
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE(3),
			//defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'),
			field: 'updated_at'
		}
	}, {
			tableName: 'person'
		});
	Person.associate = function (models) {
		// associations can be defined here
		Person.hasOne(models.Privilege);
		Person.hasMany(models.Access, { as: 'access' });
	};
	Person.prototype.generateHash = function (password) {
		return bcrypt.hash(password, bcrypt.genSaltSync(8));
	};
	Person.prototype.validPassword = function (password) {
		return bcrypt.compare(password, this.password);
	}
	Person.prototype.toJSON = function () {
		var values = Object.assign({}, this.get());

		delete values.password;
		return values;
	}

	return Person;
};