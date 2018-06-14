'use strict';
module.exports = (sequelize, DataTypes) => {
	var Roll = sequelize.define('Roll', {
		name: DataTypes.STRING,
		description: DataTypes.STRING,
		active: DataTypes.BOOLEAN,
		visible: DataTypes.BOOLEAN,
		fromSystem: DataTypes.BOOLEAN
	}, {});
	Roll.associate = function (models) {
		// associations can be defined here
	};
	return Roll;
};