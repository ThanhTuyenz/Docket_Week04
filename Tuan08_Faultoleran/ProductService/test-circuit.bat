@echo off
echo Running test for /api/test-circuit ...
for /L %%i in (1,1,10) do (
    echo Request %%i:
    curl -s http://localhost:3000/api/test-circuit
    echo.
    timeout /t 1 >nul
)
echo Done.
pause
