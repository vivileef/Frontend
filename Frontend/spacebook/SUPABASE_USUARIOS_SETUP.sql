-- ============================================
-- CONFIGURACIÓN DE TABLA USUARIOS Y TRIGGER
-- SpaceBook - Sistema de Estacionamiento
-- ============================================

-- Paso 1: Habilitar la extensión UUID (si no está habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Paso 2: Verificar estructura de la tabla usuarios
-- La tabla debe tener esta estructura:
/*
CREATE TABLE IF NOT EXISTS usuarios (
    usuarioid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR NOT NULL,
    apellido VARCHAR NOT NULL,
    correo VARCHAR UNIQUE NOT NULL,
    contrasena VARCHAR,
    cedula BIGINT NOT NULL UNIQUE,
    telefono BIGINT NOT NULL,
    fechacreacion TIMESTAMPTZ DEFAULT NOW()
);
*/

-- Paso 3: Crear función trigger para sincronizar auth.users con usuarios
-- Esta función se ejecutará automáticamente cuando se cree un usuario en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    -- Insertar el nuevo usuario en la tabla usuarios
    INSERT INTO public.usuarios (
        usuarioid,
        nombre,
        apellido,
        correo,
        contrasena,
        cedula,
        telefono,
        fechacreacion
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
        COALESCE(NEW.raw_user_meta_data->>'apellido', ''),
        NEW.email,
        '', -- No guardamos contraseña en texto plano
        COALESCE((NEW.raw_user_meta_data->>'cedula')::BIGINT, 0),
        COALESCE((NEW.raw_user_meta_data->>'telefono')::BIGINT, 0),
        NOW()
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Paso 4: Crear el trigger que ejecuta la función
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Paso 5: Configurar políticas RLS (Row Level Security)
-- Habilitar RLS en la tabla usuarios
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios autenticados pueden leer su propio registro
CREATE POLICY "Los usuarios pueden ver su propio registro"
    ON usuarios
    FOR SELECT
    TO authenticated
    USING (auth.uid() = usuarioid);

-- Política: Los usuarios autenticados pueden actualizar su propio registro
CREATE POLICY "Los usuarios pueden actualizar su propio registro"
    ON usuarios
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = usuarioid)
    WITH CHECK (auth.uid() = usuarioid);

-- Política: Permitir inserción para usuarios autenticados (necesario para el registro)
CREATE POLICY "Los usuarios pueden insertar su propio registro"
    ON usuarios
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = usuarioid);

-- Política: Permitir al servicio insertar registros (para el trigger)
CREATE POLICY "Service role puede insertar usuarios"
    ON usuarios
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Paso 6: Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios(correo);
CREATE INDEX IF NOT EXISTS idx_usuarios_cedula ON usuarios(cedula);
CREATE INDEX IF NOT EXISTS idx_usuarios_usuarioid ON usuarios(usuarioid);

-- ============================================
-- INSTRUCCIONES DE INSTALACIÓN
-- ============================================
/*
1. Ve a tu proyecto en Supabase Dashboard (https://supabase.com/dashboard)
2. Navega a "SQL Editor" en el menú lateral
3. Crea una nueva query
4. Copia y pega este script completo
5. Haz clic en "Run" para ejecutar el script
6. Verifica que no haya errores en la consola
7. Las políticas RLS ahora están activas según tu configuración
*/

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Ejecuta esta query para verificar que todo está configurado:
/*
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table, 
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
*/
