# 🔐 Sistema de Roles y Autenticación

## 📋 Resumen

Se ha implementado un sistema de autenticación con **dos roles diferentes**:
- 👤 **Usuario Normal**: Acceso al dashboard de usuario
- 🔑 **Administrador**: Acceso al panel de administración

---

## 🎯 Funcionamiento

### 1. **Detección de Rol**

El sistema detecta automáticamente si un usuario es administrador basándose en su correo electrónico:

**Correos de Administradores:**
```javascript
'stalin2005tumbaco@gmail.com'
'giorno2005@outlook.es'
```

### 2. **Flujo de Autenticación**

```
Usuario ingresa correo y contraseña
        ↓
Sistema verifica credenciales en Supabase Auth
        ↓
¿Es correo de administrador?
        ↓
    ┌───┴───┐
    │       │
   SÍ      NO
    │       │
    ↓       ↓
Buscar en   Buscar en
tabla       tabla
"administrador" "usuarios"
    │       │
    ↓       ↓
Redirigir a Redirigir a
/admin-dashboard /user-dashboard
```

---

## 🗃️ Estructura de Tablas

### Tabla: `administrador`
```sql
administrador (
    adminid UUID PRIMARY KEY,
    nombre VARCHAR,
    apellido VARCHAR,
    correo VARCHAR UNIQUE,
    contrasena VARCHAR,
    cedula BIGINT,
    telefono BIGINT
)
```

### Tabla: `usuarios`
```sql
usuarios (
    usuarioid UUID PRIMARY KEY,
    nombre VARCHAR,
    apellido VARCHAR,
    correo VARCHAR UNIQUE,
    contrasena VARCHAR,
    cedula BIGINT,
    telefono BIGINT,
    fechacreacion TIMESTAMPTZ
)
```

---

## 🎨 Dashboards Creados

### 1. **Admin Dashboard** (`/admin-dashboard`)

**Características:**
- ✅ Panel de estadísticas con métricas del sistema
- ✅ Total de usuarios
- ✅ Espacios activos
- ✅ Reservas del día
- ✅ Ingresos mensuales
- ✅ Acciones rápidas (Agregar usuario, Ver reportes, Configuración)
- ✅ Actividad reciente del sistema
- ✅ Diseño en rojo para distinguir el rol de administrador

**Vista:**
- Header con identificación como "Administrador"
- Cards de estadísticas generales
- Botones de acciones administrativas
- Log de actividad reciente

### 2. **User Dashboard** (`/user-dashboard`)

**Características:**
- ✅ Panel personalizado para el usuario
- ✅ Resumen de reservas del usuario
- ✅ Espacios disponibles
- ✅ Próxima reserva
- ✅ Búsqueda de estacionamiento
- ✅ Gestión de reservas personales
- ✅ Historial de reservas
- ✅ Diseño en azul para usuarios normales

**Vista:**
- Header con identificación como "Usuario"
- Cards con información personal
- Acciones de usuario (Buscar, Ver reservas)
- Lista de reservas recientes

---

## 🔧 Archivos Modificados

### 1. **auth.service.ts**
```typescript
// Interfaces actualizadas
interface UserProfile {
  usuarioid: string;
  nombre: string;
  apellido: string;
  correo: string;
  cedula: number;
  telefono: number;
  fechacreacion?: string;
  isAdmin?: boolean; // ✅ Nuevo campo
}

interface AdminProfile {
  adminid: string;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  cedula: number;
  telefono: number;
}

// Nuevos métodos
- isAdminEmail(email: string): boolean
- isAdmin(): boolean
- getAdminProfile(email: string)
```

**Lógica de `signIn()` actualizada:**
1. Verifica credenciales en Supabase Auth
2. Detecta si el correo es de administrador
3. Si es admin → busca en tabla `administrador`
4. Si es usuario → busca en tabla `usuarios`
5. Guarda perfil con flag `isAdmin`

### 2. **Login.ts**
```typescript
// Redirección automática según rol
if (this.auth.isAdmin()) {
  await this.router.navigate(['/admin-dashboard']);
} else {
  await this.router.navigate(['/user-dashboard']);
}
```

### 3. **app.routes.ts**
```typescript
// Nuevas rutas
{
  path: 'admin-dashboard',
  component: AdminDashboardComponent
},
{
  path: 'user-dashboard',
  component: UserDashboardComponent
}
```

### 4. **Componentes Creados**
- ✅ `admin-dashboard.component.ts`
- ✅ `user-dashboard.component.ts`

---

## 🧪 Cómo Probar

### **Probar como Administrador:**

1. Ir a: `http://localhost:4200/login`
2. Ingresar:
   ```
   Correo: stalin2005tumbaco@gmail.com
   Contraseña: [La contraseña del administrador]
   ```
   O:
   ```
   Correo: giorno2005@outlook.es
   Contraseña: [La contraseña del administrador]
   ```
3. Click en "Iniciar Sesión"
4. **Resultado:** Redirige a `/admin-dashboard` (panel rojo de admin)

### **Probar como Usuario Normal:**

1. Primero registrar un nuevo usuario:
   - Ir a: `http://localhost:4200/register`
   - Completar el formulario con datos de prueba
   - Crear cuenta

2. Iniciar sesión:
   - Ir a: `http://localhost:4200/login`
   - Ingresar correo y contraseña del usuario registrado
   - Click en "Iniciar Sesión"

3. **Resultado:** Redirige a `/user-dashboard` (panel azul de usuario)

---

## 🔒 Seguridad

### **Protección de Rutas**

Cada dashboard verifica el rol al cargar:

