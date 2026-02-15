$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:8081/api"
$userEmail = "save_test_$(Get-Random)@example.com"
$password = "password123"

function Test-Request {
    param($Uri, $Method, $Body, $Headers = @{})
    try {
        $params = @{
            Uri         = $Uri
            Method      = $Method
            ContentType = "application/json"
            ErrorAction = "Stop"
        }
        if ($Body) { $params.Body = ($Body | ConvertTo-Json -Depth 5) }
        if ($Headers) { $params.Headers = $Headers }
        
        return Invoke-RestMethod @params
    }
    catch {
        Write-Host "Request to $Uri failed: $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            Write-Host "Response Body: $($reader.ReadToEnd())"
        }
        exit 1
    }
}

Write-Host "1. Registering user..."
$registerBody = @{
    fullName = "Save Test User"
    email    = $userEmail
    password = $password
}
Test-Request -Uri "$baseUrl/auth/register" -Method Post -Body $registerBody | Out-Null
Write-Host "   User registered."

Write-Host "2. Logging in..."
$loginBody = @{
    email    = $userEmail
    password = $password
}
$loginResponse = Test-Request -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody
$token = $loginResponse.token
Write-Host "   Logged in. Token: $($token.Substring(0, 10))..."

Write-Host "3. Saving portfolio..."
$portfolioBody = @{
    role          = "Test Role"
    skills        = "Test Skills"
    experience    = "Test Experience"
    projects      = "Test Projects"
    name          = "Test User"
    email         = $userEmail
    phone         = "1234567890"
    linkedin      = "linkedin.com/test"
    github        = "github.com/test"
    generatedBio  = "Generated Bio"
    generatedHtml = "<html><body>Test</body></html>"
}
$headers = @{ Authorization = "Bearer $token" }
$saveResponse = Test-Request -Uri "$baseUrl/portfolios" -Method Post -Body $portfolioBody -Headers $headers

Write-Host "   Portfolio Saved! ID: $($saveResponse.id)"
Write-Host "SUCCESS: Save flow verified."
