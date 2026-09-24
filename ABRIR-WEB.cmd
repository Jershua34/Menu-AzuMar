@echo off
REM Abre la web en el navegador para revisarla antes de publicarla.
REM Hace falta un servidor local: el mar 3D no carga con doble clic en index.html.
REM Deja esta ventana abierta mientras revisas; ciérrala para apagar el servidor.
cd /d "%~dp0"
start "" http://127.0.0.1:5510/
python -m http.server 5510 --bind 127.0.0.1
