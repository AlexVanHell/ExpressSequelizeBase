'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('token', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			value: {
				type: Sequelize.TEXT,
				allowNull: false
			},
			personId: {
				type: Sequelize.INTEGER,
				allowNull: true,
				field: 'person_id'
			},
			verified: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false
			},
			type: {
				type: Sequelize.INTEGER,
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
				defaultValue: false,
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
		}).then(function () {
			return queryInterface.addConstraint('token', ['person_id'], {
				type: 'foreign key',
				name: 'fk_token_person_id',
				references: { //Required field
					table: 'person',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			})
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.removeConstraint('token', 'fk_token_person_id', {})
			.then(function () {
				return queryInterface.dropTable('token');
			});
	}
};