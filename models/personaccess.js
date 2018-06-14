'use strict';
module.exports = (sequelize, DataTypes) => {
	var PersonAccess = sequelize.define('PersonAccess', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		permission: {
			type: DataTypes.INTEGER,
			//defaultValue: 1
		},
		personId: {
			type: DataTypes.INTEGER,
			references: {
				table: 'person',
				field: 'id'
			},
			field: 'person_id',
		},
		accessId: {
			type: DataTypes.INTEGER,
			references: {
				table: 'access',
				field: 'id'
			},
			field: 'access_id'
		},
		active: {
			type: DataTypes.BOOLEAN,
			//defaultValue: 1
		},
		visible: {
			type: DataTypes.BOOLEAN,
			//defaultValue: 1
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
			tableName: 'person_access'
		});
	PersonAccess.associate = function (models) {
		// associations can be defined here
	};
	return PersonAccess;
};