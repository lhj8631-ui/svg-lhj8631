# Sync Script for Gemini Workspace
$localPath = "C:\gemini-workspace"
$networkPath = "N:\개인\gemini"
$excludeDirs = "node_modules", "dist", ".git", ".next", ".vite"

function Sync-FromNetwork {
    Write-Host "Syncing FROM Network Drive to Local..." -ForegroundColor Cyan
    robocopy $networkPath $localPath /MIR /XD $excludeDirs /R:3 /W:5 /MT:8 /FFT /UNICODE
    Write-Host "Sync Completed!" -ForegroundColor Green
}

function Sync-ToNetwork {
    Write-Host "Syncing TO Network Drive from Local..." -ForegroundColor Cyan
    robocopy $localPath $networkPath /MIR /XD $excludeDirs /R:3 /W:5 /MT:8 /FFT /UNICODE
    Write-Host "Sync Completed!" -ForegroundColor Green
}

# 기본 실행: 네트워크 -> 로컬 (Pull)
if ($args[0] -eq "push") {
    Sync-ToNetwork
} else {
    Sync-FromNetwork
}
