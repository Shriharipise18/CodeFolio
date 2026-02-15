$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:8081/api"

function Test-Request {
    param($Uri, $Method, $Body, $Headers = @{})
    try {
        $params = @{
            Uri         = $Uri
            Method      = $Method
            ContentType = "application/json"
            ErrorAction = "Stop"
            TimeoutSec  = 120
        }
        if ($Body) { $params.Body = ($Body | ConvertTo-Json -Depth 5) }
        if ($Headers) { $params.Headers = $Headers }
        
        Write-Host "Sending request to $Uri..."
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

$portfolioBody = @{
    role       = "Software Engineer"
    skills     = "Java, Spring Boot, React"
    experience = "5 years of experience in full stack development."
    projects   = "Built a portfolio generator."
    name       = "Test User"
    email      = "test@example.com"
    phone      = "1234567890"
    linkedin   = "linkedin.com/test"
    github     = "github.com/test"
    themeColor = "#4f46e5"
}

Write-Host "Testing Website Generation..."
$response = Test-Request -Uri "$baseUrl/ai/generate-website" -Method Post -Body $portfolioBody

if ($response.html -and $response.html.Length -gt 0) {
    Write-Host "SUCCESS: Website generated. Length: $($response.html.Length) characters."
    Write-Host "Preview (first 100 chars): $($response.html.Substring(0, 100))"
}
else {
    Write-Host "FAILURE: API returned empty HTML."
}
