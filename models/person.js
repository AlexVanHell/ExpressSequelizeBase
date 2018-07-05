'use strict';
const bcrypt = require('bcrypt-nodejs');
const Promise = require('bluebird');

const constants = require('../constants');
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
				isUnique: function (value) {
					var self = this;

					return Person.findOne({ where: { username: value } })
						.then(function (user) {
							// reject if a different user wants to use the same username
							if (user && self.id !== user.id) {
								throw { name: 'USERNAME_IN_USE', params: { username: user.username } };
							}
						}).catch(function (err) {
							throw err;
						});
				}
			}
		},
		email: {
			type: DataTypes.STRING({ length: 100 }),
			allowNull: false,
			validate: {
				isEmail: {
					msg: 'MUST_BE_EMAIL'
				},
				isUnique(value) {
					const self = this;

					return Person.findOne({ where: { email: value, visible: true } })
						.then(function (user) {
							// reject if a different user wants to use the same email
							if (user && self.id !== user.id) {
								throw { name: 'EMAIL_IN_USE', params: { email: user.email } };
							}
						}).catch(function (err) {
							throw err;
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
		verified: {
			type: DataTypes.BOOLEAN,
			//allowNull: false,
			//defaultValue: true
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

	// Associations
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
			as: 'accessRelation'
		});
	};

	// Hooks
	Person.beforeCreate(function (user, options) {
		user.email = user.email.toLowerCase();

		return Person.generateHash(user.password)
			.then(function (hasedPassword) {		
				user.password = hasedPassword;
			});
	});
	Person.beforeUpdate(function(user, options) {
		user.email = user.email.toLowerCase();
	});

	// Utils
	Person.generateHash = function (password) {
		return Promise.promisify(bcrypt.hash)(password, bcrypt.genSaltSync(8), null);
	};
	Person.generateUsername = function (firstName, lastName) {
		let username = util.generateUsername(firstName, lastName);

		return Person.findAll({
			where: {
				username: {
					[sequelize.Op.like]: '%' + username + '%'
				}
			},
			attributes: ['id', 'username'],
			raw: true
		}).then(function (users) {
			if (!users.length) return username;

			let result = username;
			let counter = 0;

			users = users.filter(x => x.username.length >= username.length);

			while (users[counter] && result === users[counter].username) {
				result = username + (counter + 1)
				counter++;
			}

			return result;
		});
	};

	// Instance Methods
	Person.prototype.validPassword = function (password) {
		return Promise.promisify(bcrypt.compare)(password, this.password);
	};
	Person.prototype.ownsEmail = function (email) {
		return this.email === email;
	};
	Person.prototype.toJSON = function () {
		var values = Object.assign({}, this.get());

		delete values['password'];
		delete values['updated_at'];
		delete values['created_at'];
		delete values['privilege_id'];
		return values;
	};

	return Person;
};