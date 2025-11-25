# Script de compilación para Spacebook
# Este script compila el proyecto para producción o desarrollo

param(
    [ValidateSet("production", "development")]
    [string]$Configuration = "production",
    [switch]$Watch,
    [switch]$Stats
)

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Spacebook - Build Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "❌ Error: node_modules no encontrado." -ForegroundColor Red
    Write-Host "Ejecuta primero: .\scripts\install.ps1" -ForegroundColor Yellow
    exit 1
}

# Mostrar configuración
Write-Host "Configuración: $Configuration" -ForegroundColor Yellow

# Construir argumentos
$buildArgs = @("--configuration=$Configuration")

if ($Watch) {
    Write-Host "Modo: Watch (recompilación automática)" -ForegroundColor Yellow
    $buildArgs += "--watch"
}

if ($Stats) {
    Write-Host "Generando estadísticas de build..." -ForegroundColor Yellow
    $buildArgs += "--stats-json"
}

Write-Host ""
Write-Host "Iniciando compilación..." -ForegroundColor Green
Write-Host "Esto puede tomar varios minutos..." -ForegroundColor Gray
Write-Host ""

# Ejecutar build
$startTime = Get-Date
& npm run build -- $buildArgs
$endTime = Get-Date

if ($LASTEXITCODE -eq 0) {
    $duration = ($endTime - $startTime).TotalSeconds
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "   ✓ Build Completado" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Tiempo: $([math]::Round($duration, 2)) segundos" -ForegroundColor Cyan
    Write-Host "Salida: dist/spacebook/" -ForegroundColor Cyan

    if ($Stats) {
        Write-Host "Estadísticas: dist/spacebook/stats.json" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Puedes analizar el bundle en: https://webpack.github.io/analyse/" -ForegroundColor Yellow
    }

    # Mostrar tamaño de los archivos generados
    if (Test-Path "dist/spacebook") {
        $totalSize = (Get-ChildItem -Path "dist/spacebook" -Recurse | Measure-Object -Property Length -Sum).Sum
        $totalSizeMB = [math]::Round($totalSize / 1MB, 2)
        Write-Host "Tamaño total: $totalSizeMB MB" -ForegroundColor Cyan
    }
} else {
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Red
    Write-Host "   ❌ Error en Build" -ForegroundColor Red
    Write-Host "=====================================" -ForegroundColor Red
    exit 1
}
