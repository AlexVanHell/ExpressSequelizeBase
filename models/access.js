'use strict';
module.exports = (sequelize, DataTypes) => {
	var Access = sequelize.define('Access', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		name: {
			type: DataTypes.STRING({ length: 50 }),
			allowNull: false
		},
		description: {
			type: DataTypes.STRING({ length: 140 }),
			allowNull: false
		},
		active: {
			type: DataTypes.BOOLEAN
			//defaultValue: true,
		},
		visible: {
			type: DataTypes.BOOLEAN
			//defaultValue: true,
		},
		order: {
			type: DataTypes.INTEGER
			//defaultValue: 1,
		},
		moduleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Module',
				key: 'id'
			},
			field: 'module_id'
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
	}, {});
	Access.associate = function (models) {
		// associations can be defined here
		Access.belongsTo(models.Module, { foreignKey: 'module_id' });
	};
	return Access;
};