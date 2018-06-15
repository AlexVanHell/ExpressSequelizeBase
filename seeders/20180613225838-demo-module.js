'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('module', [{
			id: 1,
			name: 'Seguridad',
			description: 'Modulo de seguridad',
			from_system: 1
		}], {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('module', {
			id: 1
		}, {}, { primaryKeys: [], primaryKeyAttributes: [] });
	}
};
