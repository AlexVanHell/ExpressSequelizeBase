'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.sequelize.query('UPDATE `person` SET `privilege_id` = 1 WHERE `id` IN (1,2)');
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.sequelize.query('UPDATE `person` SET `privilege_id` = NULL WHERE `id` IN (1,2)');
	}
};
