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
    role       = "Designer"
    skills     = "Figma, Adobe XD, CSS"
    experience = "3 years in UI/UX"
    projects   = "Designed a minimal portfolio."
    name       = "Minimal User"
    email      = "minimal@example.com"
    phone      = "0987654321"
    linkedin   = "linkedin.com/minimal"
    github     = "github.com/minimal"
    themeColor = "#000000"
    template   = "Minimal"
}

Write-Host "Testing Website Generation (Minimal Template)..."
$response = Test-Request -Uri "$baseUrl/ai/generate-website" -Method Post -Body $portfolioBody

if ($response.html -and $response.html.Length -gt 0) {
    Write-Host "SUCCESS: Website generated. Length: $($response.html.Length) characters."
    $response.html | Out-File -FilePath "generated_minimal.html" -Encoding utf8
    Write-Host "Saved to generated_minimal.html"
}
else {
    Write-Host "FAILURE: API returned empty HTML."
}
