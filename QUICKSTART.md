# Loop Refood - Quick Start Guide

Get your integrated PWA running in 30 minutes.

## 5-Minute Setup

### Step 1: Get API Keys (10 mins)
1. **Supabase**: supabase.com → Create project → Copy URL & key
2. **Groq**: console.groq.com → Create key
3. **Upstash**: upstash.com → Create Redis + Vector → Copy tokens
4. **Vercel Blob**: Enabled automatically in Vercel project
5. **Neon**: neon.tech → Create database → Copy connection string

### Step 2: Add to Vercel (5 mins)
Go to Vercel project → Settings → Environment Variables

Paste these (replace with your actual values):
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
DATABASE_URL=postgresql://user:password@host/db
GROQ_API_KEY=your-groq-key
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
UPSTASH_VECTOR_REST_URL=https://your-vector.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your-vector-token
BLOB_READ_WRITE_TOKEN=vercel-blob-token
```

### Step 3: Deploy (5 mins)
```bash
git push origin main
# Or use Vercel CLI: vercel --prod
```

Done! 🎉

## Feature Quick Test

| Feature | Test | Expected |
|---------|------|----------|
| Food Listings | Load app | See restaurant offers |
| Voice | Settings → Voice Guidance → click Volume | Hear female AI voice |
| Search | Map tab | See Algiers map [36.75, 3.05] |
| Upload | Seller tab | Drag photo → instant URL |
| Reviews | Click "Reviews" | See 22 Algerian users |

## 30-Second Verification

```bash
# Test each API endpoint
curl https://your-domain/api/listings
curl https://your-domain/api/search?type=popular
curl -X POST https://your-domain/api/voice-guidance \
  -H 'Content-Type: application/json' \
  -d '{"text":"test"}'
```

All should return valid JSON.

## Common Issues & Fixes

### "NEXT_PUBLIC_SUPABASE_URL undefined"
→ Check env vars in Vercel → Redeploy

### "Groq API Error"
→ Verify GROQ_API_KEY in Vercel
→ Check key is active in Groq console

### "Vector search empty"
→ Need to index listings first
→ Use POST /api/search with action: 'index-listing'

### "Photo upload fails"
→ Check BLOB_READ_WRITE_TOKEN exists
→ File must be <5MB JPG/PNG/WebP

### "Voice not working"
→ Toggle accessibility mode OFF then ON
→ Check browser supports Web Speech API
→ Verify microphone/speaker permissions

## Next Steps

1. **Add Real Data**
   - Connect Supabase to your database
   - Populate food_listings table

2. **Setup Users**
   - Run `/scripts/init-database.sql` on Neon
   - Create test accounts

3. **Customize**
   - Change default location from Algiers
   - Modify review data
   - Update brand colors

4. **Go Live**
   - Promote to production
   - Setup domain
   - Monitor performance

## Documentation

- **Full Setup**: See `INTEGRATION_SETUP.md`
- **Deployment**: See `DEPLOYMENT.md`
- **All Features**: See `README.md`
- **Summary**: See `INTEGRATION_SUMMARY.md`

## Key Facts

✅ **6 Integrations**: Supabase, Neon, Groq, Upstash Redis, Upstash Vector, Vercel Blob
✅ **22 Reviews**: Real Algerian names & feedback
✅ **AI Voice**: Female voice reads content
✅ **Geo-Search**: 5km radius in Algiers
✅ **Instant Photos**: Upload without refresh
✅ **Real-Time**: Supabase live updates
✅ **Cached**: Popular offers in Redis
✅ **Accessible**: WCAG 2.1 AA compliant

## Environment Check

Before deploying, verify you have:
- [ ] Supabase tables created
- [ ] Neon database initialized
- [ ] All 6 env vars in Vercel
- [ ] GitHub repo connected (optional)
- [ ] Blob enabled in Vercel

## Support

If something doesn't work:
1. Check INTEGRATION_SETUP.md for that service
2. Verify all env vars are set
3. Check Vercel logs (Deployments → Logs)
4. Restart deployment

## That's It!

Your Loop Refood PWA is ready to transform food waste in Algiers.

**Next**: Configure integrations → Deploy → Test → Go Live

Good luck! 🚀
