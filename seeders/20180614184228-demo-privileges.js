'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('privilege', [{
			name: 'Master Lectura',
			description: 'Administración de usuarios con todos los permisos de lectura',
			from_system: 1
		}, {
			name: 'Master Escritura',
			description: 'Administración de usuarios con todos los permisos de escritura',
			from_system: 1
		}], {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('privilege', {
			name: ['Master Lectura', 'Master Escritura']
		}, {}, { primaryKeys: [], primaryKeyAttributes: [] });
	}
};
