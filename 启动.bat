@echo off
cd /d "%~dp0"
if not exist node_modules\kokoro-js (
  echo Installing speech runtime dependencies. Internet required.
  call npm ci --cache .cache/npm
  if errorlevel 1 goto end
)
echo Open http://localhost:4173 in your browser.
node server.mjs
:end
pause
