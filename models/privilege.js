'use strict';
module.exports = (sequelize, DataTypes) => {
	var Privilege = sequelize.define('Privilege', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		name: {
			type: DataTypes.STRING({ length: 80 }),
			allowNull: false
		},
		description: {
			type: DataTypes.STRING({ length: 140 }),
			allowNull: false
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			//defaultValue: true,
		},
		visible: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			//defaultValue: true,
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
		tableName: 'privilege',
		underscored: true
	});
	Privilege.associate = function (models) {
		// associations can be defined here
		Privilege.belongsToMany(models.Access, { 
			through: models.PrivilegeAccess,
			as: 'accesses'
		});

		Privilege.hasMany(models.Person);
	};
	return Privilege;
};