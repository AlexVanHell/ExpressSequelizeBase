'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('person_access', [{
			person_id: 1,
			access_id: 1,
			from_system: 1,
			permission: 2
		}, {
			person_id: 1,
			access_id: 2,
			from_system: 1,
			permission: 2
		}, {
			person_id: 2,
			access_id: 1,
			from_system: 1,
			permission: 2
		}, {
			person_id: 2,
			access_id: 2,
			from_system: 1,
			permission: 2
		}], {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('person_access', {}, {});
	}
};
