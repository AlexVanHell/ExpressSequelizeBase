const sequelize = require('../lib/database/sequelize');

const User = sequelize.define('user', {
	first_name: {
		type: Sequelize.STRING
	},
	last_name: {
		type: Sequelize.STRING
	}
});

module.exports = User;