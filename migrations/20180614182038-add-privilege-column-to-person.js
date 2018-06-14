'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('person', 'privilege_id', {
			type: Sequelize.INTEGER,
			allowNull: true,
		}).then(function () {
			return queryInterface.addConstraint('person', ['privilege_id'], {
				type: 'foreign key',
				name: 'fk_person_privilege_id',
				references: { //Required field
					table: 'privilege',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			})
		});

	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeConstraint('person', 'fk_person_privilege_id', {})
			.then(function () {
				return queryInterface.removeColumn('person', 'privilege_id', {});
			});
	}
};
