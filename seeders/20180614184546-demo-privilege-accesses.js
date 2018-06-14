'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('privilege_access', [{
			privilege_id: 1,
			access_id: 1,
			from_system: 1,
			permission: 1
		}, {
			privilege_id: 1,
			access_id: 2,
			from_system: 1,
			permission: 1
		}, {
			privilege_id: 2,
			access_id: 1,
			from_system: 1,
			permission: 2
		}, {
			privilege_id: 2,
			access_id: 2,
			from_system: 1,
			permission: 2
		}], {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('privilege_access', {}, {});
	}
};
