function Get-Token ($email, $password) {
    $body = @{ email = $email; password = $password } | ConvertTo-Json
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method Post -Body $body -ContentType "application/json"
        return $response.token
    }
    catch {
        Write-Host "Login failed for $email"
        return $null
    }
}

function Register-User ($name, $email, $password) {
    $body = @{ fullName = $name; email = $email; password = $password } | ConvertTo-Json
    try {
        Invoke-RestMethod -Uri "http://localhost:8081/api/auth/register" -Method Post -Body $body -ContentType "application/json" | Out-Null
        Write-Host "Registered $email"
    }
    catch {
        # Ignore if already exists
        Write-Host "User $email might already exist"
    }
}

function Create-Portfolio ($token, $role) {
    $headers = @{ Authorization = "Bearer $token" }
    $body = @{
        role       = $role
        skills     = "Test Skills"
        experience = "Test Exp"
        projects   = "Test Proj"
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "http://localhost:8081/api/portfolios" -Method Post -Headers $headers -Body $body -ContentType "application/json"
    }
    catch {
        Write-Host "Failed to create portfolio for role $role"
        Write-Host $_.Exception.Message
    }
}

function Get-Portfolios ($token) {
    $headers = @{ Authorization = "Bearer $token" }
    try {
        return Invoke-RestMethod -Uri "http://localhost:8081/api/portfolios" -Method Get -Headers $headers
    }
    catch {
        Write-Host "Failed to get portfolios"
        return @()
    }
}

# 1. Register Users
$emailA = "userA_" + (Get-Random) + "@test.com"
$emailB = "userB_" + (Get-Random) + "@test.com"
Register-User "User A" $emailA "password"
Register-User "User B" $emailB "password"

# 2. Login
$tokenA = Get-Token $emailA "password"
$tokenB = Get-Token $emailB "password"

if (!$tokenA -or !$tokenB) {
    Write-Error "Failed to get tokens"
    exit
}

# 3. Create Portfolios
Write-Host "Creating Portfolio for User A..."
Create-Portfolio $tokenA "User A Role"

Write-Host "Creating Portfolio for User B..."
Create-Portfolio $tokenB "User B Role"

# 4. Verify Isolation
Write-Host "`nVerifying User A's Portfolios:"
$portfoliosA = Get-Portfolios $tokenA
$portfoliosA | ForEach-Object { Write-Host "- $($_.role)" }

if ($portfoliosA.Count -eq 1 -and $portfoliosA[0].role -eq "User A Role") {
    Write-Host "SUCCESS: User A sees only their portfolio."
}
else {
    Write-Host "FAILURE: User A sees unexpected portfolios."
}

Write-Host "`nVerifying User B's Portfolios:"
$portfoliosB = Get-Portfolios $tokenB
$portfoliosB | ForEach-Object { Write-Host "- $($_.role)" }

if ($portfoliosB.Count -eq 1 -and $portfoliosB[0].role -eq "User B Role") {
    Write-Host "SUCCESS: User B sees only their portfolio."
}
else {
    Write-Host "FAILURE: User B sees unexpected portfolios."
}
