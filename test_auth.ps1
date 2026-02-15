$headers = @{
    "Content-Type" = "application/json"
}

$registerBody = @{
    fullName = "Test User"
    email    = "testuser@example.com"
    password = "password123"
} | ConvertTo-Json

$loginBody = @{
    email    = "testuser@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    Write-Host "Testing Registration..."
    $regResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/register" -Method Post -Headers $headers -Body $registerBody
    Write-Host "Registration Successful. Token: $($regResponse.token)"

    Write-Host "Testing Login..."
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method Post -Headers $headers -Body $loginBody
    Write-Host "Login Successful. Token: $($loginResponse.token)"
}
catch {
    Write-Host "Error calling API:"
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response Body: $($reader.ReadToEnd())"
    }
}
