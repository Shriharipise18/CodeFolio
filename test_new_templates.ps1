$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:8081/api"

function Test-Request {
    param($Uri, $Method, $Body)
    try {
        $params = @{
            Uri         = $Uri
            Method      = $Method
            ContentType = "application/json"
            Body        = ($Body | ConvertTo-Json -Depth 5)
            ErrorAction = "Stop"
            TimeoutSec  = 120
        }
        Write-Host "Sending request for template: $($Body.template)..."
        return Invoke-RestMethod @params
    }
    catch {
        Write-Host "Request failed: $($_.Exception.Message)"
        if ($_.Exception.Response) {
            # Read error stream safely
            $stream = $_.Exception.Response.GetResponseStream()
            if ($stream) {
                $reader = New-Object System.IO.StreamReader($stream)
                Write-Host "Response Body: $($reader.ReadToEnd())"
            }
        }
        exit 1
    }
}

$baseBody = @{
    role       = "Software Engineer"
    skills     = "Java, Spring, React"
    experience = "5 years full stack"
    projects   = "Enterprise ERP, AI Chatbot"
    name       = "Dev User"
    email      = "dev@example.com"
    phone      = "1234567890"
    linkedin   = "linkedin.com/dev"
    github     = "github.com/dev"
    themeColor = "#00ff41" # Matrix Green
}

# Test Developer Template
$devBody = $baseBody.Clone()
$devBody.template = "Developer"
$devResponse = Test-Request -Uri "$baseUrl/ai/generate-website" -Method Post -Body $devBody

if ($devResponse.html -and $devResponse.html.Length -gt 0) {
    Write-Host "SUCCESS: Developer Website generated."
    $devResponse.html | Out-File -FilePath "generated_developer.html" -Encoding utf8
}

# Test Professional Template
$profBody = $baseBody.Clone()
$profBody.template = "Professional"
$profBody.themeColor = "#1e3a8a" # Navy Blue
$profResponse = Test-Request -Uri "$baseUrl/ai/generate-website" -Method Post -Body $profBody

if ($profResponse.html -and $profResponse.html.Length -gt 0) {
    Write-Host "SUCCESS: Professional Website generated."
    $profResponse.html | Out-File -FilePath "generated_professional.html" -Encoding utf8
}
