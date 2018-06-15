'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('person', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			firstName: {
				type: Sequelize.STRING({ length: 80 }),
				allowNull: false,
				field: 'first_name'
			},
			lastName: {
				type: Sequelize.STRING({ length: 80 }),
				allowNull: false,
				field: 'last_name'
			},
			username: {
				type: Sequelize.STRING({ length: 80 }),
				allowNull: false
			},
			email: {
				type: Sequelize.STRING({ length: 100 }),
				allowNull: false,
			},
			phone: {
				type: Sequelize.STRING
			},
			password: {
				type: Sequelize.STRING({ length: 80 }),
				allowNull: false
			},
			active: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: true
			},
			visible: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: true
			},
			fromSystem: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
				field: 'from_system'
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE(3),
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
				field: 'created_at'
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE(3),
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'),
				field: 'updated_at'
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('person');
	}
};