```typescript
// En AdminDashboardComponent
ngOnInit() {
  if (!this.auth.isAdmin()) {
    // Si no es admin, redirigir a user dashboard
    this.router.navigate(['/user-dashboard']);
  }
}

// En UserDashboardComponent
ngOnInit() {
  if (this.auth.isAdmin()) {
    // Si es admin, redirigir a admin dashboard
    this.router.navigate(['/admin-dashboard']);
  }
}
```

### **Recomendaciones de Seguridad**

Para producción, considera implementar:

1. **Guards de Angular:**
   ```typescript
   // admin.guard.ts
   canActivate(): boolean {
     return this.auth.isAdmin();
   }
   ```

2. **Verificación en Backend:**
   - No confiar solo en el frontend
   - Validar permisos en cada petición al servidor
   - Usar Row Level Security (RLS) en Supabase

3. **Tokens y Sesiones:**
   - Los tokens de Supabase ya incluyen información del usuario
   - Validar tokens en cada operación sensible

---

## 📊 Datos de Administradores

Los datos actuales de los administradores (desde el JSON proporcionado):

### Administrador 1:
```json
{
  "adminid": "b91676f6-63d6-4152-8d2c-4139f8a4b93c",
  "nombre": "stalin",
  "apellido": "tumbaco",
  "correo": "stalin2005tumbaco@gmail.com",
  "cedula": 1314259654,
  "telefono": 939956198
}
```

### Administrador 2:
```json
{
  "adminid": "e8d90fa4-0935-40da-84e8-07ff06e762bd",
  "nombre": "Jose",
  "apellido": "Pacvheco",
  "correo": "giorno2005@outlook.es",
  "cedula": 1315842730,
  "telefono": 969340969
}
```

---

## 🛠️ Configuración en Supabase

### **Asegúrate de tener la tabla `administrador`:**

```sql
CREATE TABLE IF NOT EXISTS administrador (
    adminid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR NOT NULL,
    apellido VARCHAR NOT NULL,
    correo VARCHAR UNIQUE NOT NULL,
    contrasena VARCHAR,
    cedula BIGINT NOT NULL UNIQUE,
    telefono BIGINT NOT NULL
);
```

### **Inserta los administradores:**

```sql
INSERT INTO administrador (adminid, nombre, apellido, correo, contrasena, cedula, telefono)
VALUES 
  ('b91676f6-63d6-4152-8d2c-4139f8a4b93c', 'stalin', 'tumbaco', 'stalin2005tumbaco@gmail.com', '', 1314259654, 939956198),
  ('e8d90fa4-0935-40da-84e8-07ff06e762bd', 'Jose', 'Pacvheco', 'giorno2005@outlook.es', '', 1315842730, 969340969)
ON CONFLICT (adminid) DO NOTHING;
```

### **Crea usuarios de autenticación para los admins:**

Los administradores deben existir en `auth.users`:

1. Ve a Supabase Dashboard → Authentication → Users
2. Click en "Add user"
3. Para cada admin, crea un usuario con:
   - Email: correo del admin
   - Password: la contraseña que quieras asignar

O usa el SQL Editor:

```sql
-- No se puede insertar directamente en auth.users desde SQL
-- Debes usar el Dashboard o la API de Supabase
```

---

## 🎯 Agregar Más Administradores

Si necesitas agregar más administradores:

### **Opción 1: Modificar el código**

En `auth.service.ts`, agrega el correo a la lista:

```typescript
private readonly ADMIN_EMAILS = [
  'stalin2005tumbaco@gmail.com',
  'giorno2005@outlook.es',
  'nuevo.admin@example.com'  // ✅ Agregar aquí
];
```

### **Opción 2: Desde base de datos (más flexible)**

Crear una tabla de configuración:

```sql
CREATE TABLE admin_emails (
  email VARCHAR PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO admin_emails (email) VALUES 
  ('stalin2005tumbaco@gmail.com'),
  ('giorno2005@outlook.es');
```

Luego modificar `auth.service.ts` para consultar esta tabla.

---

## ✅ Checklist de Implementación

- [x] ✅ Servicio Auth actualizado con detección de roles
- [x] ✅ Dashboard de administrador creado
- [x] ✅ Dashboard de usuario creado
- [x] ✅ Login actualizado con redirección automática
- [x] ✅ Rutas configuradas
- [x] ✅ Protección básica de rutas implementada
- [ ] ⏳ **Crear usuarios de auth para los administradores en Supabase**
- [ ] ⏳ **Insertar datos de administradores en tabla `administrador`**
- [ ] ⏳ **Probar login como administrador**
- [ ] ⏳ **Probar login como usuario normal**

---

## 🆘 Solución de Problemas

### **Error: "Usuario sin registro en tabla usuarios"**
- **Causa:** El usuario no existe en la tabla `usuarios` o `administrador`
- **Solución:** 
  - Para admins: Verifica que existan en la tabla `administrador`
  - Para usuarios: Usa el formulario de registro

### **Error: Redirige al dashboard incorrecto**
- **Causa:** El correo no está en la lista de ADMIN_EMAILS
- **Solución:** 
  - Verifica que el correo esté exactamente en la lista
  - Los correos son case-sensitive (aunque se convierten a minúsculas)

### **Error: No se puede acceder al dashboard**
- **Causa:** Usuario no autenticado
- **Solución:** Asegúrate de iniciar sesión primero

---

## 📚 Próximos Pasos Sugeridos

1. **Implementar Guards de Angular** para protección de rutas
2. **Crear más funcionalidades específicas** para cada rol
3. **Agregar gestión de usuarios** en el panel de admin
4. **Implementar gestión de espacios** en el panel de admin
5. **Crear sistema de reservas** funcional
6. **Agregar reportes y estadísticas** reales

---

**¿Tienes preguntas o necesitas ajustes adicionales?** 
Házmelo saber y te ayudaré con cualquier configuración adicional.
