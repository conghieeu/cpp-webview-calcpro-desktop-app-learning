# Automation script for building and running the project
Write-Host "--- Building UI ---" -ForegroundColor Cyan
Set-Location ui
npm run build
Set-Location ..

Write-Host "--- Building C++ ---" -ForegroundColor Cyan
cmake --build build

if ($LASTEXITCODE -eq 0) {
    Write-Host "--- Running Application ---" -ForegroundColor Green
    .\build\bin\Debug\app.exe
} else {
    Write-Host "--- Build Failed! ---" -ForegroundColor Red
}
