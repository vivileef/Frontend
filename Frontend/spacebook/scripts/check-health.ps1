# Script de verificación de salud del proyecto Spacebook
# Este script verifica que todo esté correctamente configurado

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Spacebook - Health Check" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$errors = 0
$warnings = 0

# Función para verificar comandos
function Test-Command {
    param([string]$Command)
    try {
        & $Command --version 2>&1 | Out-Null
        return $LASTEXITCODE -eq 0
    } catch {
        return $false
    }
}

# 1. Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "  ❌ Node.js no está instalado" -ForegroundColor Red
    $errors++
}

# 2. Verificar npm
Write-Host "Verificando npm..." -ForegroundColor Yellow
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host "  ✓ npm: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "  ❌ npm no está instalado" -ForegroundColor Red
    $errors++
}

# 3. Verificar Angular CLI
Write-Host "Verificando Angular CLI..." -ForegroundColor Yellow
if (Test-Command "ng") {
    $ngVersion = ng version 2>&1 | Select-String "Angular CLI" | ForEach-Object { $_.ToString().Trim() }
    Write-Host "  ✓ $ngVersion" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Angular CLI no está instalado globalmente" -ForegroundColor Yellow
    Write-Host "    (Se puede usar npm run ng)" -ForegroundColor Gray
    $warnings++
}

# 4. Verificar archivos importantes
Write-Host ""
Write-Host "Verificando archivos del proyecto..." -ForegroundColor Yellow

$requiredFiles = @(
    "package.json",
    "angular.json",
    "tsconfig.json",
    "src/main.ts",
    "src/index.html",
    "src/styles.css"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file no encontrado" -ForegroundColor Red
        $errors++
    }
}

# 5. Verificar node_modules
Write-Host ""
Write-Host "Verificando dependencias..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    $packageCount = (Get-ChildItem "node_modules" -Directory).Count
    Write-Host "  ✓ node_modules: $packageCount paquetes instalados" -ForegroundColor Green

    # Verificar dependencias críticas
    $criticalPackages = @(
        "@angular/core",
        "@angular/cli",
        "@angular/build",
        "@supabase/supabase-js"
    )

    foreach ($package in $criticalPackages) {
        $packagePath = "node_modules/$package"
        if (Test-Path $packagePath) {
            Write-Host "  ✓ $package" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $package no encontrado" -ForegroundColor Red
            $errors++
        }
    }
} else {
    Write-Host "  ❌ node_modules no encontrado" -ForegroundColor Red
    Write-Host "    Ejecuta: .\scripts\install.ps1" -ForegroundColor Yellow
    $errors++
}

# 6. Verificar configuración de Angular
Write-Host ""
Write-Host "Verificando angular.json..." -ForegroundColor Yellow
if (Test-Path "angular.json") {
    try {
        $angularJson = Get-Content "angular.json" -Raw | ConvertFrom-Json
        $builder = $angularJson.projects.spacebook.architect.build.builder
        Write-Host "  ✓ Builder: $builder" -ForegroundColor Green

        if ($builder -eq "@angular/build:application") {
            Write-Host "  ✓ Usando builder moderno de Angular 17+" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ⚠ Error al leer angular.json" -ForegroundColor Yellow
        $warnings++
    }
}

# 7. Verificar variables de entorno
Write-Host ""
Write-Host "Verificando configuración de entorno..." -ForegroundColor Yellow
if (Test-Path "src/environments/environment.ts") {
    Write-Host "  ✓ environment.ts encontrado" -ForegroundColor Green
} else {
    Write-Host "  ⚠ environment.ts no encontrado" -ForegroundColor Yellow
    $warnings++
}

if (Test-Path "src/environments/environment.development.ts") {
    Write-Host "  ✓ environment.development.ts encontrado" -ForegroundColor Green
} else {
    Write-Host "  ⚠ environment.development.ts no encontrado" -ForegroundColor Yellow
    $warnings++
}

# Resumen
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Resumen" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "✓ Todo está correcto" -ForegroundColor Green
    Write-Host ""
    Write-Host "El proyecto está listo para usarse." -ForegroundColor Green
    exit 0
} elseif ($errors -eq 0) {
    Write-Host "⚠ $warnings advertencia(s)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "El proyecto debería funcionar, pero hay algunas advertencias." -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "❌ $errors error(es), $warnings advertencia(s)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Corrige los errores antes de continuar." -ForegroundColor Red
    exit 1
}
