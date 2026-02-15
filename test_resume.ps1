Add-Type -AssemblyName System.Drawing
$pdfPath = "dummy_resume.pdf"
$pdfContent = "%PDF-1.4`n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>/Contents 4 0 R>>endobj 4 0 obj<</Length 55>>stream`nBT /F1 24 Tf 100 700 Td (Test Resume) Tj ET`nendstream`nendobj xref`n0 5`n0000000000 65535 f `n0000000010 00000 n `n0000000060 00000 n `n0000000117 00000 n `n0000000220 00000 n `ntrailer<</Size 5/Root 1 0 R>>`nstartxref`n325`n%%EOF"
Set-Content -Path $pdfPath -Value $pdfContent -NoNewline

# Note: The above is a very rough PDF approximation. 
# Better to checking if endpoint accepts the file, even if parsing fails due to malformed PDF.
# The goal is to check if endpoint is reachable and processing.

Write-Host "Created dummy PDF at $pdfPath"

$url = "http://localhost:8081/api/ai/parse-resume"
try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Form @{ file = Get-Item $pdfPath }
    Write-Host "Response:" ($response | ConvertTo-Json -Depth 5)
}
catch {
    Write-Host "Error:" $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Body: " $reader.ReadToEnd()
    }
}
