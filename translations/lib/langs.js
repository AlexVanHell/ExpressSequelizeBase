'use strict';

const fs = require('fs');
const path = require('path');

const langs = {};

/**
 * Returns the absolute file path
 * @param {string} file name of the file
 * @returns {string}
 */
const getFilePath = function (file) {
	return path.join(__dirname, '..', file);
}

fs.readdirSync(path.join(__dirname, '..'))
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file.slice(-5) === '.json');
	})
	.forEach(file => {
		const name = file.replace('.json', '');
		langs[name] = JSON.parse(fs.readFileSync(getFilePath(file)));
	});

module.exports = langs;