'use strict';
module.exports = (sequelize, DataTypes) => {
	var Module = sequelize.define('Module', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER,
		},
		name: {
			type: Sequelize.STRING({ length: 50 }),
			allowNull: false
		},
		description: {
			type: Sequelize.STRING({ length: 140 }),
			allowNull: false
		},
		active: {
			type: Sequelize.BOOLEAN,
			//defaultValue: true,
		},
		visible: {
			type: Sequelize.BOOLEAN,
			//defaultValue: true,
		},
		createdAt: {
			allowNull: false,
			type: Sequelize.DATE(3),
			//defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
			field: 'created_at'
		},
		updatedAt: {
			allowNull: false,
			type: Sequelize.DATE(3),
			//defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'),
			field: 'updated_at'
		}
	}, {});
	Module.associate = function (models) {
		// associations can be defined here
		Module.hasMany(model.Access);
	};
	return Module;
};