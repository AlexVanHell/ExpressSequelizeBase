const debug = require('debug')('controllers:users');
const Promise = require('bluebird');

const resHandler = require('../lib/util/http-response-handler');
const util = require('../lib/util');
const constants = require('../constants');
const settings = require('../settings');
const auth = require('../lib/auth');

const db = require('../models');

exports.verifyEmail = function (req, res, next) {
    let error = {
        title: 'El token ha expirado.',
        body: 'El token de verificación ha expirado.'
    };
    const token = req.query.token;

    try {
        const find = await db.Token.findOne({
            where: { value: token, type: 1, visible: true, active: true },
            attributes: ['id', 'value', 'email', 'verified', 'personId'],
        });

        if (!find) {
            error = {
                title: 'Error al verificar el email.',
                body: 'Es posible que el token de verificación sea incorrecto o haya expirado.'
            };

            throw new Error('NOT_FOUND');
        }

        const person = await db.Person.findOne({ id: find.personId, visible: true }, {
            attributes: ['id', 'username', 'email', 'verified', 'password', 'firstName']
        });

        if (!person) {
            error = {
                title: 'Token no correspondiente.',
                body: 'El token no corresponde a la dirección de correo electrónico.'
            }

            throw new Error('NOT_FOUND');
        }

        if (person.verified) {
            error = {
                title: 'Usuario verificado.',
                body: 'Es usuario ya ha sido verificado.'
            };

            throw new Error('VERIFIED');
        }

        const decoded = await auth.check(token, person.get({ plain: true }).password);

        if (decoded) {
            const updateToken = await db.Token.update({ verified: true, active: false }, {
                where: { id: find.id }
            });

            const updateUser = await db.Person.update({ verified: true }, {
                where: { id: person.id }
            });

            res.render('confirmation', {
                title: settings.APP.NAME,
                firstName: find.firstName,
                url: 'http://' + req.headers.host + '/login'
            });
        }
    } catch (err) {
        res.render('confirmation', { error: error });
    }

}