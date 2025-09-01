# 🚀 Vercel Deployment Checklist

Follow these steps to deploy CORNMAN Strategic HQ to Vercel:

## Prerequisites ✅

- [ ] Node.js 18+ installed
- [ ] GitHub repository access
- [ ] Vercel account (free tier available)

## Deployment Steps 🔧

### 1. **Prepare Your Environment**
- [ ] Verify the project builds locally: `npm run build`
- [ ] Ensure all required environment variables are ready

### 2. **Connect to Vercel**
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login to Vercel: `vercel login`
- [ ] Link your repository: `vercel link` (or deploy directly with `vercel`)

### 3. **Configure Environment Variables**
In your Vercel dashboard, add these environment variables:

**Required for Basic Functionality:**
- [ ] `VITE_GEMINI_API_KEY` - Your Google Gemini API key
- [ ] `VITE_SUPABASE_URL` - Your Supabase project URL  
- [ ] `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

**Optional (Twilio Integration):**
- [ ] `VITE_TWILIO_ENVIRONMENT` - Set to `test` or `live`
- [ ] `VITE_TWILIO_WHATSAPP_NUMBER` - Twilio WhatsApp number
- [ ] `VITE_TWILIO_TEST_ACCOUNT_SID` - Test account SID
- [ ] `VITE_TWILIO_TEST_AUTH_TOKEN` - Test auth token

**Optional (Firebase Integration):**
- [ ] `VITE_FIREBASE_API_KEY`
- [ ] `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] `VITE_FIREBASE_PROJECT_ID`
- [ ] `VITE_FIREBASE_STORAGE_BUCKET`
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `VITE_FIREBASE_APP_ID`

### 4. **Deploy**
- [ ] Run: `vercel --prod`
- [ ] Verify deployment URL is accessible
- [ ] Test key functionality on the deployed site

### 5. **Set Up Automatic Deployments** (Recommended)
- [ ] Connect your GitHub repository in Vercel dashboard
- [ ] Enable automatic deployments on push to main branch
- [ ] Test that auto-deployment works with a small commit

## Configuration Files 📁

The following files are automatically configured for Vercel:

- ✅ `vercel.json` - Deployment configuration with SPA routing
- ✅ `vite.config.ts` - Build configuration optimized for Vercel
- ✅ `.vercelignore` - Excludes unnecessary files from deployment
- ✅ `.gitignore` - Prevents build artifacts from being committed

## Troubleshooting 🔧

**Build Fails:**
- Ensure all dependencies are installed: `npm install`
- Check that the build works locally: `npm run build`
- Verify environment variables are properly set

**App Doesn't Load:**
- Check browser console for errors
- Verify environment variables are set in Vercel dashboard
- Ensure the deployment domain is accessible

**Routing Issues:**
- The `vercel.json` handles SPA routing automatically
- All routes should redirect to `index.html`

## Demo Mode 🎮

The app includes a demo mode that works without any external services:
- If Supabase isn't configured, it automatically uses local storage
- AI features gracefully degrade if API keys aren't provided
- The app remains functional for testing and development

## Support 💬

- Check the [main README.md](./README.md) for detailed project information
- Review Vercel deployment logs in your dashboard
- Ensure your plan supports the required features (static site hosting)

---

🎉 **Deployment Complete!** Your CORNMAN Strategic HQ should now be live on Vercel.