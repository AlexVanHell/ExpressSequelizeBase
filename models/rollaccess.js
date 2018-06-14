'use strict';
module.exports = (sequelize, DataTypes) => {
	var RollAccess = sequelize.define('RollAccess', {
		name: DataTypes.STRING,
		description: DataTypes.STRING,
		active: DataTypes.BOOLEAN,
		visible: DataTypes.BOOLEAN,
		rollId: DataTypes.INTEGER,
		accessId: DataTypes.INTEGER
	}, {});
	RollAccess.associate = function (models) {
		// associations can be defined here
	};
	return RollAccess;
};