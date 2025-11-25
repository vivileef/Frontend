# Script de limpieza para Spacebook
# Este script limpia archivos generados y cachés

param(
    [switch]$All,
    [switch]$Force
)

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Spacebook - Clean Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$itemsToClean = @()

# Siempre limpiar estos
$itemsToClean += @{
    Path = "dist"
    Description = "Archivos compilados"
}

$itemsToClean += @{
    Path = ".angular"
    Description = "Caché de Angular"
}

$itemsToClean += @{
    Path = "coverage"
    Description = "Reportes de cobertura"
}

# Si se especifica -All, también limpiar dependencias
if ($All) {
    $itemsToClean += @{
        Path = "node_modules"
        Description = "Dependencias instaladas"
    }
    $itemsToClean += @{
        Path = "package-lock.json"
        Description = "Lockfile de npm"
    }
}

# Mostrar qué se va a limpiar
Write-Host "Se limpiarán los siguientes elementos:" -ForegroundColor Yellow
Write-Host ""
foreach ($item in $itemsToClean) {
    if (Test-Path $item.Path) {
        if (Test-Path -PathType Container $item.Path) {
            $size = (Get-ChildItem -Path $item.Path -Recurse -ErrorAction SilentlyContinue |
                     Measure-Object -Property Length -Sum -ErrorAction SilentlyContinue).Sum
            $sizeMB = [math]::Round($size / 1MB, 2)
            Write-Host "  - $($item.Path) ($($item.Description)) - $sizeMB MB" -ForegroundColor White
        } else {
            Write-Host "  - $($item.Path) ($($item.Description))" -ForegroundColor White
        }
    }
}

Write-Host ""

# Confirmar si no se usa -Force
if (-not $Force) {
    $confirm = Read-Host "¿Deseas continuar? (s/n)"
    if ($confirm -ne "s" -and $confirm -ne "S") {
        Write-Host "Operación cancelada" -ForegroundColor Yellow
        exit 0
    }
}

# Limpiar cada elemento
Write-Host ""
Write-Host "Limpiando..." -ForegroundColor Green
$cleaned = 0

foreach ($item in $itemsToClean) {
    if (Test-Path $item.Path) {
        Write-Host "Eliminando $($item.Path)..." -ForegroundColor Yellow
        try {
            Remove-Item -Path $item.Path -Recurse -Force -ErrorAction Stop
            Write-Host "  ✓ $($item.Path) eliminado" -ForegroundColor Green
            $cleaned++
        } catch {
            Write-Host "  ❌ Error al eliminar $($item.Path): $_" -ForegroundColor Red
        }
    } else {
        Write-Host "  - $($item.Path) no existe (omitido)" -ForegroundColor Gray
    }
}

# Limpiar caché de npm
Write-Host ""
Write-Host "Limpiando caché de npm..." -ForegroundColor Yellow
npm cache clean --force 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Caché de npm limpiado" -ForegroundColor Green
}

# Resumen
Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "   ✓ Limpieza Completada" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "$cleaned elemento(s) eliminado(s)" -ForegroundColor Cyan

if ($All) {
    Write-Host ""
    Write-Host "Para reinstalar las dependencias, ejecuta:" -ForegroundColor Yellow
    Write-Host "  .\scripts\install.ps1" -ForegroundColor White
}
