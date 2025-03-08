$signtool = Get-ChildItem -Path "C:\Program Files (x86)\Windows Kits" -Recurse -Filter "signtool.exe" | Select-Object -First 1 -ExpandProperty FullName
Write-Host "Using signtool at $signtool"
& $signtool remove /s dist/kimbia-x64.exe
