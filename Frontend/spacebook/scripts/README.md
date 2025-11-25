# Scripts de PowerShell para Spacebook

Esta carpeta contiene scripts de PowerShell para facilitar el desarrollo, testing y mantenimiento del proyecto Spacebook.

## 📋 Scripts Disponibles

### 🔧 install.ps1
Instala todas las dependencias necesarias del proyecto.

```powershell
# Instalación limpia
.\scripts\install.ps1
```

**Características:**
- Verifica Node.js y npm
- Opción para limpiar caché
- Elimina instalaciones anteriores
- Instala todas las dependencias
- Muestra resumen de comandos disponibles

---

### 🏃 dev.ps1
Inicia el servidor de desarrollo de Angular.

```powershell
# Servidor básico en puerto 4200
.\scripts\dev.ps1

# Servidor en puerto personalizado
.\scripts\dev.ps1 -Port 3000

# Abrir navegador automáticamente
.\scripts\dev.ps1 -Open

# Con HTTPS
.\scripts\dev.ps1 -Ssl

# Host personalizado
.\scripts\dev.ps1 -Host "0.0.0.0" -Port 4200
```

**Parámetros:**
- `-Port`: Puerto del servidor (default: 4200)
- `-Open`: Abre el navegador automáticamente
- `-Ssl`: Habilita HTTPS
- `-Host`: Host del servidor (default: localhost)

---

### 🏗️ build.ps1
Compila el proyecto para producción o desarrollo.

```powershell
# Build de producción (optimizado)
.\scripts\build.ps1

# Build de desarrollo
.\scripts\build.ps1 -Configuration development

# Build con recompilación automática
.\scripts\build.ps1 -Watch

# Generar estadísticas del bundle
.\scripts\build.ps1 -Stats
```

**Parámetros:**
- `-Configuration`: "production" o "development" (default: production)
- `-Watch`: Recompila automáticamente al detectar cambios
- `-Stats`: Genera archivo stats.json para análisis

**Salida:**
- Archivos compilados en: `dist/spacebook/`
- Estadísticas (si se usa -Stats): `dist/spacebook/stats.json`

---

### 🧪 test.ps1
Ejecuta las pruebas unitarias del proyecto.

```powershell
# Ejecutar todos los tests
.\scripts\test.ps1

# Modo watch (re-ejecuta al cambiar código)
.\scripts\test.ps1 -Watch

# Con reporte de cobertura
.\scripts\test.ps1 -Coverage

# Sin interfaz gráfica (headless)
.\scripts\test.ps1 -Headless

# Navegador personalizado
.\scripts\test.ps1 -Browsers "Firefox"

# Combinación: headless con cobertura
.\scripts\test.ps1 -Headless -Coverage
```

**Parámetros:**
- `-Watch`: Modo observación (re-ejecuta automáticamente)
- `-Coverage`: Genera reporte de cobertura de código
- `-Headless`: Ejecuta sin interfaz gráfica (útil para CI/CD)
- `-Browsers`: Especifica el navegador ("Chrome", "Firefox", etc.)

**Salida:**
- Reporte de cobertura en: `coverage/index.html`

---

### 🧹 clean.ps1
Limpia archivos generados y cachés.

```powershell
# Limpieza básica (dist, .angular, coverage)
.\scripts\clean.ps1

# Limpieza completa (incluye node_modules)
.\scripts\clean.ps1 -All

# Sin confirmación
.\scripts\clean.ps1 -Force

# Limpieza completa sin confirmación
.\scripts\clean.ps1 -All -Force
```

**Parámetros:**
- `-All`: Incluye node_modules y package-lock.json
- `-Force`: No pide confirmación

**Elementos limpiados:**
- Siempre: `dist/`, `.angular/`, `coverage/`
- Con -All: `node_modules/`, `package-lock.json`
- Caché de npm

---

### 🩺 check-health.ps1
Verifica que el proyecto esté correctamente configurado.

```powershell
.\scripts\check-health.ps1
```

**Verifica:**
- ✅ Node.js y npm instalados
- ✅ Angular CLI disponible
- ✅ Archivos del proyecto (package.json, angular.json, etc.)
- ✅ Dependencias instaladas
- ✅ Paquetes críticos (@angular/core, @angular/build, etc.)
- ✅ Configuración de Angular
- ✅ Archivos de entorno

