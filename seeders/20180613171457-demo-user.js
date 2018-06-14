'use strict';
const bcrypt = require('bcrypt-nodejs');

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('person', [{
			first_name: 'EBitware',
			last_name: 'Admin',
			email: 'edevelop@e-bitware.com',
			phone: '5555555555',
			from_system: 1,
			password: bcrypt.hashSync('admin123', bcrypt.genSaltSync(8), null)
		}, {
			first_name: 'Alejandro Daniel',
			last_name: 'Villarroel Calderón',
			email: 'avillarroel@e-bitware.com',
			phone: '5555555555',
			from_system: 1,
			password: bcrypt.hashSync('admin123', bcrypt.genSaltSync(8), null)
		}], {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('person', {
			email: ['edevelop@e-bitware.com', 'avillarroel@e-bitware.com']
		}, {}, { primaryKeys: [], primaryKeyAttributes: [] });
	}
};
