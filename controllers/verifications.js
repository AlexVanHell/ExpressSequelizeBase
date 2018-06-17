const debug = require('debug')('controllers:users');
const Promise = require('bluebird');

const resHandler = require('../lib/util/http-response-handler');
const util = require('../lib/util');
const constants = require('../constants');
const settings = require('../settings');
const auth = require('../lib/auth');

const db = require('../models');

exports.verifyEmail = async function (req, res, next) {
    const token = req.query.token;
    let error = {
        title: 'El token ha expirado.',
        body: 'El token de verificación ha expirado.'
    };

    try {
        const find = await db.Token.findOne({
            where: { value: token, type: 1, visible: true, active: true },
            attributes: ['id', 'value', 'email', 'verified', 'personId'],
        });

        if (!find) {
            error = {
                title: 'Error al verificar el email.',
                body: 'El token de verificación no es válido, puede que haya expirado.'
            };

            throw new Error('NOT_FOUND');
        }

        const person = await db.Person.findOne({ id: find.personId, visible: true }, {
            attributes: ['id', 'username', 'email', 'verified', 'firstName']
        });

        if (!person) {
            error = {
                title: 'Usuario no encontrado.',
                body: 'No se encontro ningun usuario con el token proporcionado.'
            }

            throw new Error('NOT_FOUND');
        }

        if (person.verified) {
            error = {
                title: 'Usuario verificado.',
                body: 'El usuario ya ha sido verificado.'
            };

            throw new Error('VERIFIED');
        }

        const updateToken = await db.Token.update({ verified: true, active: false }, {
            where: { id: find.id }
        });

        const updateUser = await db.Person.update({ verified: true }, {
            where: { id: person.id }
        });

        res.render('verification', {
            title: settings.APP.NAME,
            firstName: find.firstName,
            url: 'http://' + req.headers.host + '/login'
        });
    } catch (err) {
        res.render('verification', { error: error });
    }
}

exports.resendVerificationToken = async function (req, res, next) {
    const body = req.body;
    let responseBody = {}
    let error = null;

    try {
        const find = await db.Person.findOne({
            where: { email: req.body.email, visible: true },
            attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'verified']
        });

        if (!find) {
            error = {
                name: 'EMAIL_NOT_EXISTS',
                message: constants.STRINGS.EMAIL_NOT_EXISTS
            }
            return resHandler.handleError(req, res, error, 'NOT_FOUND', 'NOT_FOUND', error.message);
        }

        if (find.verified) {
            error = {
                name: 'EMAIL_ALREADY_VERIFIED',
                message: constants.STRINGS.EMAIL_ALREADY_VERIFIED
            }
            return resHandler.handleError(req, res, error, 'BAD_REQUEST', 'BAD_REQUEST', error.message);
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
            subject: 'Verificación de correo electronico',
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
        return resHandler.handleError(req, res, error, 'INTERNAL_SERVER_ERROR', 'INTERNAL_SERVER_ERROR');
    }
}