**Salida:**
- Exit code 0: Todo correcto
- Exit code 1: Errores encontrados

---

### 🔍 lint.ps1
Verifica el código en busca de problemas de estilo y calidad.

```powershell
# Verificar código
.\scripts\lint.ps1

# Corregir automáticamente
.\scripts\lint.ps1 -Fix

# Formatear con Prettier
.\scripts\lint.ps1 -Format

# Verificar, corregir y formatear
.\scripts\lint.ps1 -Fix -Format
```

**Parámetros:**
- `-Fix`: Corrige automáticamente problemas de lint
- `-Format`: Formatea el código con Prettier

**Verifica:**
- Errores de TypeScript
- Problemas de lint (si está configurado)
- Formato de código

---

## 🚀 Flujo de Trabajo Recomendado

### Primera vez (Setup inicial)
```powershell
# 1. Verificar salud del sistema
.\scripts\check-health.ps1

# 2. Instalar dependencias
.\scripts\install.ps1

# 3. Verificar nuevamente
.\scripts\check-health.ps1

# 4. Iniciar desarrollo
.\scripts\dev.ps1 -Open
```

### Desarrollo diario
```powershell
# Iniciar servidor de desarrollo
.\scripts\dev.ps1 -Open

# En otra terminal: ejecutar tests en modo watch
.\scripts\test.ps1 -Watch
```

### Antes de hacer commit
```powershell
# 1. Verificar y formatear código
.\scripts\lint.ps1 -Fix -Format

# 2. Ejecutar tests
.\scripts\test.ps1

# 3. Build de prueba
.\scripts\build.ps1 -Configuration development
```

### Build de producción
```powershell
# 1. Limpiar proyecto
.\scripts\clean.ps1 -Force

# 2. Instalar dependencias limpias
.\scripts\install.ps1

# 3. Ejecutar tests con cobertura
.\scripts\test.ps1 -Coverage -Headless

# 4. Build de producción
.\scripts\build.ps1

# 5. Verificar tamaño del bundle
.\scripts\build.ps1 -Stats
```

### Solución de problemas
```powershell
# Limpieza completa y reinstalación
.\scripts\clean.ps1 -All -Force
.\scripts\install.ps1
.\scripts\check-health.ps1
```

---

## 📝 Notas Importantes

### Requisitos previos
- **Node.js**: v18 o superior
- **npm**: v9 o superior
- **PowerShell**: 5.1 o superior

### Permisos de ejecución
Si obtienes un error de permisos al ejecutar los scripts, ejecuta:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Variables de entorno
Asegúrate de configurar correctamente:
- `src/environments/environment.ts` (producción)
- `src/environments/environment.development.ts` (desarrollo)

### Integración con CI/CD
Los scripts están diseñados para integrarse fácilmente en pipelines de CI/CD:

```yaml
# Ejemplo para GitHub Actions
- name: Verificar salud
  run: .\scripts\check-health.ps1

- name: Instalar dependencias
  run: .\scripts\install.ps1

- name: Ejecutar tests
  run: .\scripts\test.ps1 -Headless -Coverage

- name: Build
  run: .\scripts\build.ps1
```

---

## 🐛 Solución de Problemas Comunes

### Error: "node_modules no encontrado"
```powershell
.\scripts\install.ps1
```

### Error: "Builder @angular/build:dev-server not found"
```powershell
.\scripts\clean.ps1 -All -Force
.\scripts\install.ps1
```

### El servidor no inicia
```powershell
# Verificar que el puerto no esté en uso
.\scripts\dev.ps1 -Port 3000
```

### Tests fallan
```powershell
# Limpiar caché y reinstalar
.\scripts\clean.ps1 -Force
.\scripts\install.ps1
.\scripts\test.ps1
```

---

## 📚 Recursos Adicionales

- [Documentación de Angular](https://angular.io/docs)
- [Angular CLI](https://angular.io/cli)
- [Supabase Docs](https://supabase.io/docs)
- [PowerShell Docs](https://docs.microsoft.com/powershell/)

---

## 🤝 Contribuir

Si encuentras algún problema o tienes sugerencias para mejorar los scripts, por favor:
1. Abre un issue
2. Propón cambios
3. Envía un pull request

---

**Última actualización:** 24 de noviembre de 2025
