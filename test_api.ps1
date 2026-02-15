$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    role       = "Software Engineer"
    skills     = "Java, Spring Boot, React"
    experience = "3 years working on web applications"
    projects   = "E-commerce platform, Portfolio Generator"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/ai/analyze-profile" -Method Post -Headers $headers -Body $body
    Write-Host "Response received successfully."
    Write-Host "Match Score: $($response.matchScore)"
    Write-Host "Section Scores: $($response.sectionScores | ConvertTo-Json)"
    Write-Host "Strengths: $($response.strengths | ConvertTo-Json)"
}
catch {
    Write-Host "Error calling API:"
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response Body: $($reader.ReadToEnd())"
    }
}
