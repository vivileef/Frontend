# Script de linting para Spacebook
# Este script verifica el código en busca de problemas de estilo y calidad

param(
    [switch]$Fix,
    [switch]$Format
)

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Spacebook - Lint & Format" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "❌ Error: node_modules no encontrado." -ForegroundColor Red
    Write-Host "Ejecuta primero: .\scripts\install.ps1" -ForegroundColor Yellow
    exit 1
}

$hasErrors = $false

# Verificar TypeScript
Write-Host "Verificando TypeScript..." -ForegroundColor Yellow
& npx tsc --noEmit

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ No hay errores de TypeScript" -ForegroundColor Green
} else {
    Write-Host "  ❌ Se encontraron errores de TypeScript" -ForegroundColor Red
    $hasErrors = $true
}

Write-Host ""

# Verificar con Angular CLI (si tiene ng lint configurado)
Write-Host "Verificando con Angular Lint..." -ForegroundColor Yellow
$angularJson = Get-Content "angular.json" -Raw | ConvertFrom-Json
if ($angularJson.projects.spacebook.architect.PSObject.Properties.Name -contains "lint") {
    $lintArgs = @()
    if ($Fix) {
        $lintArgs += "--fix"
    }

    & npm run ng -- lint $lintArgs

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ No hay problemas de lint" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Se encontraron problemas de lint" -ForegroundColor Red
        $hasErrors = $true
    }
} else {
    Write-Host "  ⚠ Angular Lint no está configurado" -ForegroundColor Yellow
    Write-Host "    Puedes agregarlo con: ng add @angular-eslint/schematics" -ForegroundColor Gray
}

Write-Host ""

# Formatear con Prettier (si está configurado)
if ($Format) {
    Write-Host "Formateando código con Prettier..." -ForegroundColor Yellow

    # Verificar si prettier está instalado
    if (Test-Path "node_modules/.bin/prettier.cmd") {
        & npx prettier --write "src/**/*.{ts,html,css,json}"

        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Código formateado correctamente" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Error al formatear código" -ForegroundColor Red
            $hasErrors = $true
        }
    } else {
        Write-Host "  ⚠ Prettier no está instalado" -ForegroundColor Yellow
        Write-Host "    Puedes instalarlo con: npm install --save-dev prettier" -ForegroundColor Gray
    }

    Write-Host ""
}

# Resumen
Write-Host "=====================================" -ForegroundColor Cyan
if ($hasErrors) {
    Write-Host "   ❌ Se encontraron problemas" -ForegroundColor Red
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Corrige los problemas antes de hacer commit." -ForegroundColor Red

    if (-not $Fix) {
        Write-Host ""
        Write-Host "Tip: Ejecuta con -Fix para corregir automáticamente algunos problemas:" -ForegroundColor Yellow
        Write-Host "  .\scripts\lint.ps1 -Fix" -ForegroundColor White
    }

    exit 1
} else {
    Write-Host "   ✓ Todo está correcto" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "El código está listo para commit." -ForegroundColor Green
    exit 0
}
