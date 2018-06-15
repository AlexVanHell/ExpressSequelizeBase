'use strict';
const bcrypt = require('bcrypt-nodejs');
const Promise = require('bluebird');

const util = require('../lib/util');

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
		username: {
			type: DataTypes.STRING({ length: 80 }),
			allowNull: false,
			validate: {
				isUnique: function (value, next) {
					var self = this;
					Person.findOne({ where: { username: value, visible: true } })
						.then(function (user) {
							// reject if a different user wants to use the same username
							if (user && self.id !== user.id) {
								return next('El nombre de usuario ya esta en uso');
							}
							return next();
						})
						.catch(function (err) {
							return next(err);
						});
				}
			}
		},
		email: {
			type: DataTypes.STRING({ length: 100 }),
			allowNull: false,
			validate: {
				isUnique: function (value, next) {
					var self = this;
					Person.findOne({ where: { email: value, visible: true } })
						.then(function (user) {
							// reject if a different user wants to use the same username
							if (user && self.id !== user.id) {
								return next('El email ya esta en uso');
							}
							return next();
						})
						.catch(function (err) {
							return next(err);
						});
				}
			}
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
			//allowNull: false,
			//defaultValue: true
		},
		visible: {
			type: DataTypes.BOOLEAN,
			//allowNull: false,
			//defaultValue: true
		},
		fromSystem: {
			type: DataTypes.BOOLEAN,
			//allowNull: false,
			//defaultValue: 0,
			field: 'from_system'
		},
		createdAt: {
			//allowNull: false,
			type: DataTypes.DATE(3),
			//defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
			field: 'created_at'
		},
		updatedAt: {
			//allowNull: false,
			type: DataTypes.DATE(3),
			//defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'),
			field: 'updated_at'
		}
	}, {
			tableName: 'person',
			underscored: true
		});
	Person.associate = function (models) {
		// associations can be defined here
		Person.belongsTo(models.Privilege, {
			as: 'privilege'
		});

		Person.belongsToMany(models.Access, {
			through: models.PersonAccess,
			as: 'accesses'
		});

		Person.hasMany(models.PersonAccess, {
			as: 'userAccesses'
		});
	};
	Person.generateHash = function (password) {
		return Promise.promisify(bcrypt.hash)(password, bcrypt.genSaltSync(8), null);
	};
	Person.generateUsername = function (firstName, lastName) {
		let username = util.generateUsername(firstName, lastName);

		return Person.findAll({
			where: {
				username: {
					[sequelize.Op.like]: '%' + username
				}
			}
		}).then(function (users) {
			if (!users.length) return username;

			let result = username;
			let counter = 1;

			while (result === username) {
				result = username + counter
				counter++;
			}

			return result;
		});
	}
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