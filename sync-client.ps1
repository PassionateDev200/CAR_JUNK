# Set directories
$source = "D:\Freelancer\CashCarJunk\Car-Junk-Base\frontend"
$destination = "D:\Freelancer\CashCarJunk\Car-Junk"

# Load .clientignore
$ignoreList = Get-Content "$source\.clientignore"

# Remove old destination files (optional but safe)
Get-ChildItem $destination -Recurse -Force | Remove-Item -Force -Recurse

# Copy allowed files only
Get-ChildItem -Path $source -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Substring($source.Length + 1)
    $skip = $false
    foreach ($pattern in $ignoreList) {
        if ($relativePath -like $pattern) {
            $skip = $true
            break
        }
    }
    if (-not $skip) {
        $destPath = Join-Path $destination $relativePath
        New-Item -ItemType Directory -Path (Split-Path $destPath) -Force | Out-Null
        Copy-Item $_.FullName $destPath -Force
    }
}

# Now commit and push from client repo
Set-Location $destination
git add .
git commit -m "Client update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git push origin main --force
