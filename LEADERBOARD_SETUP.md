# Shared Leaderboard Setup with Vercel KV (via Upstash)

## ✅ Implementation Complete!

The leaderboard now uses **Vercel KV** (Redis via Upstash) for persistent, shared storage. All users will see the same leaderboard across all devices and browsers.

## Setup Instructions

### Step 1: Create KV Database via Marketplace

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project
3. Go to **Storage** tab (left sidebar)
4. You'll see "KV and Postgres are now available through the Marketplace"
5. Scroll down to **"Marketplace Database Providers"** section
6. Click on **"Upstash"** (it says "Serverless DB (Redis, Vector, Queue, Search)")
7. Click **"Continue"** (or select Upstash if prompted)
8. Follow the prompts to create your Upstash Redis database
9. Select **Redis** as the database type
10. Choose a name (e.g., `hiiiiiiiiiii-kv`)
11. Select a region closest to your users
12. Complete the setup

### Step 2: Environment Variables

After creating the Upstash Redis database:

1. Vercel will automatically add environment variables to your project:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN` (optional)
   
2. These will be available after you redeploy or on the next deployment

### Step 3: Deploy

That's it! The code is already set up. Just:

```bash
git add .
git commit -m "Add Vercel KV for persistent leaderboard"
git push
```

Vercel will automatically:
- Detect the environment variables
- Connect to your KV database
- Make the leaderboard persistent

## How It Works

- **GET `/api/leaderboard`**: Fetches top 10 scores from KV
- **POST `/api/leaderboard`**: Saves new score and returns updated top 10
- **Fallback**: If KV isn't configured, returns empty leaderboard (graceful degradation)

## Alternative: Use Upstash Directly

If you prefer to set up Upstash manually:

1. Go to [upstash.com](https://upstash.com)
2. Create free account
3. Create a Redis database
4. Copy the REST API URL and Token
5. Add to Vercel: Project Settings → Environment Variables
   - `KV_REST_API_URL` = your REST API URL
   - `KV_REST_API_TOKEN` = your token

## Testing Locally

For local development:

1. **Option A**: Use Vercel CLI to pull env vars:
   ```bash
   vercel env pull .env.local
   ```

2. **Option B**: Manually add to `.env.local`:
   ```env
   KV_REST_API_URL=your_url_here
   KV_REST_API_TOKEN=your_token_here
   ```

3. **Option C**: Test without KV (it will work but use empty leaderboard - graceful fallback)

## Pricing

- **Upstash Free Tier** (via Vercel Marketplace): 
  - 10,000 commands/day
  - 256 MB storage
  - Perfect for a leaderboard! 🎮
  
  Or use Upstash directly with their free tier:
  - 10,000 commands/day
  - 256 MB storage

## Features

✅ Persistent storage (survives server restarts)
✅ Shared across all users
✅ Top 10 leaderboard
✅ Automatic sorting by score
✅ Graceful fallback if KV isn't configured

The leaderboard is now production-ready! 🚀
