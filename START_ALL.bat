@echo off
setlocal
REM ============================================================================
REM Inicia backend + frontend y abre Google Chrome
REM ============================================================================

set "PROJECT_DIR=%~dp0"
set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

echo.
echo Iniciando COLGO Academia...
echo.

if not exist "%PROJECT_DIR%\package.json" (
  echo ERROR: No se encontro package.json en:
  echo %PROJECT_DIR%
  echo.
  pause
  exit /b 1
)

REM Crear dos terminales: frontend y backend
REM Doble comilla interna para rutas con espacios y cmd /k estable
start "COLGO Frontend (Vite)" cmd /k "cd /d ""%PROJECT_DIR%"" && npm run dev"
start "COLGO Backend (Express)" cmd /k "cd /d ""%PROJECT_DIR%"" && npm run server"

REM Esperar un momento para que frontend/backend terminen de arrancar
timeout /t 8 /nobreak >nul

REM Abrir Google Chrome en la ruta base de admin
start "" "chrome" "http://localhost:5173/admin"

echo.
echo Servidores iniciados.
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3001
echo.
echo Se abrio Google Chrome en el frontend.
echo Cierra ambas ventanas para detener los servidores.
echo.

pause
