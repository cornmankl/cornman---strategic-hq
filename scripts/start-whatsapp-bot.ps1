#!/usr/bin/env pwsh
# CORNMAN WhatsApp Bot Starter

Write-Host "CORNMAN REAL WhatsApp Bot Starter" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if required packages are installed
if (-not (Test-Path "node_modules/@adiwajshing/baileys")) {
    Write-Host "Installing WhatsApp Bot dependencies..." -ForegroundColor Yellow
    npm install @adiwajshing/baileys@latest qrcode-terminal pino @hapi/boom
}

# Set environment variables
$env:WA_BOT_PORT = "4001"
$env:WA_BOT_HOST = "localhost"
$env:LOG_LEVEL = "info"

Write-Host ""
Write-Host "Starting REAL WhatsApp Bot Server..." -ForegroundColor Cyan
Write-Host "Port: 4001" -ForegroundColor Yellow
Write-Host "URL: http://localhost:4001" -ForegroundColor Yellow
Write-Host ""
Write-Host "Instructions:" -ForegroundColor Magenta
Write-Host "1. QR code akan muncul di terminal ini" -ForegroundColor White
Write-Host "2. Scan QR code dengan WhatsApp anda" -ForegroundColor White
Write-Host "3. Bot akan connect automatik" -ForegroundColor White
Write-Host "4. Gunakan mobile app untuk send messages" -ForegroundColor White
Write-Host ""
Write-Host "Keep this terminal open untuk bot tetap running!" -ForegroundColor Red
Write-Host ""

# Start the bot
try {
    node scripts/wa-bot.mjs
} catch {
    Write-Host "Error starting WhatsApp bot: $_" -ForegroundColor Red
    Write-Host "Make sure port 4001 is not in use" -ForegroundColor Yellow
    exit 1
}
