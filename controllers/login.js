const debug = require('debug')('controllers:users');
const crypto = require('crypto');
const Promise = require('bluebird');
const settings = require('../settings');

const responseHandler = require('../lib/util/http-response-handler');
const auth = require('../lib/auth');
const util = require('../lib/util');
const db = require('../models');
const Op = require('sequelize').Op;

const tokenExpirationLimit = 6 * 60 * 60 * 1000; // 6hrs

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
				message: 'LOGIN_FAILED'
			}
		}

		if (!find.verified) {
			throw {
				name: 'NotVerified',
				message: 'USER_NOT_VERIFIED'
			}
		}

		if (!find.active) {
			throw {
				name: 'ResourceDeactivated',
				message: 'USER_DEACTIVATED'
			}
		}

		// This line removes the password from response
		const user = JSON.parse(JSON.stringify(find));

		// If user has privilege set accesses from privilege
		if (user.privilege) {
			user.accesses = Object.assign([], user.privilege.accesses); // Avoid point to the same memory direction to delete below

			delete user.privilege.accesses;
		}

		responseBody = {
			user: JSON.parse(JSON.stringify(find)),
			token: await auth.create(user)
		};

		responseHandler.handleSuccess(req, res, responseBody, 'OK', 'LOGIN_SUCCESS');
	} catch (err) {
		debug('LOGIN', err);
		const errorLabels = ['ResourceDeactivated', 'NotVerified'];
		let httpError = '';
		let errorMessage = '';

		if (err.name && errorLabels.indexOf(err.name) > -1) {
			httpError = 'CONFLICT';
			errorMessage = err.message;
		}

		responseHandler.handleError(req, res, err, httpError, httpError, errorMessage);
	}
};

exports.recovery = async function (req, res, next) {
	const body = req.body;
	const recoveryUrl = settings.HOST.FRONTEND + 'recovery?token=';
	let responseBody = {};

	try {
		const find = await db.Person.findOne({
			where: { email: body.email, visible: true },
			attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'verified']
		});

		const tokenKey = crypto.randomBytes(16).toString('hex');

		const createToken = await db.Token.create({
			value: tokenKey,
			email: body.email,
			personId: find ? find.id : null,
			type: 2 // 2: Password recovery
		});

		if (!find) {
			throw {
				name: 'NotFound',
				message: 'EMAIL_NOT_EXISTS'
			}
		}

		if (!find.verified) {
			throw {
				name: 'NotVerified',
				message: 'USER_NOT_VERIFIED'
			}
		}

		const url = recoveryUrl + tokenKey;

		const mailSent = await util.sendMail({
			to: body.email,
			subject: 'Recuperación de contraseña',
			body: `
				<h1>¡Hola ${settings.APP.NAME} ${find.firstName}!</h1>
				<p>
					Haz click sobre el siguiente enlace para cambiar tu contraseña:
					<br>
					<b>
						<a href="${url}">
							${url}
						</a>
					</b>
				</p>
			`
		});

		responseBody = {
			username: find.username,
			firstName: find.firstName,
			lastName: find.lastName
		};

		responseHandler.handleSuccess(req, res, responseBody, 'OK', 'EMAIL_SENT', { email: find.email });
	} catch (err) {
		debug('RECOVERY', err);
		let httpError = '';
		let errorMessage = '';

		if (err.name === 'NotVerified') {
			httpError = 'CONFLICT';
			errorMessage = err.message;
		}

		responseHandler.handleError(req, res, err, httpError, httpError, errorMessage);
	}
};

