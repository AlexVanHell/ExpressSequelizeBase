'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('access', 'module_id', {
			type: Sequelize.INTEGER,
			allowNull: false,
		}).then(function () {
			return queryInterface.addConstraint('access', ['module_id'], {
				type: 'foreign key',
				name: 'fk_access_module_id',
				references: { //Required field
					table: 'module',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeConstraint('access', 'fk_access_module_id', {})
			.then(function () {
				return queryInterface.removeColumn('access', 'module_id', {});
			});
	}
};
