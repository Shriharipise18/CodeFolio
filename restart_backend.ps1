$port = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue
if ($port) { 
    Write-Host "Stopping process on port 8081 (PID: $($port.OwningProcess))..."
    Stop-Process -Id $port.OwningProcess -Force 
}
else {
    Write-Host "No process found on port 8081."
}

$env:JAVA_HOME = "C:\Program Files\Java\jdk-22"
$env:Path = "C:\Program Files\Java\jdk-22\bin;" + $env:Path
mvn spring-boot:run
