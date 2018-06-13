'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('module', [{
			name: 'Seguridad',
			description: 'Modulo de seguridad',
		}], {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('module', [{
			name: 'Seguridad',
			description: 'Modulo de seguridad',
		}], {});
	}
};
