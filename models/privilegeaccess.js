'use strict';
module.exports = (sequelize, DataTypes) => {
	var PrivilegeAccess = sequelize.define('PrivilegeAccess', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		permission: {
			type: DataTypes.INTEGER,
			allowNull: false,
			//defaultValue: 1
		},
		privilegeId: {
			type: DataTypes.INTEGER,
			references: {
				table: 'privilege',
				field: 'id'
			},
			field: 'privilege_id'
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
			allowNull: false,
			//defaultValue: 1
		},
		visible: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
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
			tableName: 'privilege_access'
		});
	PrivilegeAccess.associate = function (models) {
		// associations can be defined here
	};
	return PrivilegeAccess;
};