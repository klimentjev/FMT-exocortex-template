# FPF Version Monitor - PowerShell 5.1 compatible
# Checks local FPF version against GitHub
# Runs check no more than once per 3 days

# Configuration
$FPF_LOCAL = "c:\Users\admin\IWE\Principles\FPF\FPF-Spec.md"
$GITHUB_RAW = "https://raw.githubusercontent.com/ailev/FPF/main/FPF-Spec.md"
$METADATA_DIR = "c:\Users\admin\IWE\.claude\meta"
$LAST_CHECK_FILE = "$METADATA_DIR\fpf-last-check.txt"
$CHECK_INTERVAL_DAYS = 3

# Create metadata directory if needed
if (-not (Test-Path $METADATA_DIR)) {
    New-Item -ItemType Directory -Path $METADATA_DIR -Force | Out-Null
}

# Function to extract version from file
function Get-FPFVersion {
    param([string]$FilePath)
    
    if (-not (Test-Path $FilePath)) {
        return "local file not found"
    }
    
    try {
        # Read first 10 lines
        $lines = @(Get-Content -Path $FilePath | Select-Object -First 10)
        $content = $lines -join "`n"
        
        if ($content -match '(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}') {
            return $matches[0]
        }
        return "version not found"
    }
    catch {
        return "error reading file"
    }
}

# Function to check if GitHub check is needed
function Should-CheckGitHub {
    if (-not (Test-Path $LAST_CHECK_FILE)) {
        return $true
    }
    
    try {
        $lastCheck = Get-Content -Path $LAST_CHECK_FILE -Raw
        $lastCheckTime = [DateTime]::ParseExact($lastCheck.Trim(), "o", $null)
        $daysSinceCheck = ([DateTime]::UtcNow - $lastCheckTime).TotalDays
        
        return $daysSinceCheck -ge $CHECK_INTERVAL_DAYS
    }
    catch {
        return $true
    }
}

# Function to save last check time
function Set-LastCheckTime {
    [DateTime]::UtcNow.ToString("o") | Out-File -FilePath $LAST_CHECK_FILE -NoNewline -Force
}

# Main logic
Write-Host "`n=== FPF Version Monitor ===" -ForegroundColor Cyan
Write-Host "Check interval: $CHECK_INTERVAL_DAYS days`n"

# Check local version
$localVersion = Get-FPFVersion -FilePath $FPF_LOCAL
Write-Host "Local version: $localVersion"
Write-Host "   File: $FPF_LOCAL`n"

# Check if GitHub check is needed
if (-not (Should-CheckGitHub)) {
    try {
        $lastCheckContent = Get-Content -Path $LAST_CHECK_FILE -Raw
        $lastCheckTime = [DateTime]::ParseExact($lastCheckContent.Trim(), "o", $null)
        $daysSinceCheck = ([DateTime]::UtcNow - $lastCheckTime).TotalDays
        $daysUntilNext = [Math]::Ceiling($CHECK_INTERVAL_DAYS - $daysSinceCheck)
        
        Write-Host "Next check in: $daysUntilNext days (last: $([Math]::Round($daysSinceCheck, 1)) days ago)"
        Write-Host "   To force check now, delete: $LAST_CHECK_FILE`n"
    }
    catch {
        Write-Host "Could not read last check time`n"
    }
    exit 0
}

Write-Host "Checking GitHub (ailev/FPF)..."

try {
    # Use Invoke-WebRequest instead
    $response = Invoke-WebRequest -Uri $GITHUB_RAW -UseBasicParsing -TimeoutSec 10
    $githubContent = $response.Content
    
    if ($githubContent -match '(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}') {
        $remoteVersion = $matches[0]
    }
    else {
        $remoteVersion = "unable to parse"
    }
    
    Write-Host "Remote version on GitHub: $remoteVersion`n"
    
    # Compare versions
    if ($localVersion -eq $remoteVersion) {
        Write-Host "SYNCHRONIZED" -ForegroundColor Green
        Write-Host "   Your local copy is up to date.`n"
    }
    else {
        Write-Host "DESYNCHRONIZATION DETECTED" -ForegroundColor Yellow
        Write-Host "   Local: $localVersion"
        Write-Host "   GitHub: $remoteVersion"
        Write-Host "   -> Consider updating your local copy`n"
    }
    
    # Save check time
    Set-LastCheckTime
    Write-Host "Last check saved`n"
    
}
catch {
    Write-Host "GitHub connection error: $_" -ForegroundColor Red
    Write-Host "   Check your internet connection.`n"
    exit 1
}

Write-Host "============================================================`n"
