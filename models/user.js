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
	return User;
};