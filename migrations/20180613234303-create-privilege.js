'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('privilege', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING({ length: 80 }),
				allowNull: false
			},
			description: {
				type: Sequelize.STRING({ length: 140 }),
				allowNull: false
			},
			active: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
			visible: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: true,
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
		return queryInterface.dropTable('privilege');
	}
};