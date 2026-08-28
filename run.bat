@echo off
title Orbit HQ Desktop
echo ========================================================
echo   Starting Orbit HQ Desktop App
echo   Backend & WebSockets: http://localhost:3001
echo   Frontend: http://localhost:5173
echo   Database: orbit_db in MariaDB (127.0.0.1:3306)
echo   HeidiSQL ready to inspect orbit_db
echo ========================================================
set PATH=C:\Program Files\nodejs;%PATH%
npm start
