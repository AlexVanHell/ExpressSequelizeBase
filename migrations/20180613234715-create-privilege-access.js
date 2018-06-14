'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('privilege_access', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			permission: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 1
			},
			privilegeId: {
				type: Sequelize.INTEGER,
				field: 'privilege_id'
			},
			accessId: {
				type: Sequelize.INTEGER,
				field: 'access_id'
			},
			active: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 1
			},
			visible: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
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
			return queryInterface.addConstraint('privilege_access', ['privilege_id'], {
				type: 'foreign key',
				name: 'fk_privilege_access_privilege_id',
				references: { //Required field
					table: 'privilege',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			});
		}).then(function () {
			return queryInterface.addConstraint('privilege_access', ['access_id'], {
				type: 'foreign key',
				name: 'fk_privilege_access_access_id',
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
		return queryInterface.removeConstraint('privilege_access', 'fk_privilege_access_access_id', {})
			.then(function () {
				return queryInterface.removeConstraint('privilege_access', 'fk_privilege_access_privilege_id', {})
			}).then(function () {
				return queryInterface.dropTable('privilege_access');
			});
	}
};