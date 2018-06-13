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
		USER_CREATION_ERROR: {
			code: 1002,
			message: 'Hubo un error al crear al usuario ocasionado por el servidor, favor de comunicarse con el administrador'
		}
	},

	SUCCESS: {
		GENERIC: {
			code: 1000,
			message: 'Se realízo la operación exitosamente'
		},
		LOGIN: {
			code: 1001,
			message: 'Inició de sesión correcto'
		},
		USER_CREATED: {
			code: 1002,
			message: 'Usuario creado exitosamente'
		}
	}
};
