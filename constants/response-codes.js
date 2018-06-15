module.exports = {
	ERROR: {
		INTERNAL_SERVER_ERROR: {
			code: 1001,
			message: 'Hubo un error interno en el servidor, favor de comunicarse con el administrador.'
		},
		BAD_REQUEST: {
			code: 1002,
			message: 'El formato de la petición es inválido, los campos no tienen el formato correcto, o la petición no tiene campos que son requeridos.'
		},
		NO_TOKEN_PROVIDED: {
			code: 1003,
			message: 'Acceso denegado. No se proporcionó un token en las cabeceras de la petición.'
		},
		INVALID_TOKEN: {
			code: 1004,
			message: 'Acceso denegado. El token enviado en las cabeceras de la petición es inválido.'
		},
	},

	SUCCESS: {
		GENERIC: {
			code: 1000,
			message: 'Se realizó la operación exitosamente.'
		},
		LOGIN: {
			code: 1001,
			message: 'Inició de sesión correcto.'
		},
		USER_CREATED: {
			code: 1002,
			message: 'Usuario creado exitosamente.'
		},
		USER_UPDATED: {
			code: 1003,
			message: 'Usuario actualizado exitosamente.'
		},
		PRIVILEGE_CREATED: {
			code: 2001,
			message: 'Privilegio actualizado exitosamente.'
		},
		PRIVILEGE_UPDATED: {
			code: 2002,
			message: 'Privilegio actualizado exitosamente.'
		}
	}
};
