# ClimeAI Frontend Deployment Script for Windows PowerShell

Write-Host "🚀 ClimeAI Frontend Deployment Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the frontend directory" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Building the project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n📋 Next steps for deployment:" -ForegroundColor Cyan
Write-Host "1. Push to GitHub:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'feat: ready for deployment'" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray

Write-Host "`n2. Deploy on Vercel:" -ForegroundColor White
Write-Host "   - Go to https://vercel.com" -ForegroundColor Gray
Write-Host "   - Import your GitHub repository" -ForegroundColor Gray
Write-Host "   - Set root directory to 'frontend'" -ForegroundColor Gray
Write-Host "   - Add environment variable: VITE_API_BASE_URL" -ForegroundColor Gray

Write-Host "`n3. Environment Variable:" -ForegroundColor White
Write-Host "   VITE_API_BASE_URL=https://your-backend-domain.com/api" -ForegroundColor Gray

Write-Host "`n🎉 Your frontend is ready for deployment!" -ForegroundColor Green
