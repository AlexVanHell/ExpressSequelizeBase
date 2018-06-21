const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

// Existing environments
const environments = {};

fs.readdirSync(__dirname)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	})
	.map(file => {
		const result = file.split('.');
		const name = result[result.length - 2];

		return { file: file.replace('.js', ''), name: name === 'environment' ? 'development' : name };
	})
	.forEach(item => {
		environments[item.name] = require('./' + item.file);
	});

/** 
 * Environments
 */
module.exports = environments;