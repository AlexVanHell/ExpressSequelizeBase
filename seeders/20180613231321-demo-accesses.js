'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('access', [{
			id: 1,
			name: 'Usuarios',
			description: 'Administración de usuarios de tipo administrador',
			module_id: 1,
			order: 1,
			from_system: 1
		}, {
			id: 2,
			name: 'Roles',
			description: 'Administración de roles para administradores',
			module_id: 1,
			order: 2,
			from_system: 1
		}], {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('access', {
			id: [1, 2]
		}, {}, { primaryKeys: [], primaryKeyAttributes: [] });
	}
};
