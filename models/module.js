'use strict';
module.exports = (sequelize, DataTypes) => {
	var Module = sequelize.define('Module', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
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
			type: DataTypes.BOOLEAN,
			//defaultValue: true,
		},
		visible: {
			type: DataTypes.BOOLEAN,
			//defaultValue: true,
		},
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE(3),
			//defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
			field: 'created_at'
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE(3),
			//defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'),
			field: 'updated_at'
		}
	}, {});
	Module.associate = function (models) {
		// associations can be defined here
		Module.hasMany(models.Access);
	};
	return Module;
};