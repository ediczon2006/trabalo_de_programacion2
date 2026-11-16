$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

# Detectar JDK y Maven locales si no estan en PATH
if (-not (Get-Command javac -ErrorAction SilentlyContinue)) {
    $jdk = "C:\Users\edicz\.jdks\openjdk-24.0.2+12-54"
    if (Test-Path "$jdk\bin\javac.exe") {
        $env:JAVA_HOME = $jdk
        $env:Path = "$jdk\bin;$env:Path"
    }
}
if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
    $mvnBin = "C:\Program Files\JetBrains\IntelliJ IDEA 2025.2.1\plugins\maven\lib\maven3\bin"
    if (Test-Path "$mvnBin\mvn.cmd") {
        $env:Path = "$mvnBin;$env:Path"
    }
}
if (-not (Get-Command g++ -ErrorAction SilentlyContinue)) {
    $winlibs = Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Recurse -Filter "g++.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($winlibs) {
        $env:Path = "$($winlibs.DirectoryName);$env:Path"
    }
}

Write-Host "1/3 Compilando validador nativo en C++..."
New-Item -ItemType Directory -Force -Path "$Root\native\bin" | Out-Null
& g++ -std=c++17 -O2 -static -static-libgcc -static-libstdc++ "$Root\native\image_analyzer.cpp" -o "$Root\native\bin\image_analyzer.exe"

Write-Host "2/3 Compilando servidor Java y descargando librerias SQLite/Gson..."
& mvn -B package -DskipTests

Write-Host "3/3 Iniciando servidor en http://localhost:8080 ..."
& java -jar "$Root\target\software-app.jar"
