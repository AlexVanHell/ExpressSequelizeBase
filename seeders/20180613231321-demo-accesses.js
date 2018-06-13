'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('access', [{
			name: 'Usuarios',
			description: 'Administración de usuarios de tipo administrador',
			module_id: 1
		}, {
			name: 'Roles',
			description: 'Administración de roles para administradores',
			module_id: 1
		}], {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('access', [{
			name: 'Usuarios'
		}, {
			name: 'Roles'
		}], {});
	}
};
