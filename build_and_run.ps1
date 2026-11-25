$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

# Detectar JDK y Maven locales si no estan en PATH
if (-not (Get-Command javac -ErrorAction SilentlyContinue)) {
    $jdkDir = Join-Path $env:USERPROFILE ".jdks"
    $jdk = Get-ChildItem -Path $jdkDir -Directory -ErrorAction SilentlyContinue | Sort-Object Name -Descending | Select-Object -First 1
    if ($jdk -and (Test-Path "$($jdk.FullName)\bin\javac.exe")) {
        $env:JAVA_HOME = $jdk.FullName
        $env:Path = "$($jdk.FullName)\bin;$env:Path"
    }
}
if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
    $mvnCmd = Get-ChildItem "$env:ProgramFiles\JetBrains" -Recurse -Filter "mvn.cmd" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($mvnCmd) {
        $env:Path = "$($mvnCmd.DirectoryName);$env:Path"
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
