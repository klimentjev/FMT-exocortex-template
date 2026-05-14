#Requires -Version 5.1
<#
.SYNOPSIS
  Registers Windows Task Scheduler jobs for Strategist and Extractor (launchd equivalent on macOS).

.DESCRIPTION
  Requires Git for Windows (bash.exe), .iwe-runtime with substituted scripts, and
  setup/windows/iwe-task-env.sh (copy from iwe-task-env.example.sh).

.PARAMETER WorkspaceWin
  Absolute path to IWE root, e.g. C:\Users\you\IWE

.PARAMETER GitBashExe
  Path to bash.exe (default: Program Files\Git\bin\bash.exe).

.PARAMETER MorningHour
  Local hour (0-23) for daily Strategist morning run.

.PARAMETER SkipExtractor
  Do not register Extractor inbox-check (every 3 hours).

.PARAMETER WhatIf
  Print actions only; do not register tasks.
#>
param(
    [Parameter(Mandatory = $true, HelpMessage = "Absolute path to IWE root")]
    [string]$WorkspaceWin,

    [string]$GitBashExe = "${env:ProgramFiles}\Git\bin\bash.exe",

    [ValidateRange(0, 23)]
    [int]$MorningHour = 7,

    [string]$TaskNamePrefix = "IWE",

    [switch]$SkipExtractor,

    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function ConvertTo-GitBashPath([string]$WinPath) {
    $WinPath = $WinPath.TrimEnd('\')
    if ($WinPath -match '^([A-Za-z]):\\(.*)$') {
        $d = $Matches[1].ToLower()
        $rest = $Matches[2] -replace '\\', '/'
        return "/$d/$rest"
    }
    return ($WinPath -replace '\\', '/')
}

if (-not (Test-Path -LiteralPath $GitBashExe)) {
    throw "Git Bash not found: $GitBashExe. Install Git for Windows or pass -GitBashExe."
}

if (-not (Test-Path -LiteralPath $WorkspaceWin)) {
    throw "IWE workspace not found: $WorkspaceWin"
}
$WorkspaceWin = (Resolve-Path -LiteralPath $WorkspaceWin).Path

$RuntimeStrategist = Join-Path $WorkspaceWin '.iwe-runtime\roles\strategist\scripts\strategist.sh'
$RuntimeExtractor = Join-Path $WorkspaceWin '.iwe-runtime\roles\extractor\scripts\extractor.sh'
$EnvScriptWin = Join-Path $WorkspaceWin 'setup\windows\iwe-task-env.sh'

if (-not (Test-Path -LiteralPath $EnvScriptWin)) {
    throw "Missing env file: $EnvScriptWin. Copy iwe-task-env.example.sh to iwe-task-env.sh and edit paths."
}
foreach ($req in @($RuntimeStrategist, $RuntimeExtractor)) {
    if (-not (Test-Path -LiteralPath $req)) {
        Write-Warning "Missing script (run build-runtime / migrate first): $req"
    }
}

$envBash = ConvertTo-GitBashPath $EnvScriptWin
$strategistBash = ConvertTo-GitBashPath $RuntimeStrategist
$extractorBash = ConvertTo-GitBashPath $RuntimeExtractor

$morningCmd = "set -e; source '$envBash'; exec '$strategistBash' morning"
$weekCmd = "set -e; source '$envBash'; exec '$strategistBash' week-review"
$extractCmd = "set -e; source '$envBash'; exec '$extractorBash' inbox-check"

function Register-IweScheduledTask {
    param(
        [string]$TaskName,
        [string]$ArgumentLc,
        [string]$Description,
        [CimInstance[]]$Trigger
    )
    $action = New-ScheduledTaskAction -Execute $GitBashExe -Argument "-lc `"$ArgumentLc`"" -WorkingDirectory $WorkspaceWin
    $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Hours 4)
    $principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited
    if ($WhatIf) {
        Write-Host "[WhatIf] Register-ScheduledTask -TaskName $TaskName"
        return
    }
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue | Out-Null
    Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $Trigger -Settings $settings -Principal $principal -Description $Description | Out-Null
    Write-Host "OK: $TaskName"
}

$atMorning = Get-Date -Hour $MorningHour -Minute 0 -Second 0
$tMorning = New-ScheduledTaskTrigger -Daily -At $atMorning
Register-IweScheduledTask -TaskName "$TaskNamePrefix-Strategist-Morning" -ArgumentLc $morningCmd `
    -Description "IWE Strategist morning (replaces com.strategist.morning launchd)" -Trigger $tMorning

$tWeek = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -WeeksInterval 1 -At "12:05AM"
Register-IweScheduledTask -TaskName "$TaskNamePrefix-Strategist-WeekReview" -ArgumentLc $weekCmd `
    -Description "IWE Strategist week-review (replaces com.strategist.weekreview launchd)" -Trigger $tWeek

if (-not $SkipExtractor) {
    $tExt = New-ScheduledTaskTrigger -Once -At (Get-Date).Date -RepetitionInterval (New-TimeSpan -Hours 3) -RepetitionDuration (New-TimeSpan -Days 365)
    Register-IweScheduledTask -TaskName "$TaskNamePrefix-Extractor-InboxCheck" -ArgumentLc $extractCmd `
        -Description "IWE Extractor inbox-check every 3h (replaces com.extractor.inbox-check launchd)" -Trigger $tExt
}

Write-Host "Done. Open Task Scheduler and verify tasks with prefix $TaskNamePrefix-"
