# Frontend-Modelado - Spacebook

## 📋 Descripción General
**Spacebook** es una aplicación web desarrollada en **Angular 20** para la gestión y reserva de espacios institucionales. La plataforma permite a los usuarios consultar, reservar y gestionar espacios disponibles, mientras que los administradores pueden supervisar reservas, gestionar incidencias y mantener el sistema actualizado.

## 🎯 Características Principales

### Para Usuarios
- 🔐 **Autenticación y Registro**: Sistema de login/registro con roles diferenciados
- 📚 **Catálogo de Espacios**: Visualización de espacios disponibles con imágenes y detalles
- 📅 **Sistema de Reservas**: Reserva de espacios según disponibilidad horaria
- 🔔 **Notificaciones**: Sistema de notificaciones en tiempo real
- 📝 **Mis Reservas**: Gestión y seguimiento de reservas personales
- 💬 **Comentarios**: Sistema de retroalimentación sobre reservas realizadas
- ⚠️ **Reporte de Incidencias**: Notificación de problemas en espacios reservados

### Para Administradores
- 🏢 **Administrar Espacios**: CRUD completo de espacios institucionales
- 📊 **Gestionar Reservas**: Supervisión y administración de todas las reservas
- 🛠️ **Gestionar Incidencias**: Atención y resolución de problemas reportados
- 📅 **Calendario de Disponibilidad**: Vista general de disponibilidad de espacios
- 👁️ **Visualización de Disponibilidad**: Monitoreo detallado de horarios
- 📈 **Registro de Actividades**: Seguimiento de acciones realizadas en el sistema

## 🛠️ Tecnologías Utilizadas

- **Framework**: Angular 20
- **Backend/Base de Datos**: Supabase (PostgreSQL)
- **Estilos**: Tailwind CSS + DaisyUI
- **Autenticación**: Supabase Auth
- **Lenguaje**: TypeScript 5.8
- **PWA**: Angular Service Worker

## 📁 Estructura del Proyecto

```
Frontend/spacebook/
├── src/app/
│   ├── shared/              # Componentes y servicios compartidos
│   │   ├── guards/          # Guards de autenticación y autorización
│   │   ├── models/          # Interfaces y modelos de datos
│   │   ├── services/        # Servicios (auth, database, supabase, etc.)
│   │   └── page/            # Páginas compartidas (login, register, dashboards)
│   └── spacebook/           # Módulo principal de la aplicación
│       ├── admin/           # Módulo de administración
│       └── user/            # Módulo de usuario
├── environments/            # Configuración de entornos
└── assets/                  # Recursos estáticos (imágenes, etc.)
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn
- Cuenta de Supabase

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/vivileef/Frontend.git
   cd Frontend/Frontend/spacebook
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Crear archivo `environment.ts` y `environment.development.ts` en `src/environments/`
   - Agregar credenciales de Supabase:
   ```typescript
   export const environment = {
     apiUrl: 'TU_SUPABASE_URL',
     apiKey: 'TU_SUPABASE_ANON_KEY'
   };
   ```

4. **Ejecutar la aplicación**
   ```bash
   npm start
   ```
   La aplicación estará disponible en `http://localhost:4200`

## 👥 Roles y Permisos

- **Usuario**: Acceso a catálogo, reservas, notificaciones, comentarios e incidencias
- **Administrador**: Acceso completo al sistema, gestión de espacios, reservas e incidencias

## 🔒 Seguridad

- Autenticación mediante Supabase Auth
- Guards de ruta para proteger áreas administrativas
- Persistencia de sesión segura
- Refresh token automático

## 📦 Scripts Disponibles

- `npm start` - Ejecutar en modo desarrollo
- `npm run build` - Compilar para producción
- `npm test` - Ejecutar pruebas unitarias
- `npm run watch` - Compilar en modo watch

## 🌐 Base de Datos

El proyecto utiliza **Supabase** como backend, con las siguientes entidades principales:
- Usuarios
- Administradores
- Instituciones
- Secciones
- Espacios
- Horarios
- Reservas
- Comentarios
- Incidencias
- Notificaciones

## 📄 Licencia

Este proyecto es parte de un trabajo universitario - 5to Semestre, Proyecto de Modelado.

## 👨‍💻 Desarrollo

Proyecto desarrollado como parte del curso de Modelado de Software.
