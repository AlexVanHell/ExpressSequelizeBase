module.exports = {
	INTERNAL_SERVER_ERROR: {
		code: 1001,
		message: 'Hubo un error interno en el servidor, favor de comunicarse con el administrador.'
	},
	BAD_REQUEST: {
		code: 1002,
		message: 'El formato de la petición es inválido, los campos no tienen el formato correcto, o la petición no tiene campos que son requeridos.'
	},
	NOT_FOUND: {
		code: 1003,
		message: 'El recurso solicitado solicitado no existe o ha sido borrado.'
	},
	CONFLICT: {
		code: 1004,
		message: 'Hubo un problema al procesar la petición.'
	},
	NO_TOKEN_PROVIDED: {
		code: 1005,
		message: 'Acceso denegado. No se proporcionó un token en las cabeceras de la petición.'
	},
	INVALID_TOKEN: {
		code: 1006,
		message: 'Acceso denegado. El token enviado en las cabeceras de la petición es inválido.'
	}
}
