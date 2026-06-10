<#
.SYNOPSIS
    Ejecuta pruebas de seguridad OWASP ZAP para Vallejobs
.DESCRIPTION
    Este script automatiza la ejecucion de OWASP ZAP para escanear
    la aplicacion Vallejobs en busca de vulnerabilidades de seguridad.
.PARAMETER Mode
    Modo de ejecucion: daemon (fondo), python (script API), automation (YAML), docker
.PARAMETER NoReport
    No abrir el reporte al finalizar
.EXAMPLE
    .\run-zap-scan.ps1 -Mode python
    .\run-zap-scan.ps1 -Mode docker
#>

param(
    [ValidateSet("daemon", "python", "automation", "docker", "help")]
    [string]$Mode = "python",
    [switch]$NoReport
)

$ErrorActionPreference = "Stop"
$ZAP_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$REPORTS_DIR = Join-Path $ZAP_DIR "reports"

# Colores para output
$GREEN = "Green"
$YELLOW = "Yellow"
$RED = "Red"
$CYAN = "Cyan"

function Write-Color($Color, $Message) {
    Write-Host $Message -ForegroundColor $Color
}

function Print-Banner {
    Write-Color $CYAN @"
===============================================================
      OWASP ZAP - Security Test para Vallejobs
===============================================================
  Backend:  http://localhost:5000
  Frontend: http://localhost:3000
  Directorio: $ZAP_DIR
===============================================================
"@
}

function Test-Port {
    param($Port)
    try {
        $client = New-Object System.Net.Sockets.TcpClient
        $client.ConnectAsync("127.0.0.1", $Port).Wait(1000) | Out-Null
        if ($client.Connected) {
            $client.Close()
            return $true
        }
        $client.Close()
        return $false
    } catch {
        return $false
    }
}

function Wait-ForZAP {
    Write-Color $YELLOW "  Esperando a que ZAP este listo..."
    $timeout = 120
    $elapsed = 0
    while ($elapsed -lt $timeout) {
        if (Test-Port -port 8080) {
            try {
                $response = Invoke-RestMethod -Uri "http://127.0.0.1:8080" -Method Get -TimeoutSec 5
                Write-Color $GREEN "  ZAP esta listo!"
                return $true
            } catch {
                # Aun no responde
            }
        }
        Write-Host "." -NoNewline
        Start-Sleep -Seconds 2
        $elapsed += 2
    }
    Write-Color $RED "  ERROR: ZAP no respondio en $timeout segundos"
    return $false
}

function Start-ZAPDaemon {
    Write-Color $CYAN "[*] Iniciando OWASP ZAP en modo daemon..."

    $zapExe = Get-Command "zap.bat" -ErrorAction SilentlyContinue
    if (-not $zapExe) {
        $zapExe = Get-Command "zap.sh" -ErrorAction SilentlyContinue
    }
    if (-not $zapExe) {
        $possiblePaths = @(
            "$env:ProgramFiles\OWASP\Zed Attack Proxy\zap.bat",
            "${env:ProgramFiles(x86)}\OWASP\Zed Attack Proxy\zap.bat",
            "$env:LOCALAPPDATA\Programs\OWASP ZAP\ZAP\zap.bat"
        )
        foreach ($p in $possiblePaths) {
            if (Test-Path $p) {
                $zapExe = $p
                break
            }
        }
    }

    if (-not $zapExe) {
        Write-Color $RED "  ERROR: No se encuentra OWASP ZAP instalado."
        Write-Host "  Descargalo de: https://www.zaproxy.org/download/"
        Write-Host "  O usa el modo docker: .\run-zap-scan.ps1 -Mode docker"
        exit 1
    }

    Write-Host "  Ejecutable: $zapExe"
    $zapArgs = @("-daemon", "-port", "8080", "-host", "127.0.0.1",
                 "-config", "api.disablekey=true",
                 "-config", "api.addrs.addr.name=.*",
                 "-config", "api.addrs.addr.regex=true")

    try {
        $process = Start-Process -FilePath $zapExe -ArgumentList $zapArgs -WindowStyle Hidden -PassThru
        Write-Host "  ZAP iniciado (PID: $($process.Id))"
        return $process
    } catch {
        Write-Color $RED "  ERROR al iniciar ZAP: $_"
        exit 1
    }
}

