# Script de instalación de dependencias para Spacebook
# Este script instala todas las dependencias necesarias del proyecto

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Spacebook - Instalador" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si Node.js está instalado
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Node.js no está instalado." -ForegroundColor Red
    Write-Host "Por favor, instala Node.js desde https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Node.js detectado: $nodeVersion" -ForegroundColor Green

# Verificar si npm está instalado
Write-Host "Verificando npm..." -ForegroundColor Yellow
$npmVersion = npm --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: npm no está instalado." -ForegroundColor Red
    exit 1
}
Write-Host "✓ npm detectado: v$npmVersion" -ForegroundColor Green
Write-Host ""

# Limpiar caché de npm (opcional)
$cleanCache = Read-Host "¿Deseas limpiar la caché de npm? (s/n)"
if ($cleanCache -eq "s" -or $cleanCache -eq "S") {
    Write-Host "Limpiando caché de npm..." -ForegroundColor Yellow
    npm cache clean --force
    Write-Host "✓ Caché limpiada" -ForegroundColor Green
}

# Eliminar node_modules y package-lock.json si existen
Write-Host ""
Write-Host "Limpiando instalación anterior..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "✓ Carpeta node_modules eliminada" -ForegroundColor Green
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
    Write-Host "✓ package-lock.json eliminado" -ForegroundColor Green
}

# Instalar dependencias
Write-Host ""
Write-Host "Instalando dependencias..." -ForegroundColor Yellow
Write-Host "Esto puede tomar varios minutos..." -ForegroundColor Gray
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "   ✓ Instalación Completada" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Comandos disponibles:" -ForegroundColor Cyan
    Write-Host "  npm start          - Iniciar servidor de desarrollo" -ForegroundColor White
    Write-Host "  npm run build      - Compilar para producción" -ForegroundColor White
    Write-Host "  npm test           - Ejecutar pruebas unitarias" -ForegroundColor White
    Write-Host "  npm run watch      - Compilar en modo observación" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Red
    Write-Host "   ❌ Error en la Instalación" -ForegroundColor Red
    Write-Host "=====================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Revisa los errores anteriores para más información." -ForegroundColor Red
    exit 1
}
