module.exports = {
	INTERNAL_SERVER_ERROR: {
		code: 1001,
		message: 'Error interno del servidor.'
	},
	BAD_REQUEST: {
		code: 1002,
		message: 'Formato de petición invalido o faltan campos requeridos.'
	},
	NOT_FOUND: {
		code: 1003,
		message: 'Recurso no encontrado.'
	},
	CONFLICT: {
		code: 1004,
		message: 'Problema al procesar la petición.'
	},
	UNPROCESSABLE_ENTITY: {
		code: 1005,
		message: 'Solicitud bien formada pero con posibles errores semánticos.'
	},
	NO_TOKEN_PROVIDED: {
		code: 2001,
		message: 'Acceso denegado. No se proporcionó un token en las cabeceras de la petición.'
	},
	INVALID_TOKEN: {
		code: 2002,
		message: 'Acceso denegado. El token enviado en las cabeceras de la petición es inválido.'
	},
	EMAIL_ERROR: {
		code: 3001,
		message: 'Error al enviar el correo electrónico.'
	}
}
