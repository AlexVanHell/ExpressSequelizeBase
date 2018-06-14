'use strict';
module.exports = (sequelize, DataTypes) => {
	var Access = sequelize.define('Access', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
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
		order: {
			type: DataTypes.INTEGER,
			allowNull: false,
			//defaultValue: 1,
		},
		moduleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				table: 'module',
				field: 'id'
			},
			field: 'module_id'
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
			tableName: 'access'
		});
	Access.associate = function (models) {
		// associations can be defined here
		Access.belongsTo(models.Module, { foreignKey: 'module_id' });
		Access.belongsToMany(models.Person, { through: models.PersonAccess });
		Access.belongsToMany(models.Privilege, { through: models.PrivilegeAccess });
	};
	return Access;
};