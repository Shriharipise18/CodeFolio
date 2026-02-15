# Verification Script for Profile Update

$baseUrl = "http://localhost:8081/api"
$email = "test.profile.update@example.com"
$password = "password123"
$fullName = "Test User"
$newFullName = "Updated Test User"

Write-Host "1. Registering user..."
$registerBody = @{
    email = $email
    password = $password
    fullName = $fullName
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    $token = $registerResponse.token
    Write-Host "   User registered. Token received."
} catch {
    Write-Host "   Registration failed or user already exists. Attempting login..."
    try {
        $loginBody = @{
            email = $email
            password = $password
        } | ConvertTo-Json
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
        $token = $loginResponse.token
        Write-Host "   Login successful. Token received."
    } catch {
        Write-Error "   Login failed. Cannot proceed."
        exit 1
    }
}

$headers = @{
    Authorization = "Bearer $token"
}

Write-Host "2. Fetching current profile..."
try {
    $profile = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method Get -Headers $headers
    Write-Host "   Current Full Name: $($profile.fullName)"
} catch {
    Write-Error "   Failed to fetch profile: $_"
    exit 1
}

Write-Host "3. Updating profile (Full Name)..."
$updateBody = @{
    fullName = $newFullName
    password = ""
} | ConvertTo-Json

try {
    $updatedProfile = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method Put -Headers $headers -Body $updateBody -ContentType "application/json"
    Write-Host "   Update successful."
    Write-Host "   New Full Name in response: $($updatedProfile.fullName)"
} catch {
    Write-Error "   Failed to update profile: $_"
    exit 1
}

Write-Host "4. Verifying persistence..."
try {
    $profileCheck = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method Get -Headers $headers
    if ($profileCheck.fullName -eq $newFullName) {
        Write-Host "   SUCCESS: Profile name updated to '$newFullName'!"
    } else {
        Write-Error "   FAILURE: Profile name mismatch. Expected '$newFullName', got '$($profileCheck.fullName)'"
    }
} catch {
    Write-Error "   Failed to fetch profile: $_"
    exit 1
}
