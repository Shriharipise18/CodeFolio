$baseUrl = "http://localhost:8081/api"
$email = "test.resume.curl.v2@example.com"
$password = "password123"
$fullName = "Resume Curl User V2"

# 1. Login to get token
Write-Host "Getting token..."
$loginBody = @{ email = $email; password = $password } | ConvertTo-Json
try {
    # Try login first
    $resp = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $resp.token
} catch {
    # If login fails, try register
    try {
        $body = @{ email = $email; password = $password; fullName = $fullName } | ConvertTo-Json
        $resp = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $body -ContentType "application/json"
        $token = $resp.token
    } catch {
        Write-Error "Failed to login or register."
        exit 1
    }
}

Write-Host "Token: $token"

# 2. Upload with curl
$pdfPath = ".\dummy_resume.pdf" # Ensure this exists
if (-not (Test-Path $pdfPath)) {
    "Fake PDF Content" | Out-File -Encoding ASCII $pdfPath
}

$uploadUrl = "$baseUrl/resume/upload-to-profile"
# Use curl's -F to properly handle multipart boundary
$header = "Authorization: Bearer $token"

Write-Host "Uploading resume..."
# Note: Using cmd /c curl to ensure we use the system curl, not PS alias
cmd /c curl -v -X POST -H "Authorization: Bearer $token" -F "file=@$pdfPath" $uploadUrl
