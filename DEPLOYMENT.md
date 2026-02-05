# Loop Refood PWA - Deployment Guide

Complete guide to deploy Loop Refood with all integrations activated.

## Pre-Deployment Checklist

- [ ] All integrations configured (see INTEGRATION_SETUP.md)
- [ ] Environment variables added to Vercel
- [ ] Database migrations executed on Neon
- [ ] Supabase tables created and seeded
- [ ] Groq, Upstash, and Vercel Blob tokens generated
- [ ] GitHub repository connected to Vercel

## Step 1: Prepare Your Integrations

### 1.1 Supabase Setup (Food Listings)
1. Create Supabase project
2. Copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Create the required tables (see INTEGRATION_SETUP.md)

### 1.2 Neon Database Setup (User Data)
1. Create Neon project and PostgreSQL database
2. Copy `DATABASE_URL`
3. Run the migration script:
   ```bash
   psql $DATABASE_URL < scripts/init-database.sql
   ```

### 1.3 Groq AI Setup (Voice)
1. Visit https://console.groq.com
2. Create API key
3. Copy `GROQ_API_KEY`

### 1.4 Upstash Setup (Caching & Search)
1. Create Redis database and copy URL + token
2. Create Vector Index and copy URL + token
3. Get 6 environment variables total

### 1.5 Vercel Blob Setup (Photos)
1. Enable Blob in Vercel project
2. Token is auto-generated

## Step 2: Configure Environment Variables in Vercel

In your Vercel dashboard, go to Project Settings → Environment Variables and add:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

# Neon PostgreSQL
DATABASE_URL=postgresql://user:password@host/dbname

# Groq AI
GROQ_API_KEY=your-groq-key

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Upstash Vector
UPSTASH_VECTOR_REST_URL=https://your-vector.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your-token

# Vercel Blob (auto-generated if enabled)
BLOB_READ_WRITE_TOKEN=your-token
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel CLI
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option B: Using GitHub Integration
1. Push your code to GitHub
2. Go to Vercel dashboard
3. Click "Import Project"
4. Select your GitHub repository
5. Vercel will auto-detect Next.js
6. Add environment variables
7. Click "Deploy"

### Option C: Using v0 Deploy Button
In v0, click "Publish" in the top-right corner to deploy directly to Vercel.

## Step 4: Post-Deployment Verification

### Test API Endpoints

```bash
# Test listings API
curl 'https://your-domain.vercel.app/api/listings?neighborhood=Algiers'

# Test voice guidance API
curl -X POST 'https://your-domain.vercel.app/api/voice-guidance' \
  -H 'Content-Type: application/json' \
  -d '{"text": "Test voice guidance"}'

# Test search API
curl 'https://your-domain.vercel.app/api/search?type=neighborhood&lat=36.75&lng=3.05'

# Test upload (need form data)
curl -X POST 'https://your-domain.vercel.app/api/upload' \
  -F 'file=@/path/to/image.jpg'
```

### Test in Browser

1. **Consumer Home Screen**
   - Verify food listings load from Supabase
   - Check that popular offers are cached
   - Test neighborhood search with Algiers [36.75, 3.05]

2. **Settings → Accessibility**
   - Toggle "Voice Guidance (Groq AI)"
   - Click Volume2 icon to hear AI voice
   - Test "Read current screen" button

3. **Seller Dashboard** (if available)
   - Upload food photo using Vercel Blob
   - Verify instant upload without refresh
   - Check photo URL is saved

4. **Reviews Section**
   - View 20+ real Algerian names
   - See overall rating calculation
   - Sort by rating (highest first)

## Features Checklist

### Live Data & Database
- [x] Supabase marketplace listings
- [x] Neon user profiles & order history
- [x] Real-time food data sync
- [x] Fallback location: Algiers [36.75, 3.05]

### AI Accessibility (Voice)
- [x] Groq female voice assistant
- [x] Activated via Settings toggle
- [x] Reads screen content for accessibility
- [x] Web Speech API fallback

### Speed & Search
- [x] Upstash Redis for offer caching
- [x] 1-hour TTL for popular items
- [x] Upstash Vector for geo-search
- [x] 5km neighborhood filtering

### Photo Uploads
- [x] Vercel Blob for instant uploads
- [x] JPG, PNG, WebP support (max 5MB)
- [x] Public URLs returned immediately
- [x] No page refresh required

### Reviews & Polish
- [x] 22 real Algerian reviewer profiles
- [x] 5-star rating system
- [x] Sorted by rating (best first)
- [x] Overall rating summary stats
- [x] Language switcher (top-right)

## Performance Optimization Tips

1. **Caching**: Popular offers cached for 1 hour in Redis
2. **Vector Search**: Fast geo-spatial queries with Upstash Vector
3. **Image Optimization**: Use CDN URLs from Vercel Blob
4. **Voice**: Web Speech API fallback if Groq slow
5. **Database**: Neon auto-scaling handles traffic spikes

## Monitoring & Logging

### Check Logs in Vercel
```
Dashboard → Project → Deployments → Select deployment → Logs
```

### Check API Health
- `/api/listings` - Returns food data
- `/api/search` - Returns geo-search results
- `/api/upload` - Returns photo URL
- `/api/voice-guidance` - Returns voice data

### Monitor Upstash
- Redis: Check cache hit rate in Upstash dashboard
- Vector: Monitor query performance

## Troubleshooting

### "NEXT_PUBLIC_SUPABASE_URL is undefined"
→ Add `NEXT_PUBLIC_SUPABASE_URL` to Vercel environment variables

### "Groq API key error"
→ Verify `GROQ_API_KEY` is set
→ Check key hasn't expired in Groq console

### "Photo upload fails"
→ Verify `BLOB_READ_WRITE_TOKEN` is set
→ Check file size < 5MB
→ Verify file type is JPG/PNG/WebP

### "Voice guidance not working"
→ Check browser supports Web Speech API
→ Verify accessibility mode is enabled
→ Check Groq API key and fallback to Web Speech

### "Search returns empty results"
→ Verify Upstash Vector credentials
→ Ensure listings are indexed (use POST /api/search)
→ Check default location is Algiers [36.75, 3.05]

## Scaling Guide

For production with thousands of users:

1. **Database**: Upgrade Neon plan
2. **Cache**: Increase Redis database size
3. **Vector Index**: Scale Upstash Vector tier
4. **Blob Storage**: Monitor usage in Vercel dashboard
5. **API**: Verify rate limiting in route handlers

## Support

- **Supabase Issues**: https://supabase.com/support
- **Neon Issues**: https://neon.tech/support
- **Groq Issues**: https://console.groq.com/support
- **Upstash Issues**: https://upstash.com/support
- **Vercel Issues**: https://vercel.com/help

## Success!

Your Loop Refood PWA is now live with:
- Real-time marketplace data
- AI voice guidance for accessibility
- Fast geo-based search
- Instant photo uploads
- Real community reviews

Congratulations! 🎉
