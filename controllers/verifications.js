const debug = require('debug')('controllers:verifications');
const crypto = require('crypto');
const Promise = require('bluebird');
const settings = require('../settings');

const responseHandler = require('../lib/common/http-response-handler');
const util = require('../lib/util');
const db = require('../models');

const tokenExpirationLimit = 6 * 60 * 60 * 1000; // 6hrs

exports.verifyEmail = async function (req, res, next) {
    const token = req.query.token;
    const loginUrl = settings.HOST.FRONTEND + 'login';
    let responseBody = {};

    try {
        const find = await db.Token.findOne({
            where: { value: token, type: 1, visible: true, active: true },
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

        const updateToken = await db.Token.update({ verified: true, active: false }, {
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

        if (find.person.verified) {
            throw {
                name: 'Verified',
                message: 'EMAIL_ALREADY_VERIFIED'
            };
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
        const errorLabels = ['Verified', 'ResourceExpired'];
        let httpError = 'INTERNAL_SERVER_ERROR';
        let errorMessage = '';

        if (err.name && errorLabels.indexOf(err.name) > -1) {
            httpError = 'CONFLICT';
            errorMessage = err.message;
        }

        responseHandler.handleError(req, res, err, httpError, httpError, errorMessage);
    }
};

exports.sendEmailVerificationToken = async function (req, res, next) {
    const body = req.body;
    const verificationUrl = settings.HOST.FRONTEND + 'verification?token=';
    let responseBody = {};

    try {
        const find = await db.Person.findOne({
            where: { email: body.email, visible: true },
            attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'verified']
        });

        if (!find) {
            throw {
                name: 'NotFound',
                message: 'EMAIL_NOT_EXISTS'
            }
        }

        if (find.verified) {
            throw {
                name: 'EmailAlreadyVerified',
                message: 'EMAIL_ALREADY_VERIFIED'
            }
        }

        const tokenKey = crypto.randomBytes(16).toString('hex');

        const createToken = await db.Token.create({
            value: tokenKey,
            email: find.email,
            personId: find.id,
            type: 1 // 1: Email verification
        });

        const url = verificationUrl + tokenKey;

        const mailSent = await util.sendMail({
            to: find.email,
            subject: 'Reenvío de verificación de correo electrónico.',
            body: `
                <h1>Hola ${find.firstName} ${find.lastName}!</h1>
                <p>
                    Haz click sobre el siguiente enlace para verificar tu correo electrónico:
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
            token: tokenKey
        };

        responseHandler.handleSuccess(req, res, responseBody, 'OK', 'EMAIL_VERIFICATION_SENT', { email: find.email });
    } catch (err) {
        debug('GET BY ID', err);
        let httpError = 'INTERNAL_SERVER_ERROR';
        let errorMessage = '';

        if (err.name === 'EmailAlreadyVerified') {
            httpError = 'CONFLICT';
            errorMessage = err.message;
        }

        responseHandler.handleError(req, res, err, httpError, httpError, errorMessage);
    }
};

