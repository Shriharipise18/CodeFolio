$env:JAVA_HOME = "C:\Program Files\Java\jdk-22"
$env:Path = "C:\Program Files\Java\jdk-22\bin;" + $env:Path
Write-Host "Using JAVA_HOME: $env:JAVA_HOME"
mvn spring-boot:run
