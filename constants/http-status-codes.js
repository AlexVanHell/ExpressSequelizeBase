module.exports = {
	ERROR: {
		BAD_REQUEST: {
			code: 400,
			message: 'La petición contiene sintaxis errónea y no debe repetirse hasta ser modificada.'
		},
		UNAUTHORIZED: {
			code: 401,
			message: 'No tienes permiso de realizar la acción solicitada'
		},
		FORBBIDEN: {
			code: 403,
			message: 'La acción esta prohibída.'
		},
		NOT_FOUND: {
			code: 404,
			message: 'El recurso solicitado no existe.'
		},
		CONFLICT: {
			code: 409,
			message: 'La petición no puede ser procesada debido a un conflicto con el recurso.'
		}, 
		UNPROCESSABLE_ENTITY: {
			code: 422,
			message: 'La solicitud está bien formada pero fue imposible seguirla debido a errores semánticos.'
		},
		INTERNAL_SERVER_ERROR: {
			code: 500,
			message: 'Error interno del servidor.'
		},
	},

	SUCCESS: {
		OK: {
			code: 200,
			message: 'Operación exitosa.'
		},
		CREATED: {
			code: 201,
			message: 'Nuevo recurso creado.'
		},
		ACCEPTED: {
			code: 202,
			message: 'La petición ha sido aceptada para ser procesada despúes.'
		},
		NO_CONTENT: {
			code: 204,
			message: 'La petición se ha completado con éxito pero la respuesta no contiene nada.'
		}
	}
};