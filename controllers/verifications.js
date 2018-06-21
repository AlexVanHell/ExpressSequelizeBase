const debug = require('debug')('controllers:verifications');
const crypto = require('crypto');
const Promise = require('bluebird');

const resHandler = require('../lib/util/http-response-handler');
const util = require('../lib/util');
const constants = require('../constants');
const settings = require('../settings');
const auth = require('../lib/auth');

const db = require('../models');

const tokenExpirationLimit = 6 * 60 * 60 * 1000; // 6hrs

exports.verifyEmail = async function (req, res, next) {
    const token = req.query.token;
    const loginUrl = 'http://' + req.headers.host + '/login';
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
                message: constants.STRINGS.INVALID_VERIFICATION_TOKEN
            };
        }

        if (tokenExpirationLimit <= new Date() - find.createdAt ) {
            throw {
                name: 'SourceExpired',
                message: constants.STRINGS.TOKEN_EXPIRED
            };
        }

        if (!find.person) {
            throw {
                name: 'NotFound',
                message: constants.STRINGS.USER_NOT_FOUND_BY_TOKEN
            };
        }

        const updateToken = await db.Token.update({ verified: true, active: false }, {
            where: { id: find.id }
        });

        if (find.person.verified) {
            throw {
                name: 'Verified',
                message: constants.STRINGS.EMAIL_ALREADY_VERIFIED
            };
        }

        const updateUser = await db.Person.update({ verified: true }, {
            where: { id: find.person.id }
        });

        responseBody = {
            firstName: find.firstName,
            lastName: find.lastName
        }

        resHandler.handleSuccess(req, res, responseBody, 'OK', constants.STRINGS.EMAIL_VERIFIED);
    } catch (err) {
        debug('VERIFY EMAIL', err);

        let httpError = 'INTERNAL_SERVER_ERROR';
        let errorMessage = '';
        const errorLabels = ['NotFound', 'Verified', 'SourceExpired'];

        if (err.name && errorLabels.indexOf(err.name) > -1) {
            httpError = err.name !== 'NotFound' ? 'CONFLICT' : 'NOT_FOUND';
            errorMessage = err.message;
        }

        resHandler.handleError(req, res, err, httpError, httpError, errorMessage);
    }
}

exports.sendEmailVerificationToken = async function (req, res, next) {
    const body = req.body;
    let responseBody = {}

    try {
        const find = await db.Person.findOne({
            where: { email: req.body.email, visible: true },
            attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'verified']
        });

        if (!find) {
            throw {
                name: 'NotFound',
                message: constants.STRINGS.EMAIL_NOT_EXISTS
            }
        }

        if (find.verified) {
            throw {
                name: 'EmailAlreadyVerified',
                message: constants.STRINGS.EMAIL_ALREADY_VERIFIED
            }
        }

        const tokenKey = crypto.randomBytes(16).toString('hex');

        const createToken = await db.Token.create({
            value: tokenKey,
            email: find.email,
            personId: find.id,
            type: 1 // 1: Email verification
        });

        const url = `http://${req.headers.host}/verification?token=${tokenKey}`;

        const email = await util.emailHandler.sendMail({
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

        resHandler.handleSuccess(req, res, responseBody, 'OK', constants.STRINGS.EMAIL_VERIFICATION_SENT + find.email);
    } catch (err) {
        debug('GET BY ID', err);

        let httpError = 'INTERNAL_SERVER_ERROR';
        let errorMessage = '';
        const errorLabels = ['NotFound', 'EmailAlreadyVerified'];

        if (err.name && errorLabels.indexOf(err.name) > -1) {
            httpError = err.name === 'EmailAlreadyVerified' ? 'CONFLICT' : 'NOT_FOUND';
            errorMessage = err.message;
        }

        resHandler.handleError(req, res, err, httpError, httpError, errorMessage);
    }
}

