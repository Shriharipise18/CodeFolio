$headers = @{
    "Origin"                         = "http://localhost:5173"
    "Access-Control-Request-Method"  = "POST"
    "Access-Control-Request-Headers" = "content-type"
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8081/api/auth/login" -Method Options -Headers $headers
    Write-Host "CORS Test Status: $($response.StatusCode)"
    Write-Host "Access-Control-Allow-Origin: $($response.Headers['Access-Control-Allow-Origin'])"
    Write-Host "Access-Control-Allow-Methods: $($response.Headers['Access-Control-Allow-Methods'])"
    Write-Host "Access-Control-Allow-Credentials: $($response.Headers['Access-Control-Allow-Credentials'])"
}
catch {
    Write-Host "CORS Test Failed: $_"
}
