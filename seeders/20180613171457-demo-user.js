'use strict';
const bcrypt = require('bcrypt-nodejs');

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('person', [{
			id: 1,
			first_name: 'EBitware',
			last_name: 'Admin',
			username: 'abitware',
			email: 'edevelop@e-bitware.com',
			phone: '5555555555',
			from_system: 1,
			verified: true,
			password: bcrypt.hashSync('admin123', bcrypt.genSaltSync(8), null)
		}, {
			id: 2,
			first_name: 'Alejandro Daniel',
			last_name: 'Villarroel Calderón',
			username: 'avillarroel',
			email: 'avillarroel@e-bitware.com',
			phone: '5555555555',
			from_system: 1,
			verified: true,
			password: bcrypt.hashSync('admin123', bcrypt.genSaltSync(8), null)
		}], {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('person', {
			email: ['edevelop@e-bitware.com', 'avillarroel@e-bitware.com']
		}, {}, { primaryKeys: [], primaryKeyAttributes: [] });
	}
};
