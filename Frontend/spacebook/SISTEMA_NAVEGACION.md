# 🗺️ Sistema de Navegación con Rutas Hijas

## 📋 Resumen
Se ha implementado un sistema completo de navegación con **rutas hijas (child routes)** para los dashboards de administrador y usuario, permitiendo una navegación fluida entre diferentes vistas sin recargar toda la página.

## 🏗️ Estructura de Rutas

### Admin Dashboard
```
/admin-dashboard (AdminDashboardComponent con sidebar)
├── '' → AdminHome (vista por defecto)
├── /calendario → CalendarioDisponibilidad
└── /administrar-espacios → AdministrarEspacios
```

### User Dashboard
```
/user-dashboard (UserDashboardComponent con sidebar)
├── '' → UserHome (vista por defecto)
├── /catalogo-espacios → CatalogoEspacios
└── /sistema-reservas → SistemaReservas
```

## 🎨 Componentes Creados

### Componentes Home (Dashboard Principal)
1. **AdminHome** - Vista principal del administrador con:
   - Estadísticas generales (Total espacios, Disponibles, Ocupados, Reservas hoy)
   - Acciones rápidas
   - Actividad reciente

2. **UserHome** - Vista principal del usuario con:
   - Estadísticas personales (Mis reservas, Espacios disponibles, Próxima reserva)
   - Acciones principales (Buscar estacionamiento, Ver reservas)
   - Reservas recientes

### Componentes de Funcionalidad
1. **CalendarioDisponibilidad** - Calendario con disponibilidad de espacios (admin)
2. **AdministrarEspacios** - Gestión de espacios y secciones (admin)
3. **CatalogoEspacios** - Catálogo de espacios disponibles (usuario)
4. **SistemaReservas** - Sistema de reservas del usuario

## 🔧 Implementación Técnica

### 1. Estructura de Dashboards con Sidebar

Ambos dashboards (admin y user) tienen:
- **Sidebar izquierdo** con navegación
- **Área principal** con `<router-outlet>` para renderizar componentes hijos

```typescript
<div class="min-h-screen bg-gray-50 flex">
  <!-- Sidebar con navegación -->
  <aside class="w-64 bg-white shadow-lg">
    <!-- Menu items con routerLink -->
  </aside>
  
  <!-- Área de contenido dinámico -->
  <main class="flex-1 overflow-auto">
    <router-outlet></router-outlet>
  </main>
</div>
```

### 2. Configuración de Rutas Hijas

En `app.routes.ts`:

```typescript
{
  path: 'admin-dashboard',
  component: AdminDashboardComponent,  // Contenedor con sidebar
  children: [
    { path: '', component: AdminHome },  // Vista por defecto
    { path: 'calendario', component: CalendarioDisponibilidad },
    { path: 'administrar-espacios', component: AdministrarEspacios }
  ]
}
```

### 3. Navegación en Sidebar

Usando `RouterLink` y `RouterLinkActive`:

```html
<a 
  routerLink="/admin-dashboard" 
  routerLinkActive="bg-red-600"
  [routerLinkActiveOptions]="{exact: true}"
  class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-600"
>
  <svg>...</svg>
  <span>Dashboard</span>
</a>
```

**Atributos importantes:**
- `routerLink`: Define la ruta de navegación
- `routerLinkActive`: Clase CSS cuando la ruta está activa
- `[routerLinkActiveOptions]="{exact: true}"`: Solo activa con coincidencia exacta (para ruta raíz)

## 🎨 Diseño Visual

### Admin Dashboard
- **Color primario**: Rojo (#dc2626)
- **Sidebar**: Fondo rojo con texto blanco
- **Elementos activos**: Rojo más oscuro

### User Dashboard
- **Color primario**: Azul (#2563eb)
- **Sidebar**: Fondo blanco con texto gris
- **Elementos activos**: Azul claro

## 🚀 Flujo de Navegación

### Para Administradores:
1. Login exitoso → Redirige a `/admin-dashboard`
2. Se carga `AdminDashboardComponent` con sidebar
3. `<router-outlet>` renderiza `AdminHome` por defecto
4. Click en "Calendario" → Navega a `/admin-dashboard/calendario`
5. `<router-outlet>` renderiza `CalendarioDisponibilidad`
6. El sidebar permanece visible

### Para Usuarios:
1. Login exitoso → Redirige a `/user-dashboard`
2. Se carga `UserDashboardComponent` con sidebar
3. `<router-outlet>` renderiza `UserHome` por defecto
4. Click en "Catálogo Espacios" → Navega a `/user-dashboard/catalogo-espacios`
5. `<router-outlet>` renderiza `CatalogoEspacios`
6. El sidebar permanece visible

## 📦 Imports Necesarios

Para que funcione la navegación:

```typescript
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  // ...
})
```

## ✅ Características Implementadas

✅ Rutas hijas configuradas para ambos dashboards  
✅ Componentes Home con contenido placeholder  
✅ Navegación con sidebar persistente  
✅ Indicadores visuales de ruta activa  
✅ Contenido separado por rol (admin/usuario)  
✅ Design responsive con Tailwind CSS  
✅ Router outlet para renderizado dinámico  

## 🔄 Próximos Pasos

1. **Implementar funcionalidad real** en cada componente:
   - Calendario interactivo con reservas
   - CRUD de espacios de estacionamiento
   - Sistema de búsqueda y filtrado
   - Sistema de reservas

2. **Agregar guards** para proteger rutas:
   - Auth guard para rutas autenticadas
   - Admin guard para rutas de administrador

3. **Conectar con Supabase**:
   - Obtener datos reales de espacios
   - Gestionar reservas en base de datos
   - Sincronización en tiempo real

4. **Mejorar UX**:
   - Animaciones de transición entre vistas
   - Loading states
   - Manejo de errores
   - Notificaciones toast

## 📝 Notas Técnicas

- Los componentes están en modo standalone (Angular 20)
- Se usa Tailwind CSS para estilos
- Todos los componentes son lazy-loaded automáticamente
- El sidebar no se recarga al cambiar de vista hijo
- RouterOutlet reemplaza solo el contenido, no el layout

## 🎯 Convenciones de Nomenclatura

**Componentes:**
- Admin: `nombre-descripcion.ts` (sin "Component" en clase)
- Rutas admin: `/admin-dashboard/nombre-vista`
- Rutas user: `/user-dashboard/nombre-vista`

**Carpetas:**
- Admin components: `src/app/spacebook/admin/page/`
- User components: `src/app/spacebook/user/page/`
- Shared components: `src/app/shared/`

---

**Estado**: ✅ Sistema de navegación completamente funcional  
**Fecha**: Implementado 2024  
**Framework**: Angular 20 + Supabase + Tailwind CSS
