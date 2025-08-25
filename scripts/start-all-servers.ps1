# CORNMAN Strategic HQ - Start All Servers
# This script will start all required servers for the application

Write-Host "🌽 CORNMAN Strategic HQ - Starting All Servers..." -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Yellow

# Function to start a server in background
function Start-ServerInBackground {
    param($ServerName, $Command, $WorkingDirectory = ".")
    
    Write-Host "🚀 Starting $ServerName..." -ForegroundColor Cyan
    
    try {
        $job = Start-Job -ScriptBlock {
            param($cmd, $dir)
            Set-Location $dir
            Invoke-Expression $cmd
        } -ArgumentList $Command, $WorkingDirectory
        
        Write-Host "✅ $ServerName started (Job ID: $($job.Id))" -ForegroundColor Green
        return $job
    }
    catch {
        Write-Host "❌ Failed to start $ServerName`: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Array to store all jobs
$jobs = @()

Write-Host ""
Write-Host "🔥 Starting Development Servers..." -ForegroundColor Yellow

# 1. Start Main Vite Development Server
Write-Host ""
Write-Host "1️⃣ Starting Vite Development Server (Frontend)..." -ForegroundColor Magenta
$viteJob = Start-ServerInBackground "Vite Dev Server" "npm run dev"
if ($viteJob) { $jobs += $viteJob }

# 2. Start WhatsApp Bot Server
Write-Host ""
Write-Host "2️⃣ Starting WhatsApp Bot Server..." -ForegroundColor Magenta
$waJob = Start-ServerInBackground "WhatsApp Bot" "npm run wa:server"
if ($waJob) { $jobs += $waJob }

# 3. Start Twilio Webhook Server
Write-Host ""
Write-Host "3️⃣ Starting Twilio Webhook Server..." -ForegroundColor Magenta
$twilioJob = Start-ServerInBackground "Twilio Webhook" "node scripts/twilio-real-server.js"
if ($twilioJob) { $jobs += $twilioJob }

# 4. Start Local Webhook Server
Write-Host ""
Write-Host "4️⃣ Starting Local Webhook Server..." -ForegroundColor Magenta
$webhookJob = Start-ServerInBackground "Local Webhook" "node scripts/local-webhook-server.js"
if ($webhookJob) { $jobs += $webhookJob }

# Wait a moment for servers to initialize
Write-Host ""
Write-Host "⏳ Waiting for servers to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Display server status
Write-Host ""
Write-Host "📊 SERVER STATUS DASHBOARD" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Yellow

foreach ($job in $jobs) {
    if ($job.State -eq "Running") {
        Write-Host "✅ Job $($job.Id): RUNNING" -ForegroundColor Green
    } else {
        Write-Host "❌ Job $($job.Id): $($job.State)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🌐 SERVER URLS:" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Yellow
Write-Host "🎯 Frontend (Vite):           http://localhost:5173" -ForegroundColor White
Write-Host "📱 WhatsApp Bot:              Running in background" -ForegroundColor White
Write-Host "📞 Twilio Webhook:            http://localhost:3001" -ForegroundColor White
Write-Host "🔗 Local Webhook:             http://localhost:3000" -ForegroundColor White

Write-Host ""
Write-Host "🎮 MANAGEMENT COMMANDS:" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Yellow
Write-Host "📊 Check Status:              Get-Job" -ForegroundColor White
Write-Host "🛑 Stop All Servers:          Get-Job | Stop-Job" -ForegroundColor White
Write-Host "🗑️  Remove All Jobs:           Get-Job | Remove-Job" -ForegroundColor White
Write-Host "📄 View Server Logs:          Receive-Job -Id [JobID]" -ForegroundColor White

Write-Host ""
Write-Host "🚀 ALL SERVERS STARTED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Yellow
Write-Host "🌽 CORNMAN Strategic HQ is now ready for action!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 TIP: Keep this terminal open to manage servers" -ForegroundColor Cyan
Write-Host "💡 TIP: Open http://localhost:5173 in your browser" -ForegroundColor Cyan
Write-Host ""

# Keep script running and show periodic status
Write-Host "🔄 Monitoring servers... (Press Ctrl+C to stop)" -ForegroundColor Yellow

try {
    while ($true) {
        Start-Sleep -Seconds 30
        
        # Check job status periodically
        $runningJobs = (Get-Job | Where-Object { $_.State -eq "Running" }).Count
        $totalJobs = (Get-Job).Count
        
        $timestamp = Get-Date -Format "HH:mm:ss"
        Write-Host "[$timestamp] 📊 Status: $runningJobs/$totalJobs servers running" -ForegroundColor Green
    }
}
catch {
    Write-Host ""
    Write-Host "🛑 Stopping all servers..." -ForegroundColor Yellow
    Get-Job | Stop-Job
    Get-Job | Remove-Job
    Write-Host "✅ All servers stopped." -ForegroundColor Green
}
