'use strict';
module.exports = (sequelize, DataTypes) => {
	var User = sequelize.define('User', {
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
			validate: {
				isEmail: true
			}
		},
		phone: {
			type: DataTypes.STRING
		},
		/* password: {
			type: DataTypes.STRING({ length: 80 }),
			allowNull: false
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
		}, */
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE(3),
			//defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
			field: 'created_at'
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE(3),
			//defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
			field: 'updated_at'
		}
	}, {
			tableName: 'person'
		});
	User.associate = function (models) {
		// associations can be defined here
	};
	User.prototype.generateHash = function (password) {
		return bcrypt.hash(password, bcrypt.genSaltSync(8));
	};
	User.prototype.validPassword = function (password) {
		return bcrypt.compare(password, this.password);
	}
	User.prototype.toJSON = function () {
		var values = Object.assign({}, this.get());

		delete values.password;
		return values;
	}

	return User;
};