'use strict';

const random = require('../lib/util').randomString;

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('person', 'password', {
			type: Sequelize.STRING({ length: 80 }),
			allowNull: false,
			defaultValue: random(12)
		}).then(function() {
			return queryInterface.addColumn('person', 'active', {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			});
		}).then(function() {
			return queryInterface.addColumn('person', 'visible', {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			})
		}).then(function() {
			/* return queryInterface.addColumn('person', '', {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			}) */
		})
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.
	
		  Example:
		  return queryInterface.dropTable('users');
		*/
	}
};
