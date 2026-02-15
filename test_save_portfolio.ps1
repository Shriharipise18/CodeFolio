$body = @{
    role          = "Software Engineer"
    skills        = "Java, Spring Boot"
    experience    = "5 years"
    projects      = "Portfolio Generator"
    name          = "Test User"
    email         = "test@example.com"
    generatedBio  = "This is a bio."
    generatedHtml = "<html></html>"
    themeColor    = "#ffffff"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/portfolios" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Success: " ($response | ConvertTo-Json -Depth 5)
}
catch {
    Write-Host "Error: " $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Body: " $reader.ReadToEnd()
    }
}
