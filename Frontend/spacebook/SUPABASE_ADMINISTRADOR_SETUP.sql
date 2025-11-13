-- ============================================
-- CONFIGURACIÓN DE TABLA ADMINISTRADOR
-- SpaceBook - Sistema de Roles
-- ============================================

-- Paso 1: Crear la tabla administrador (si no existe)
CREATE TABLE IF NOT EXISTS administrador (
    adminid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR NOT NULL,
    apellido VARCHAR NOT NULL,
    correo VARCHAR UNIQUE NOT NULL,
    contrasena VARCHAR,
    cedula BIGINT NOT NULL UNIQUE,
    telefono BIGINT NOT NULL
);

-- Paso 2: Insertar los administradores existentes
INSERT INTO administrador (adminid, nombre, apellido, correo, contrasena, cedula, telefono)
VALUES 
  (
    'b91676f6-63d6-4152-8d2c-4139f8a4b93c'::uuid, 
    'stalin', 
    'tumbaco', 
    'stalin2005tumbaco@gmail.com', 
    '', 
    1314259654, 
    939956198
  ),
  (
    'e8d90fa4-0935-40da-84e8-07ff06e762bd'::uuid, 
    'Jose', 
    'Pacvheco', 
    'giorno2005@outlook.es', 
    '', 
    1315842730, 
    969340969
  )
ON CONFLICT (adminid) DO NOTHING;

-- Paso 3: Configurar políticas RLS para la tabla administrador
ALTER TABLE administrador ENABLE ROW LEVEL SECURITY;

-- Política: Los administradores pueden ver su propio registro
CREATE POLICY "Los administradores pueden ver su propio registro"
    ON administrador
    FOR SELECT
    TO authenticated
    USING (auth.uid()::text = adminid::text);

-- Política: Los administradores pueden actualizar su propio registro
CREATE POLICY "Los administradores pueden actualizar su propio registro"
    ON administrador
    FOR UPDATE
    TO authenticated
    USING (auth.uid()::text = adminid::text)
    WITH CHECK (auth.uid()::text = adminid::text);

-- Política: Permitir al servicio leer todos los administradores (necesario para login)
CREATE POLICY "Service role puede leer administradores"
    ON administrador
    FOR SELECT
    TO service_role
    USING (true);

-- Política: Permitir lectura pública por correo (necesario para el login)
CREATE POLICY "Lectura pública de administrador por correo"
    ON administrador
    FOR SELECT
    TO authenticated
    USING (true);

-- Paso 4: Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_administrador_correo ON administrador(correo);
CREATE INDEX IF NOT EXISTS idx_administrador_cedula ON administrador(cedula);
CREATE INDEX IF NOT EXISTS idx_administrador_adminid ON administrador(adminid);

-- ============================================
-- INSTRUCCIONES IMPORTANTES
-- ============================================
/*
DESPUÉS DE EJECUTAR ESTE SCRIPT:

1. CREAR USUARIOS DE AUTENTICACIÓN:
   Los administradores necesitan existir en Supabase Auth.
   
   Ve a: Supabase Dashboard → Authentication → Users → Add User
   
   Para Stalin Tumbaco:
   - Email: stalin2005tumbaco@gmail.com
   - Password: [Crear una contraseña segura]
   - User ID: b91676f6-63d6-4152-8d2c-4139f8a4b93c
   
   Para Jose Pacheco:
   - Email: giorno2005@outlook.es
   - Password: [Crear una contraseña segura]
   - User ID: e8d90fa4-0935-40da-84e8-07ff06e762bd
   
   NOTA: Cuando crees el usuario en Authentication, usa exactamente
   los mismos UUIDs que están en la tabla administrador.

2. VERIFICAR DATOS:
   SELECT * FROM administrador;
   
   Deberías ver 2 registros con los datos de los administradores.

3. PROBAR LOGIN:
   Intenta iniciar sesión con uno de los correos de administrador.
   Deberías ser redirigido a /admin-dashboard.
*/

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Ejecuta estas queries para verificar que todo está configurado:

-- Ver todos los administradores
SELECT * FROM administrador;

-- Ver políticas de la tabla administrador
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'administrador';

-- Ver índices de la tabla administrador
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'administrador';

-- ============================================
-- OPCIONAL: AGREGAR MÁS ADMINISTRADORES
-- ============================================
/*
Si necesitas agregar más administradores:

INSERT INTO administrador (nombre, apellido, correo, contrasena, cedula, telefono)
VALUES 
  ('Nombre', 'Apellido', 'correo@example.com', '', 1234567890, 987654321);

Luego:
1. Ve a Authentication → Users → Add User
2. Crea un usuario con el mismo correo
3. Actualiza la lista de ADMIN_EMAILS en auth.service.ts:
   
   private readonly ADMIN_EMAILS = [
     'stalin2005tumbaco@gmail.com',
     'giorno2005@outlook.es',
     'correo@example.com'  // ✅ Agregar aquí
   ];
*/

-- ============================================
-- SOLUCIÓN DE PROBLEMAS
-- ============================================
/*
PROBLEMA: "El administrador no puede iniciar sesión"
SOLUCIÓN:
1. Verifica que el usuario existe en Authentication → Users
2. Verifica que el correo está en la lista ADMIN_EMAILS del código
3. Verifica que el usuario existe en la tabla administrador
4. Verifica que los UUIDs coinciden entre auth.users y administrador

PROBLEMA: "new row violates row-level security policy"
SOLUCIÓN:
1. Temporalmente deshabilita RLS: ALTER TABLE administrador DISABLE ROW LEVEL SECURITY;
2. Inserta los datos
3. Vuelve a habilitar RLS: ALTER TABLE administrador ENABLE ROW LEVEL SECURITY;

PROBLEMA: "No se puede leer la tabla administrador en el login"
SOLUCIÓN:
Asegúrate de que existe la política de lectura pública:
CREATE POLICY "Lectura pública de administrador por correo"
    ON administrador
    FOR SELECT
    TO authenticated
    USING (true);
*/
