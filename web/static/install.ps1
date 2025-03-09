# PowerShell script to download and install Kimbia on Windows

$BaseUrl = "https://github.com/mistweaverco/kimbia/releases/download/latest"
$FileName = "kimbia-x64.exe"
$DestDir = "$env:ProgramFiles\Kimbia"
$DestFile = "$DestDir\kimbia.exe"

# Ensure destination directory exists
if (!(Test-Path -Path $DestDir)) {
  New-Item -ItemType Directory -Path $DestDir -Force | Out-Null
}

# Download the file
$DownloadUrl = "$BaseUrl/$FileName"
Write-Output "Downloading $DownloadUrl..."
Invoke-WebRequest -Uri $DownloadUrl -OutFile $DestFile

Write-Output "Download complete. The binary is located in $DestFile."

# Ensure the directory is in PATH
$SystemPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
if ($SystemPath -notlike "*;$DestDir;*") {
  Write-Output "Adding $DestDir to system PATH..."
    [System.Environment]::SetEnvironmentVariable('Path', $SystemPath + ';' + $DestDir, 'Machine')
    Write-Output "You may need to restart your terminal for changes to take effect."
}

Write-Output "Installation complete. You can now run 'kimbia' from any command prompt."

# Instructions for elevated execution
Write-Output "If you encounter permission issues, run this script in an elevated PowerShell session."
Write-Output "To do this, right-click on PowerShell and select 'Run as administrator', then execute:"
Write-Output "pwsh -ExecutionPolicy Bypass -File install.ps1"
