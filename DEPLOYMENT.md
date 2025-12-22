# Deploying hiiiiiiiiiii.com to Production

## Option 1: Vercel (Recommended - Easiest for Next.js)

### Steps:

1. **Push to GitHub:**
   ```bash
   # Create a new repo on GitHub (github.com/new)
   # Then run:
   git remote add origin https://github.com/YOUR_USERNAME/hiiiiiiiiiii.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Click "Deploy"

3. **Custom Domain Setup:**
   - In Vercel dashboard, go to your project → Settings → Domains
   - Add `hiiiiiiiiiii.com` and `www.hiiiiiiiiiii.com`
   - Vercel will give you DNS records to add to your domain registrar
   - Add these DNS records where you bought the domain
   - Wait for DNS propagation (usually 5-30 minutes)

### Vercel Auto-Deploys:
- Every push to `main` branch = automatic deployment
- Preview deployments for pull requests

---

## Option 2: Netlify

1. **Push to GitHub** (same as above)

2. **Deploy on Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login with GitHub
   - Click "Add new site" → "Import an existing project"
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy site"

3. **Custom Domain:**
   - Site settings → Domain management
   - Add custom domain: `hiiiiiiiiiii.com`
   - Follow DNS instructions

---

## Option 3: Manual Build & Deploy

If you have your own server:

```bash
# Build the production version
npm run build

# Start the production server
npm start
```

Or use PM2:
```bash
npm install -g pm2
pm2 start npm --name "hiiiiiiiiiii" -- start
```

---

## Quick Vercel CLI Deploy (Fastest)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (from project directory)
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: hiiiiiiiiiii
# - Directory: ./
# - Override settings? No

# For production:
vercel --prod
```

---

## Environment Variables (if needed later)

If you add any API keys or secrets:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables

---

## Notes:

- ✅ Your `.gitignore` already excludes `node_modules` and `.next`
- ✅ Next.js is optimized for production builds
- ✅ The game uses localStorage (works in production)
- ✅ All fonts are loaded from Google Fonts (no local files needed)

