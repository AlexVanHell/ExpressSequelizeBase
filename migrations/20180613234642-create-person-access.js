'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('person_access', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			permission: {
				type: Sequelize.INTEGER,
				defaultValue: 1
			},
			personId: {
				type: Sequelize.INTEGER,
				field: 'person_id',
			},
			accessId: {
				type: Sequelize.INTEGER,
				field: 'access_id'
			},
			active: {
				type: Sequelize.BOOLEAN,
				defaultValue: 1
			},
			visible: {
				type: Sequelize.BOOLEAN,
				defaultValue: 1
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
		}).then(function () {
			return queryInterface.addConstraint('person_access', ['person_id'], {
				type: 'foreign key',
				name: 'fk_person_access_person_id',
				references: { //Required field
					table: 'person',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});
		}).then(function () {
			return queryInterface.addConstraint('person_access', ['access_id'], {
				type: 'foreign key',
				name: 'fk_person_access_access_id',
				references: { //Required field
					table: 'access',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.removeConstraint('person_access', 'fk_person_access_access_id', {})
			.then(function () {
				return queryInterface.removeConstraint('person_access', 'fk_person_access_person_id', {})
			}).then(function () {
				return queryInterface.dropTable('person_access');
			});
	}
};