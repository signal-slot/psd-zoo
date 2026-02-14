# run_all.ps1 - Execute all JSX generation scripts via Photoshop COM automation
# Prerequisites:
#   - Adobe Photoshop 2026 must be installed and running
#   - Fonts: Roboto-Regular, Roboto-Bold, Roboto-Italic must be installed
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File run_all.ps1
#   powershell -ExecutionPolicy Bypass -File run_all.ps1 -Script gen_batch1.jsx

param(
    [string]$Script = ""
)

$basePath = $PSScriptRoot

# Connect to Photoshop via COM
try {
    $ps = New-Object -ComObject Photoshop.Application
    Write-Host "Connected to Photoshop: $($ps.Name) $($ps.Version)" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Cannot connect to Photoshop COM. Make sure Adobe Photoshop 2026 is running." -ForegroundColor Red
    Write-Host "Start it with: Start-Process 'C:\Program Files\Adobe\Adobe Photoshop 2026\Photoshop.exe'"
    exit 1
}

# Determine which scripts to run
if ($Script -ne "") {
    $scripts = @(Join-Path $basePath $Script)
    if (-not (Test-Path $scripts[0])) {
        Write-Host "ERROR: Script not found: $($scripts[0])" -ForegroundColor Red
        exit 1
    }
} else {
    # Run all JSX scripts in order
    $scripts = @(
        # Original generation scripts (from qtpsd test data)
        "create_psd.jsx",
        "create_psd_remaining.jsx",
        "create_all_psd.jsx",
        "create_remaining2.jsx",
        "create_final.jsx",
        "create_emoji.jsx",
        # Text, fill, adjustment, extra
        "gen_text.jsx",
        "gen_fill.jsx",
        "gen_adj.jsx",
        "gen_extra1.jsx",
        # Shapes and deep nesting
        "gen_shapes.jsx",
        "gen_deep.jsx",
        # More effects, text, misc, adjustments
        "gen_effects2.jsx",
        "gen_text2.jsx",
        "gen_misc2.jsx",
        "gen_adj2.jsx",
        "gen_more.jsx",
        # Batch scripts
        "gen_batch1.jsx",
        "gen_batch2.jsx",
        "gen_batch3.jsx",
        "gen_batch4.jsx",
        "gen_batch5.jsx",
        # Descriptor coverage
        "gen_desc1.jsx",
        "gen_desc2.jsx",
        "gen_desc3.jsx",
        "gen_desc4.jsx",
        "gen_desc5.jsx",
        "gen_desc6.jsx"
    ) | ForEach-Object { Join-Path $basePath $_ } | Where-Object { Test-Path $_ }
}

$totalOk = 0
$totalFail = 0

foreach ($jsx in $scripts) {
    $name = Split-Path $jsx -Leaf
    Write-Host "`nRunning $name ..." -ForegroundColor Cyan
    try {
        $result = $ps.DoJavascriptFile($jsx)
        Write-Host "  Result: $result" -ForegroundColor Yellow
        # Parse ok/fail from result string
        if ($result -match "(\d+) ok, (\d+) fail") {
            $totalOk += [int]$Matches[1]
            $totalFail += [int]$Matches[2]
        }
    } catch {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $totalFail++
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Total: $totalOk ok, $totalFail fail" -ForegroundColor Green
$psdCount = (Get-ChildItem (Join-Path $basePath "*.psd")).Count
Write-Host "PSD files on disk: $psdCount" -ForegroundColor Green
