try {
  gh release create v$(jq -r .version package.json) dist/kimbia-x64.exe --generate-notes
  if ($LASTEXITCODE -ne 0) {
    throw "Release already exists"
  }
} catch {
  gh release upload --clobber v$(jq -r .version package.json) dist/kimbia-x64.exe
}
