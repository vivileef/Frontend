# Script de testing para Spacebook
# Este script ejecuta las pruebas unitarias del proyecto

param(
    [switch]$Watch,
    [switch]$Coverage,
    [switch]$Headless,
    [string]$Browsers = "Chrome"
)

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Spacebook - Testing Suite" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "❌ Error: node_modules no encontrado." -ForegroundColor Red
    Write-Host "Ejecuta primero: .\scripts\install.ps1" -ForegroundColor Yellow
    exit 1
}

# Construir el comando de test
$testCommand = "npm test"
$testArgs = @()

if ($Watch) {
    Write-Host "Modo: Watch (observación continua)" -ForegroundColor Yellow
    $testArgs += "--watch"
}

if ($Coverage) {
    Write-Host "Generando reporte de cobertura..." -ForegroundColor Yellow
    $testArgs += "--code-coverage"
}

if ($Headless) {
    Write-Host "Modo: Headless (sin interfaz gráfica)" -ForegroundColor Yellow
    $testArgs += "--browsers=ChromeHeadless"
} elseif ($Browsers -ne "Chrome") {
    Write-Host "Navegadores: $Browsers" -ForegroundColor Yellow
    $testArgs += "--browsers=$Browsers"
}

Write-Host ""
Write-Host "Ejecutando tests..." -ForegroundColor Green
Write-Host "Comando: $testCommand $($testArgs -join ' ')" -ForegroundColor Gray
Write-Host ""

# Ejecutar los tests
if ($testArgs.Count -gt 0) {
    & npm test -- $testArgs
} else {
    & npm test
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Tests completados exitosamente" -ForegroundColor Green

    if ($Coverage) {
        Write-Host ""
        Write-Host "Reporte de cobertura generado en: coverage/index.html" -ForegroundColor Cyan
    }
} else {
    Write-Host ""
    Write-Host "❌ Algunos tests fallaron" -ForegroundColor Red
    exit 1
}
