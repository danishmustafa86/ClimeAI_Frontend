#!/bin/bash

# ClimeAI Frontend Deployment Script

echo "🚀 ClimeAI Frontend Deployment Script"
echo "====================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the frontend directory"
    exit 1
fi

echo "📦 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "📋 Next steps for deployment:"
echo "1. Push to GitHub:"
echo "   git add ."
echo "   git commit -m 'feat: ready for deployment'"
echo "   git push origin main"

echo ""
echo "2. Deploy on Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repository"
echo "   - Set root directory to 'frontend'"
echo "   - Add environment variable: VITE_API_BASE_URL"

echo ""
echo "3. Environment Variable:"
echo "   VITE_API_BASE_URL=https://your-backend-domain.com/api"

echo ""
echo "🎉 Your frontend is ready for deployment!"
