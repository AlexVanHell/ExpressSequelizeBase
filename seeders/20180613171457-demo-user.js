'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('person', [{
			first_name: 'EBitware',
			last_name: 'Admin',
			email: 'avillarroel@e-bitware.com',
			phone: '5555555555'
		}], {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('person', [{
			first_name: 'EBitware',
			last_name: 'Admin'
		}], {});
	}
};
