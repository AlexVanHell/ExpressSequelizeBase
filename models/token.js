'use strict';
module.exports = (sequelize, DataTypes) => {
	var Token = sequelize.define('Token', {
		value: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING({ length: 80 }),
			allowNull: false,
			validate: {
				isEmail: true
			}
		},
		personId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				table: 'person',
				field: 'id'
			},
			field: 'person_id'
		},
		verified: {
			type: DataTypes.BOOLEAN,
			//allowNull: false,
			//defaultValue: false
		},
		type: {
			type: DataTypes.INTEGER, // 1 Email verification, 2 Password recovery
			allowNull: false
		},
		active: {
			type: DataTypes.BOOLEAN,
			//allowNull: false,
			//defaultValue: true
		},
		visible: {
			type: DataTypes.BOOLEAN,
			//allowNull: false,
			//defaultValue: true
		},
		fromSystem: {
			type: DataTypes.BOOLEAN,
			//allowNull: false,
			//defaultValue: 0,
			field: 'from_system'
		},
		createdAt: {
			//allowNull: false,
			type: DataTypes.DATE(3),
			//defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
			field: 'created_at'
		},
		updatedAt: {
			//allowNull: false,
			type: DataTypes.DATE(3),
			//defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'),
			field: 'updated_at'
		}
	}, {
			tableName: 'token',
			underscored: true
		});

	// Associations
	Token.associate = function (models) {
		Token.belongsTo(models.Person, { as: 'person' });
	};

	return Token;
};