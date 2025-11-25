# SpaceBook — Frontend

Este repositorio contiene la aplicación frontend de SpaceBook (Angular). Aquí se explica la arquitectura del frontend, las tecnologías utilizadas y el modelo de dominio principal.

## Resumen rápido
- Framework: Angular (Standalone components)
- Estilos: Tailwind CSS + DaisyUI
- Cliente de BBDD/servicios: `@supabase/supabase-js`
- Estructura: `spacebook/src/app/spacebook/` contiene las páginas principales del sistema (admin y user)

## Cómo ejecutar (local)
```powershell
cd spacebook
npm install
npx ng serve --open
```

La app se sirve por defecto en `http://localhost:4200`.

## Arquitectura y Modelo de Dominio
El frontend consume servicios desde Supabase y otros endpoints para gestionar instituciones, secciones, espacios y reservas.

### Entidades principales (ER) — Mermaid
```mermaid
erDiagram
	INSTITUCION {
		string institucionid PK
		string nombre
		string direccion
	}
	SECCION {
		string seccionid PK
		string nombre
		string institucionid FK
	}
	ESPACIO {
		string espacioid PK
		string nombre
		string seccionid FK
		boolean estado
		int capacidad
	}
	ESPACIOHORA {
		string espaciohoraid PK
		string espacioid FK
		time horainicio
		time horafin
		boolean estado
		string reservaid FK NULL
	}
	RESERVA {
		string reservaid PK
		string usuarioid FK
		string nombrereserva
		timestamp fechareserva
	}
	USUARIO {
		string usuarioid PK
		string nombre
		string correo
	}
	COMENTARIO {
		string comentarioid PK
		string espacioid FK
		string usuarioid FK
		text contenido
		timestamp creado_en
	}
	INCIDENCIA {
		string incidenciaid PK
		string espacioid FK
		string usuarioid FK
		text descripcion
		timestamp creado_en
	}
	NOTIFICACION {
		string notificacionid PK
		string usuarioid FK
		text mensaje
		boolean leido
	}

	INSTITUCION ||--o{ SECCION : "tiene"
	SECCION ||--o{ ESPACIO : "contiene"
	ESPACIO ||--o{ ESPACIOHORA : "tiene"
	ESPACIOHORA }o--|| ESPACIO : "pertenece a"
	USUARIO ||--o{ RESERVA : "crea"
	RESERVA ||--o{ ESPACIOHORA : "incluye"
	ESPACIO ||--o{ COMENTARIO : "recibe"
	USUARIO ||--o{ COMENTARIO : "escribe"
	ESPACIO ||--o{ INCIDENCIA : "puede tener"
	USUARIO ||--o{ INCIDENCIA : "reporta"
	USUARIO ||--o{ NOTIFICACION : "recibe"

```