exports.verifyRecovery = async function (req, res, next) {
	const token = req.query.token;
	const loginUrl = settings.HOST.FRONTEND + 'login';
	let responseBody = {};

	try {
		const find = await db.Token.findOne({
			where: { value: token, type: 2, visible: true, active: true },
			attributes: ['id', 'value', 'email', 'verified', 'active', 'createdAt'],
			include: [{
				model: db.Person,
				as: 'person',
				attributes: ['id', 'username', 'email', 'verified', 'firstName', 'lastName'],
				where: { visible: true },
				required: false
			}]
		});

		if (!find) {
			throw {
				name: 'NotFound',
				message: 'INVALID_VERIFICATION_TOKEN'
			};
		}

		const updateToken = await db.Token.update({ verified: true }, {
			where: { id: find.id }
		});

		if (tokenExpirationLimit <= new Date() - find.createdAt) {
			throw {
				name: 'ResourceExpired',
				message: 'TOKEN_EXPIRED'
			};
		}

		if (!find.person) {
			throw {
				name: 'NotFound',
				message: 'USER_NOT_FOUND_BY_TOKEN'
			};
		}

		if (!find.person.verified) {
			throw {
				name: 'NotVerified',
				message: 'USER_NOT_VERIFIED'
			}
		}

		const updateUser = await db.Person.update({ verified: true }, {
			where: { id: find.person.id }
		});

		responseBody = {
			firstName: find.firstName,
			lastName: find.lastName
		};

		responseHandler.handleSuccess(req, res, responseBody, 'OK', 'EMAIL_VERIFIED');
	} catch (err) {
		debug('VERIFY EMAIL', err);
		const errorNames = ['NotVerified', 'ResourceExpired'];
		let httpError = '';
		let errorMessage = '';

		if (err.name && errorNames.indexOf(err.name) > -1) {
			httpError = 'CONFLICT';
			errorMessage = err.message;
		}

		responseHandler.handleError(req, res, err, httpError, httpError, errorMessage);
	}
};

exports.restore = async function (req, res, next) {
	const body = req.body;
	let responseBody = {};

	try {
		const find = await db.Token.findOne({
			where: { value: body.token, type: 2, visible: true, active: true },
			attributes: ['id', 'value', 'email', 'verified', 'active', 'createdAt'],
			include: [{
				model: db.Person,
				as: 'person',
				attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'password'],
				where: { visible: true },
			}]
		});

		if (!find) {
			throw {
				name: 'NotFound',
				message: 'INVALID_VERIFICATION_TOKEN'
			};
		}

		if (await find.person.validPassword(body.password.new)) {
			throw {
				name: 'InvalidValue',
				message: 'SAME_PASSWORD'
			}
		}

		const hashedPassword = await db.Person.generateHash(body.password);

		const updatePerson = await dp.Person.update({ password: hashedPassword }, {
			where: { id: find.person.id }
		})

		const updateToken = await db.Token.update({ verified: true, active: false }, {
			where: { id: find.id }
		});

		responseBody = {
			updatedAt: new Date()
		};

		responseHandler.handleSuccess(req, res, responseBody, 'OK', 'PASSWORD_UPDATED');
	} catch (err) {
		debug('RESTORE', err);
		const errorLabels = ['NotVerified', 'InvalidValue'];
		let httpError = '';
		let errorMessage = '';

		if (err.name && errorLabels.indexOf(err.name) > -1) {
			httpError = 'CONFLICT';
			errorMessage = err.message;
		}

		responseHandler.handleError(req, res, err, httpError, httpError, errorMessage);
	}
};

exports.update = async function (req, res, next) {
	const body = req.body;
	let responseBody = {};

	try {
		const find = await db.Person.findOne({
			where: {
				visible: true,
				[Op.or]: [{ email: body.user }, { username: body.user }]
			},
			attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'active', 'verified', 'createdAt', 'updatedAt', 'password']
		});

		if (!find) {
			throw {
				name: 'NotFound',
				message: 'USER_NOT_EXISTS'
			}
		}

		if (!find.verified) {
			throw {
				name: 'NotVerified',
				message: 'USER_NOT_VERIFIED'
			}
		}

		if (!await find.validPassword(body.password.old)) {
			throw {
				name: 'InvalidValue',
				message: 'INCORRECT_PASSWORD'
			}
		}

		if (await find.validPassword(body.password.new)) {
			throw {
				name: 'InvalidValue',
				message: 'SAME_PASSWORD'
			}
		}

		responseBody = {
			updatedAt: new Date()
		};

		responseHandler.handleSuccess(req, res, responseBody, 'OK', 'PASSWORD_UPDATED');
	} catch (err) {
		debug('RESTORE', err);
		const errorLabels = ['NotVerified', 'InvalidValue'];
		let httpError = '';
		let errorMessage = '';

		if (err.name && errorLabels.indexOf(err.name) > -1) {
			httpError = 'CONFLICT';
			errorMessage = err.message;
		}

		responseHandler.handleError(req, res, err, httpError, httpError, errorMessage);
	}
};