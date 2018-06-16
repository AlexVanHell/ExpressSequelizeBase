'use strict';
module.exports = (sequelize, DataTypes) => {
	var Privilege = sequelize.define('Privilege', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		name: {
			type: DataTypes.STRING({ length: 80 }),
			allowNull: false,
			validate: {
				isUnique (value) {
					const self = this;

					return Privilege.findOne({ where: { name: value, visible: true } })
						.then(function (user) {
							// reject if a different user wants to use the same email
							if (user && self.id !== user.id) {
								throw new Error(constants.STRINGS.NAME_IN_USE);
							}
						})
						.catch(function (err) {
							return next(err);
						});
				}
			}
		},
		description: {
			type: DataTypes.STRING({ length: 140 }),
			allowNull: false
		},
		active: {
			type: DataTypes.BOOLEAN,
			//allowNull: false,
			//defaultValue: true,
		},
		visible: {
			type: DataTypes.BOOLEAN,
			//allowNull: false,
			//defaultValue: true,
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
		tableName: 'privilege',
		underscored: true
	});
	// Associations
	Privilege.associate = function (models) {
		// associations can be defined here
		Privilege.belongsToMany(models.Access, { 
			through: models.PrivilegeAccess,
			as: 'accesses'
		});

		Privilege.hasMany(models.PrivilegeAccess, {
			as: 'accessRelation'
		})

		Privilege.hasMany(models.Person);
	};
	return Privilege;
};