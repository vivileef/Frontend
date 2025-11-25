# Script para iniciar el servidor de desarrollo de Spacebook
# Este script inicia Angular en modo desarrollo con opciones configurables

param(
    [int]$Port = 4200,
    [switch]$Open,
    [switch]$Ssl,
    [string]$Host = "localhost"
)

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Spacebook - Servidor Dev" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "❌ Error: node_modules no encontrado." -ForegroundColor Red
    Write-Host "Ejecuta primero: .\scripts\install.ps1" -ForegroundColor Yellow
    Write-Host ""
    $install = Read-Host "¿Deseas instalar ahora? (s/n)"
    if ($install -eq "s" -or $install -eq "S") {
        & .\scripts\install.ps1
        if ($LASTEXITCODE -ne 0) {
            exit 1
        }
    } else {
        exit 1
    }
}

# Construir argumentos
$ngArgs = @(
    "serve",
    "--port=$Port",
    "--host=$Host"
)

if ($Open) {
    $ngArgs += "--open"
    Write-Host "El navegador se abrirá automáticamente" -ForegroundColor Yellow
}

if ($Ssl) {
    $ngArgs += "--ssl"
    Write-Host "HTTPS habilitado" -ForegroundColor Yellow
    $protocol = "https"
} else {
    $protocol = "http"
}

Write-Host "Iniciando servidor de desarrollo..." -ForegroundColor Green
Write-Host "URL: $protocol`://$Host`:$Port" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Gray
Write-Host ""

# Iniciar el servidor
& npm run ng -- $ngArgs

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Error al iniciar el servidor" -ForegroundColor Red
    exit 1
}
