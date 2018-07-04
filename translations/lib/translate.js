const debug = require('debug')('translations:translate');
const fs = require('fs');
const path = require('path');
const settings = require('../../settings');
const defaultLang = settings.APP.DEFAULT_LANG;
const interpolate = require('./interpolate');
const langs = require('./langs');

/**
 * Translation method.
 * @param {string} label Attribute from translation json. It could have an alternative label if the first does not exists adding "|" an then the alternative label
 * @param {string} lang Languaje. Ex: 'en', 'es'
 * @param {Object.<any>} obj Object with arguments for dinamic replacing
 * @returns {string}
 */
module.exports = function (label, lang, obj) {
	if (typeof lang !== 'string' || !lang) lang = defaultLang;

	try {
		if (!langs[lang]) lang = defaultLang;

		if (label.indexOf('|') > -1) {
			const alterLabels = label.split('|').map(x => x.trim());
			label = alterLabels[0];

			if (!langs[lang][label]) {
				label = alterLabels[1];
			}
		}

		return interpolate(langs[lang][label], obj);
	} catch (err) {
		throw new Error(err);
	}
};