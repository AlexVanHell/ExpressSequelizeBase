'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('privilege', [{
			id: 1,
			name: 'Master Lectura',
			description: 'Administración de usuarios con todos los permisos de lectura',
			from_system: 1
		}, {
			id: 2,
			name: 'Master Escritura',
			description: 'Administración de usuarios con todos los permisos de escritura',
			from_system: 1
		}], {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('privilege', {
			id: [1, 2]
		}, {}, { primaryKeys: [], primaryKeyAttributes: [] });
	}
};
