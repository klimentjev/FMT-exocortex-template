$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root "share\claude-hooks-dist"
$dest = Join-Path $HOME ".iwe\claude-hooks"
if (-not (Test-Path $src)) { throw "Missing $src" }
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Copy-Item -Path (Join-Path $src "*") -Destination $dest -Force
Write-Host "Installed Claude Code hooks to $dest"
