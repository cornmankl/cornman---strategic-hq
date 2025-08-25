# Project Reorganization Script
# This script will reorganize the project structure

Write-Host "🚀 Starting Project Reorganization..." -ForegroundColor Green

# Create necessary directories
$directories = @(
    "src\contexts",
    "src\hooks", 
    "src\services",
    "src\types",
    "src\utils",
    "docs\setup",
    "docs\architecture", 
    "docs\api",
    "docs\deployment",
    "tests",
    "scripts"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
        Write-Host "✅ Created directory: $dir" -ForegroundColor Green
    }
}

# Move source code files
Write-Host "📁 Moving source code files..." -ForegroundColor Yellow

# Move contexts (already done, but let's verify)
if (Test-Path "contexts") {
    Copy-Item -Path "contexts\*" -Destination "src\contexts\" -Recurse -Force
    Write-Host "✅ Moved contexts to src\contexts\" -ForegroundColor Green
}

# Move hooks
if (Test-Path "hooks") {
    Copy-Item -Path "hooks\*" -Destination "src\hooks\" -Recurse -Force
    Write-Host "✅ Moved hooks to src\hooks\" -ForegroundColor Green
}

# Move services
if (Test-Path "services") {
    Copy-Item -Path "services\*" -Destination "src\services\" -Recurse -Force
    Write-Host "✅ Moved services to src\services\" -ForegroundColor Green
}

# Move types
if (Test-Path "types") {
    Copy-Item -Path "types\*" -Destination "src\types\" -Recurse -Force
    Write-Host "✅ Moved types to src\types\" -ForegroundColor Green
}

# Move utils
if (Test-Path "utils") {
    Copy-Item -Path "utils\*" -Destination "src\utils\" -Recurse -Force
    Write-Host "✅ Moved utils to src\utils\" -ForegroundColor Green
}

# Move documentation files
Write-Host "📚 Moving documentation files..." -ForegroundColor Yellow

# Setup documentation
$setupDocs = @(
    "SETUP_COMPLETE.md",
    "SUPABASE_SETUP.md", 
    "TWILIO_INTEGRATION_GUIDE.md",
    "WHATSAPP_SETUP_STATUS.md",
    "whatsapp-sandbox-setup.md"
)

foreach ($doc in $setupDocs) {
    if (Test-Path $doc) {
        Move-Item -Path $doc -Destination "docs\setup\" -Force
        Write-Host "✅ Moved $doc to docs\setup\" -ForegroundColor Green
    }
}

# Architecture documentation
$archDocs = @(
    "ARCHITECTURE_IMPROVEMENTS.md",
    "CODE_QUALITY_IMPROVEMENTS.md",
    "DESIGN-SYSTEM.md",
    "PERFORMANCE_IMPROVEMENTS.md",
    "UX-AUDIT-REPORT.md",
    "UX_IMMEDIATE_FIXES.md"
)

foreach ($doc in $archDocs) {
    if (Test-Path $doc) {
        Move-Item -Path $doc -Destination "docs\architecture\" -Force
        Write-Host "✅ Moved $doc to docs\architecture\" -ForegroundColor Green
    }
}

# API documentation
$apiDocs = @(
    "GEMINI.md",
    "QWEN.md",
    "VIRAL_SYSTEM_README.md",
    "WHATSAPP_BOT_REVIEW.md",
    "WHATSAPP_BUSINESS_PLATFORM.md"
)

foreach ($doc in $apiDocs) {
    if (Test-Path $doc) {
        Move-Item -Path $doc -Destination "docs\api\" -ForegroundColor Green
        Write-Host "✅ Moved $doc to docs\api\" -ForegroundColor Green
    }
}

# Move configuration files
Write-Host "⚙️ Moving configuration files..." -ForegroundColor Yellow

$configFiles = @(
    "twilio.config.ts",
    "firebase.json",
    "firestore.rules",
    ".firebaserc"
)

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Copy-Item -Path $file -Destination "config\" -Force
        Write-Host "✅ Copied $file to config\" -ForegroundColor Green
    }
}

# Move test files
Write-Host "🧪 Moving test files..." -ForegroundColor Yellow

$testFiles = @(
    "test-*.js",
    "test-*.html",
    "vitest.config.ts"
)

foreach ($pattern in $testFiles) {
    Get-ChildItem -Path "." -Filter $pattern | ForEach-Object {
        Copy-Item -Path $_.FullName -Destination "tests\" -Force
        Write-Host "✅ Copied $($_.Name) to tests\" -ForegroundColor Green
    }
}

# Move script files
Write-Host "📜 Moving script files..." -ForegroundColor Yellow

$scriptFiles = @(
    "*.bat",
    "start-server.ps1",
    "local-webhook-server.js",
    "twilio-*.js"
)

foreach ($pattern in $scriptFiles) {
    Get-ChildItem -Path "." -Filter $pattern | ForEach-Object {
        Copy-Item -Path $_.FullName -Destination "scripts\" -Force
        Write-Host "✅ Copied $($_.Name) to scripts\" -ForegroundColor Green
    }
}

# Move other documentation
Write-Host "📖 Moving other documentation..." -ForegroundColor Yellow

$otherDocs = @(
    "FINAL-WHATSAPP-SETUP.md",
    "MASTER_IMPROVEMENT_PLAN.md",
    "IMPROVEMENT_SUMMARY.md",
    "IMPROVEMENTS_IMPLEMENTED.md",
    "IMPLEMENTATION-ROADMAP.md",
    "PHASE-*.md"
)

foreach ($pattern in $otherDocs) {
    Get-ChildItem -Path "." -Filter $pattern | ForEach-Object {
        Copy-Item -Path $_.FullName -Destination "docs\deployment\" -Force
        Write-Host "✅ Copied $($_.Name) to docs\deployment\" -ForegroundColor Green
    }
}

Write-Host "🎉 Project reorganization completed!" -ForegroundColor Green
Write-Host "📋 Please review the new structure and update import paths as needed." -ForegroundColor Yellow
