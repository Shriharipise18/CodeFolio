try {
    # Use cmd /c curl to avoid PowerShell parsing issues with curl alias and complex headers
    $cmd = 'cmd /c "curl -v -X OPTIONS http://localhost:8081/api/resume/upload-to-profile -H \"Origin: http://localhost:3000\" -H \"Access-Control-Request-Method: POST\""'
    Invoke-Expression $cmd
} catch {
    Write-Host "CORS Request Failed: $_" -ForegroundColor Red
}
