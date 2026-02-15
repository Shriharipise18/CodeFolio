$ErrorActionPreference = "Stop"
try {
    $uri = "http://localhost:8081/api/ai/parse-resume"
    $filePath = "c:\JAVA\PortfolioGenerator\dummy_resume.pdf"
    
    Write-Host "Sending request to $uri with file $filePath"
    
    $response = Invoke-RestMethod -Uri $uri -Method Post -InFile $filePath -ContentType "multipart/form-data" -ErrorAction Stop
    
    Write-Host "Response received:"
    Write-Host ($response | ConvertTo-Json -Depth 5)
}
catch {
    Write-Host "Request failed!"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)"
    
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $responseBody = $reader.ReadToEnd()
    Write-Host "Response Body: $responseBody"
}
