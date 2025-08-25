# Fix Import Paths Script
# This script will update all import paths after reorganization

Write-Host "🔧 Fixing Import Paths..." -ForegroundColor Yellow

# Function to fix imports in a file
function Fix-ImportsInFile {
    param($filePath)
    
    $content = Get-Content $filePath -Raw
    $originalContent = $content
    
    # Fix component imports
    $content = $content -replace 'from ''\./components/', 'from ''./src/components/'
    $content = $content -replace 'from ''\./contexts/', 'from ''./src/contexts/'
    $content = $content -replace 'from ''\./hooks/', 'from ''./src/hooks/'
    $content = $content -replace 'from ''\./services/', 'from ''./src/services/'
    $content = $content -replace 'from ''\./types/', 'from ''./src/types/'
    $content = $content -replace 'from ''\./utils/', 'from ''./src/utils/'
    
    # Fix relative imports from src
    $content = $content -replace 'from ''\./src/components/', 'from ''./src/components/'
    $content = $content -replace 'from ''\./src/contexts/', 'from ''./src/contexts/'
    $content = $content -replace 'from ''\./src/hooks/', 'from ''./src/hooks/'
    $content = $content -replace 'from ''\./src/services/', 'from ''./src/services/'
    $content = $content -replace 'from ''\./src/types/', 'from ''./src/types/'
    $content = $content -replace 'from ''\./src/utils/', 'from ''./src/utils/'
    
    # Fix constants and other imports
    $content = $content -replace 'from ''\./constants', 'from ''./src/constants'
    
    # Only write if content changed
    if ($content -ne $originalContent) {
        Set-Content -Path $filePath -Value $content -NoNewline
        Write-Host "✅ Fixed imports in: $filePath" -ForegroundColor Green
        return $true
    }
    
    return $false
}

# Files to fix
$filesToFix = @(
    "App.tsx",
    "index.tsx",
    "src/App.tsx",
    "src/index.tsx"
)

$totalFixed = 0

foreach ($file in $filesToFix) {
    if (Test-Path $file) {
        if (Fix-ImportsInFile $file) {
            $totalFixed++
        }
    }
}

# Also fix all TypeScript/React files in src directory
Write-Host "🔍 Scanning src directory for files to fix..." -ForegroundColor Yellow

Get-ChildItem -Path "src" -Recurse -Include "*.ts", "*.tsx" | ForEach-Object {
    if (Fix-ImportsInFile $_.FullName) {
        $totalFixed++
    }
}

Write-Host "🎉 Import path fixing completed!" -ForegroundColor Green
Write-Host "📊 Total files fixed: $totalFixed" -ForegroundColor Cyan
Write-Host "📋 Next: Try building the project again" -ForegroundColor Yellow
