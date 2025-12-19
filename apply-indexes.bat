@echo off
echo Applying database indexes...
echo.

curl -X POST "https://dpg-d5265l7pm1nc73ei1km0-a.oregon-postgres.render.com:5432" ^
  -H "Content-Type: application/sql" ^
  --data-binary @DATABASE_INDEXES.sql

echo.
echo Done! Indexes applied.
pause
