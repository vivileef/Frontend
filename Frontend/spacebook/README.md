# SpaceBook

Este repositorio contiene la aplicación frontend de SpaceBook (Angular). Para evitar duplicación de documentación entre repositorios, la documentación de arquitectura, modelo de dominio y la guía completa se mantiene en el README del repositorio principal (padre).

Si necesitas la documentación completa (arquitectura, ER, tablas y guía de despliegue), consulta el README del repositorio padre:

- https://github.com/vivileef/SPACEBOOK-Reservas-de-espacios-compartidos#arquitectura

## Rápido inicio local

1. Instalar dependencias:

```powershell
npm install
```

2. Servir la app en desarrollo:

```powershell
npx ng serve --open
```

3. Abrir `http://localhost:4200`

## Variables de entorno mínimas
- `VITE_SUPABASE_URL` — URL del proyecto Supabase
- `VITE_SUPABASE_ANON_KEY` — clave pública anónima

No almacenes claves privadas o `service_role` en el cliente.

## Estructura breve
- `src/app/spacebook/` — páginas principales (admin, user)
- `src/app/shared/` — servicios y modelos
- `src/assets/images/espacios/` — imágenes de ejemplo

## Tests y build
- Unit tests: `npx ng test`
- Build producción: `npx ng build --configuration production`

---

Para detalles de arquitectura, modelo de datos (Mermaid ER), configuración de Supabase y flujos de reserva, consulta el README del repositorio padre (enlace más arriba).
> Nota: Ajusta nombres de columnas, tipos y relaciones según el esquema real en la base de datos.

## README detallado — Frontend SpaceBook

Este documento describe con detalle cómo configurar, desarrollar, probar y desplegar el frontend de SpaceBook, así como la estructura del proyecto y la integración con Supabase.

Índice
- [Resumen](#resumen)
- [Requisitos](#requisitos)
- [Variables de entorno](#variables-de-entorno)
- [Configurar Supabase (rápido)](#configurar-supabase-rápido)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Servicios clave y flujo de datos](#servicios-clave-y-flujo-de-datos)
- [Comandos útiles (desarrollo/test/build)](#comandos-utiles-desarrollotestbuild)
- [Testing y calidad](#testing-y-calidad)
- [CI / CD (ejemplo)](#ci--cd-ejemplo)
- [Despliegue](#despliegue)
- [Contribuir](#contribuir)
- [Solución de problemas comunes](#solución-de-problemas-comunes)

---

## Resumen
Frontend de SpaceBook: aplicación SPA construida con Angular y TypeScript. Consume Supabase como backend (Postgres + Auth + Storage). Usa Tailwind CSS para estilos y DaisyUI para componentes utilitarios.

## Requisitos
- Node.js >= 18
- npm o pnpm
- Angular CLI (opcional, `npx ng ...` funciona sin instalación global)
- Cuenta y proyecto en Supabase (para desarrollo/integración local)

## Variables de entorno
Crear un archivo `.env` o usar variables de entorno del entorno de desarrollo. Ejemplo de variables que el frontend espera (no almacenar secretos en repos públicos):

```env
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
NG_APP_API_BASE_URL=https://api.example.com
```

Nota: la app usa `@supabase/supabase-js`. En Angular puedes pasar estas vars al construir servicios. Asegúrate de no exponer keys de servicio (`service_role`) desde el cliente.

## Configurar Supabase (rápido)
1. Crea un proyecto en https://app.supabase.com
2. En la sección SQL, crea tablas mínimas (ejemplo simplificado):

```sql
create table institucion (
	institucionid uuid primary key default uuid_generate_v4(),
	nombre text not null,
	direccion text
);

create table seccion (
	seccionid uuid primary key default uuid_generate_v4(),
	institucionid uuid references institucion(institucionid),
	nombre text
);

create table espacio (
	espacioid uuid primary key default uuid_generate_v4(),
	seccionid uuid references seccion(seccionid),
	nombre text,
	capacidad int,
	estado boolean default true
);

create table espaciohora (
	espaciohoraid uuid primary key default uuid_generate_v4(),
	espacioid uuid references espacio(espacioid),
	horainicio time,
	horafin time,
	estado boolean default true,
	reservaid uuid null
);

create table usuario (
	usuarioid uuid primary key,
	nombre text,
	correo text
);

create table reserva (
	reservaid uuid primary key default uuid_generate_v4(),
	usuarioid uuid references usuario(usuarioid),
	nombrereserva text,
	fechareserva timestamptz default now()
);
```

3. Configura RLS (Row Level Security) si usas Supabase Auth — seguir la guía oficial para tokens/roles.

## Estructura del proyecto (resumen relevante)
- `spacebook/` — subcarpeta con la app Angular
	- `src/app/spacebook/` — código específico del módulo SpaceBook
		- `admin/` — vistas y pages para administración
		- `user/` — vistas de usuario (catalogo-espacios, sistema-reservas, mis-reservas)
		- `shared/` — servicios reutilizables, guards, modelos y utilidades
	- `src/assets/` — imágenes y assets estáticos (e.g. `assets/images/espacios/`)
	- `environments/` — archivos de configuración por entorno

## Servicios clave y flujo de datos
- `SupabaseService`: encapsula la creación del cliente Supabase y configura el cliente compartido.
- `DatabaseService`: capa de abstracción para consultas (getInstituciones, getSecciones, getEspacios, etc.).
- `Auth` (service): wrapper de autenticación (profile(), isAdmin(), signOut()).
- Flujo típico: componentes llaman a `DatabaseService` -> éste usa `SupabaseService.getClient()` -> realiza querys a las tablas Postgres -> actualiza señales / observables en el frontend.

### Ejemplos de llamadas
- Obtener instituciones: `dbService.getInstituciones()`
- Obtener espacios por sección: `dbService.getEspacios(seccionid)`
- Crear reserva: se inserta en `reserva` y se actualizan filas en `espaciohora` con `reservaid` y `estado=false`.


## Comandos útiles (desarrollo / test / build)
- Instalar dependencias:

```bash
npm install
```

- Servir en dev (auto-reload):

```bash
npx ng serve --open
```

- Build producción:

```bash
npx ng build --configuration production
```

- Lint:

```bash
npm run lint
```

- Tests unitarios (Karma / Jest según configuración):

```bash
npx ng test
```

- E2E (cypress / playwright si configurado):

```bash
npx ng e2e
```
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

## Testing y calidad
- Añadir tests unitarios para servicios críticos: `DatabaseService`, `SupabaseService`, guards y componentes del flujo de reserva.
- E2E: rutas de reserva, login, creación de reserva y verificación de estado del espacio.

## CI / CD (sugerencia)
Ejemplo básico (GitHub Actions):

1. `ci.yml` que instale Node, haga `npm ci`, ejecute `npm run lint`, `npm test` y `ng build --configuration production`.
2. Deploy: configurar action que haga deploy del `dist/` a un provider (Netlify, Vercel, GitHub Pages, S3).

## Despliegue
- Build y servir como static site en cualquier servicio estático.
- Para integraciones con funciones o API, usar endpoints protegidos (no exponer service_role key de Supabase en frontend).

## Contribuir
- Fork & PR: clonación, rama feature, tests y PR.
- Estilo de commits: usar mensajes claros y small atomic PRs.

## Solución de problemas comunes
- `ng serve` no arranca: verificar Node version y `npm install` completado.
- Errores de Supabase: comprobar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` y las reglas RLS.
- Submódulo frontend en repo padre: si clonas el repo padre recuerda `git submodule update --init --recursive`.

---


