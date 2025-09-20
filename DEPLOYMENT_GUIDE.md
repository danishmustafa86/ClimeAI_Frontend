# Frontend Deployment Guide for Vercel

## ✅ Pre-deployment Checklist

Your frontend is ready for deployment! Here's what's been configured:

- ✅ Environment variables setup (`VITE_API_BASE_URL`)
- ✅ Audio playback fixes implemented
- ✅ Build configuration ready
- ✅ All dependencies properly configured

## 🚀 Step-by-Step Deployment Process

### 1. Push to GitHub

```bash
# Navigate to your frontend directory
cd frontend

# Add all changes
git add .

# Commit changes
git commit -m "feat: fix audio playback and add environment variable support"

# Push to GitHub
git push origin main
```

### 2. Deploy on Vercel

#### Option A: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Select the `frontend` folder as the root directory
6. Configure environment variables (see below)
7. Click "Deploy"

#### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: climeai-frontend (or your preferred name)
# - Directory: ./
# - Override settings? N
```

### 3. Configure Environment Variables

In your Vercel dashboard or via CLI:

```bash
# Set environment variable
vercel env add VITE_API_BASE_URL
# Enter: https://your-backend-domain.com/api
```

**Important**: Replace `your-backend-domain.com` with your actual deployed backend URL.

### 4. Build Configuration

Vercel will automatically detect this is a Vite project and use the correct build settings:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 🔧 Environment Variables

### Required for Production
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

### For Local Development
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/     # UI components
│   ├── pages/         # Page components
│   ├── utils/         # API utilities
│   └── ...
├── public/            # Static assets
├── package.json       # Dependencies
├── vite.config.ts     # Vite configuration
└── ENVIRONMENT_VARIABLES.md  # Environment setup guide
```

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails**: Check that all dependencies are in `package.json`
2. **Environment Variables Not Working**: Ensure they start with `VITE_`
3. **API Calls Failing**: Verify `VITE_API_BASE_URL` is set correctly
4. **Audio Not Playing**: Check that backend is deployed and accessible

### Debug Commands:

```bash
# Test build locally
npm run build

# Preview production build
npm run preview

# Check environment variables
echo $VITE_API_BASE_URL
```

## 🔄 Continuous Deployment

Once set up, Vercel will automatically deploy when you push to your main branch:

1. Push changes to GitHub
2. Vercel detects changes
3. Automatically builds and deploys
4. Your app is live!

## 📞 Support

If you encounter any issues:
1. Check Vercel deployment logs
2. Verify environment variables are set
3. Ensure backend is running and accessible
4. Check browser console for errors

Your frontend is now ready for production deployment! 🎉
