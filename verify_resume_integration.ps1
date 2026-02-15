# verification script
$baseUrl = "http://localhost:8081/api"
$email = "test.resume.curl@example.com"
$password = "password123"
$fullName = "Resume Curl User"

Write-Host "1. Registering/Login..."
$body = @{ email = $email; password = $password; fullName = $fullName } | ConvertTo-Json
try {
    $resp = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $body -ContentType "application/json"
    $token = $resp.token
} catch {
    $loginBody = @{ email = $email; password = $password } | ConvertTo-Json
    $resp = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $resp.token
}

Write-Host "   Token received."

$pdfPath = ".\dummy_resume.pdf"
if (-not (Test-Path $pdfPath)) {
    Write-Host "   dummy_resume.pdf not found. Creating a fake one."
    "Fake PDF Content" | Out-File -Encoding ASCII $pdfPath
}

Write-Host "2. Uploading Resume using curl.exe..."
# We use curl.exe because Invoke-RestMethod in PS 5.1 doesn't handle multipart easily
$header = "Authorization: Bearer $token"
$uploadUrl = "$baseUrl/resume/upload-to-profile"

# Execute curl.exe
# Note the syntax for file upload in curl is -F "file=@path"
$curlArgs = "-X", "POST", "-H", "`"$header`"", "-F", "`"file=@$pdfPath`"", "$uploadUrl"
& curl.exe $curlArgs

Write-Host "`n   Upload command executed."

Write-Host "3. Verifying Profile..."
$headers = @{ Authorization = "Bearer $token" }
$profile = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method Get -Headers $headers

if ($profile.bio -or $profile.skills) {
    Write-Host "   SUCCESS: Resume data found in profile!"
    Write-Host "   Skills: $($profile.skills)"
} else {
    Write-Warning "   Resume data NOT found. Check above curl output for errors."
}
