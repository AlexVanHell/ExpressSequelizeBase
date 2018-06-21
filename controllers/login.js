const debug = require('debug')('controllers:users');
const crypto = require('crypto');
const Promise = require('bluebird');

const resHandler = require('../lib/util/http-response-handler');
const util = require('../lib/util');
const constants = require('../constants');
const settings = require('../settings');

const db = require('../models');
const Op = require('sequelize').Op;

exports.login = async function (req, res, next) {
	const body = req.body;
	let responseBody = {};

	try {
		const find = await db.Person.findOne({
			where: {
				visible: true,
				[Op.or]: [{ email: body.user }, { username: body.user }]
			},
			attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'phone', 'active', 'verified', 'createdAt', 'updatedAt', 'password'],
			include: [{
				model: db.Privilege,
				as: 'privilege',
				attributes: ['id', 'name'],
				include: [{
					model: db.Access,
					attributes: ['id', 'name'],
					where: { active: true, visible: true },
					as: 'accesses',
					through: {
						as: 'access',
						attributes: ['permission'],
						where: { active: true, visible: true }
					}
				}]
			}, {
				model: db.Access,
				attributes: ['id', 'name'],
				where: { active: true, visible: true },
				as: 'accesses',
				required: false,
				through: {
					as: 'access',
					attributes: ['permission'],
					where: { active: true, visible: true }
				}
			}]
		});

		if (!find || !await find.validPassword(body.password)) {
			throw {
				name: 'NotFound',
				message: constants.STRINGS.LOGIN_FAILED
			}
		}

		if (!find.verified) {
			throw {
				name: 'NotVerified',
				message: constants.STRINGS.USER_NOT_VERIFIED
			}
		}

		if (!find.active) {
			throw {
				name: 'Deactivated',
				message: constants.STRINGS.USER_DEACTIVATED
			}
		}

		// This line removes the password from response
		responseBody = JSON.parse(JSON.stringify(find));

		// If user has privilege set accesses from privilege
		if (responseBody.privilege) {
			responseBody.accesses = Object.assign([], responseBody.privilege.accesses); // Avoid point to the same memory direction to delete below

			delete responseBody.privilege.accesses;
		}

		resHandler.handleSuccess(req, res, responseBody, 'OK', constants.STRINGS.LOGIN_SUCCESS);
	} catch (err) {
		debug('LOGIN', err);
		const errorLabels = ['NotFound', 'Deactivated', 'NotVerified'];
		let httpError = 'INTERNAL_SERVER_ERROR';
		let errorMessage = '';

		if (err.name && errorLabels.indexOf(err.name) > -1) {
			if (err.name === 'NotFound') {
				httpError = 'NOT_FOUND';
			} else {
				httpError = 'CONFLICT';
			}

			errorMessage = err.message;
		}

		resHandler.handleError(req, res, err, httpError, httpError, errorMessage);
	}
}