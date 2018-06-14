module.exports = {
	ERROR: {
		GENERIC: {
			code: 1000,
			message: 'Hubo un error al procesar la solicitud'
		},
		INTERNAL_SERVER_ERROR: {
			code: 1001,
			message: 'Hubo un error interno en el servidor, favor de comunicarse con el administrador'
		},
		NO_TOKEN_PROVIDED: {
			code: 1002,
			message: 'Acceso denegado. No se proporcionó un token en la perición.'
		},
		INVALID_TOKEN: {
			code: 1003,
			message: 'Acceso denegado. El token enviado en la petición es inválido.'
		},
		USER_CREATION_ERROR: {
			code: 2001,
			message: 'Hubo un error al crear al usuario ocasionado por el servidor, favor de comunicarse con el administrador'
		}
	},

	SUCCESS: {
		GENERIC: {
			code: 1000,
			message: 'Se realizó la operación exitosamente'
		},
		LOGIN: {
			code: 1001,
			message: 'Inició de sesión correcto'
		},
		USER_CREATED: {
			code: 1002,
			message: 'Usuario creado exitosamente'
		}, 
		USER_UPDATED: {
			code: 1003,
			message: 'Usuario actualizado exitosamente'
		}
	}
};
