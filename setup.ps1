# Ani2Table Setup Script for Windows
# Run this script in PowerShell to set up the project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Ani2Table Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param($command)
    try {
        if (Get-Command $command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
}

# Check Node.js
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
if (Test-Command node) {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js is not installed. Please install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check npm
if (Test-Command npm) {
    $npmVersion = npm --version
    Write-Host "✓ npm is installed: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "✗ npm is not installed." -ForegroundColor Red
    exit 1
}

# Check MySQL
if (Test-Command mysql) {
    Write-Host "✓ MySQL is installed" -ForegroundColor Green
} else {
    Write-Host "⚠ MySQL not found in PATH. Make sure MySQL is installed." -ForegroundColor Yellow
    Write-Host "  Download from: https://dev.mysql.com/downloads/mysql/" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow

# Install frontend dependencies
Write-Host "→ Installing frontend dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

# Install backend dependencies
Write-Host "→ Installing backend dependencies..." -ForegroundColor Cyan
Set-Location server
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Set up MySQL database:" -ForegroundColor White
Write-Host "   mysql -u root -p < server/config/database.sql" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Configure database credentials:" -ForegroundColor White
Write-Host "   Edit server/.env and add your MySQL password" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Generate demo account passwords:" -ForegroundColor White
Write-Host "   cd server" -ForegroundColor Gray
Write-Host "   node scripts/hashPassword.js" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Start the application:" -ForegroundColor White
Write-Host "   npm run start:dev" -ForegroundColor Gray
Write-Host ""
Write-Host "For detailed instructions, see:" -ForegroundColor Yellow
Write-Host "- SETUP_GUIDE.md (Quick start)" -ForegroundColor Cyan
Write-Host "- DATABASE_README.md (Full documentation)" -ForegroundColor Cyan
Write-Host "- IMPLEMENTATION_SUMMARY.md (What was implemented)" -ForegroundColor Cyan
Write-Host ""
