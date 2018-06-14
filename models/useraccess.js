'use strict';
module.exports = (sequelize, DataTypes) => {
	var UserAccess = sequelize.define('UserAccess', {
		name: DataTypes.STRING,
		description: DataTypes.STRING,
		active: DataTypes.BOOLEAN,
		visible: DataTypes.BOOLEAN,
		userId: DataTypes.INTEGER,
		accessId: DataTypes.INTEGER
	}, {});
	UserAccess.associate = function (models) {
		// associations can be defined here
	};
	return UserAccess;
};