function Invoke-PythonScan {
    Write-Color $CYAN "[*] Ejecutando scan con Python y ZAP API..."
    Write-Host ""

    $pyScript = Join-Path $ZAP_DIR "zap-security-test.py"
    if (-not (Test-Path $pyScript)) {
        Write-Color $RED "  ERROR: No se encuentra $pyScript"
        exit 1
    }

    # Verificar que zaproxy esta instalado
    try {
        python -c "import zapv2" 2>$null
    } catch {
        Write-Color $YELLOW "  Instalando dependencia zaproxy..."
        pip install zaproxy
    }

    python $pyScript
    exit $LASTEXITCODE
}

function Invoke-DockerScan {
    Write-Color $CYAN "[*] Ejecutando scan con Docker..."
    Write-Host ""

    if (-not (Get-Command "docker" -ErrorAction SilentlyContinue)) {
        Write-Color $RED "  ERROR: Docker no esta instalado."
        exit 1
    }

    # Crear directorio de reportes
    New-Item -ItemType Directory -Force -Path $REPORTS_DIR | Out-Null

    # Iniciar ZAP en Docker
    Write-Color $YELLOW "  Iniciando contenedor ZAP..."
    docker compose -f (Join-Path $ZAP_DIR "docker-compose.yml") up -d zap

    if ($LASTEXITCODE -ne 0) {
        Write-Color $RED "  ERROR al iniciar contenedor ZAP"
        exit 1
    }

    # Esperar a que ZAP este listo
    if (-not (Wait-ForZAP)) {
        docker compose -f $ZAP_DIR\docker-compose.yml down
        exit 1
    }

    # Ejecutar el script Python (que se conecta al ZAP en Docker)
    Invoke-PythonScan

    # Limpiar
    docker compose -f (Join-Path $ZAP_DIR "docker-compose.yml") down
}

function Show-Help {
    Write-Host @"

USO:
  .\run-zap-scan.ps1 -Mode <modo>

MODOS:
  daemon      Inicia ZAP en modo daemon (fondo)
  python      (DEFECTO) Ejecuta el script Python con ZAP API
  automation  Usa el archivo YAML de Automation Framework
  docker      Usa Docker para ejecutar ZAP
  help        Muestra esta ayuda

EJEMPLOS:
  .\run-zap-scan.ps1
  .\run-zap-scan.ps1 -Mode daemon
  .\run-zap-scan.ps1 -Mode docker -NoReport

REQUISITOS:
  - OWASP ZAP instalado (excepto modo docker)
  - Python 3.7+ (para modo python)
  - Docker Desktop (para modo docker)

"@
    exit 0
}

# ============================================================
# MAIN
# ============================================================

Clear-Host
Print-Banner

switch ($Mode) {
    "help" { Show-Help }
    "daemon" {
        $proc = Start-ZAPDaemon
        if (Wait-ForZAP) {
            Write-Color $GREEN "  ZAP corriendo en http://127.0.0.1:8080"
            Write-Color $YELLOW "  Presiona Ctrl+C para detener"
            # Mantener el proceso vivo
            Wait-Process -Id $proc.Id -ErrorAction SilentlyContinue
        }
    }
    "python" {
        if (-not (Test-Port -Port 8080)) {
            Write-Color $YELLOW "  ZAP no esta corriendo. Iniciando..."
            $proc = Start-ZAPDaemon
            if (-not (Wait-ForZAP)) { exit 1 }
        } else {
            Write-Color $GREEN "  ZAP ya esta corriendo en puerto 8080"
        }
        Invoke-PythonScan
    }
    "automation" {
        Write-Color $YELLOW "  Modo automation requiere ZAP con Java. Usa docker en su lugar."
        Write-Host "  docker compose -f .\OWASP ZAP\docker-compose.yml run --rm zap-scan"
        exit 1
    }
    "docker" {
        Invoke-DockerScan
    }
}
