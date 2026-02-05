# Loop Refood Professional PWA - Quick Start Checklist

## Pre-Deployment Setup

### 1. Integration Credentials (15 minutes)

- [ ] **Supabase**
  - [ ] Create Supabase project at supabase.com
  - [ ] Copy `NEXT_PUBLIC_SUPABASE_URL` 
  - [ ] Copy `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] Add to Vercel environment variables

- [ ] **Groq API**
  - [ ] Get API key from console.groq.com
  - [ ] Add `GROQ_API_KEY` to Vercel environment variables (server-side only)

- [ ] **Vercel Blob** (optional)
  - [ ] Enable in Vercel project settings
  - [ ] Copy `BLOB_READ_WRITE_TOKEN`
  - [ ] Add to environment variables

### 2. Database Setup (10 minutes)

In Supabase SQL Editor, run migrations:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  name TEXT,
  phone TEXT,
  location TEXT,
  role TEXT DEFAULT 'consumer',
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES users(id),
  title TEXT,
  description TEXT,
  category TEXT,
  price NUMERIC,
  location_lat FLOAT,
  location_lng FLOAT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES users(id),
  listing_id UUID REFERENCES listings(id),
  quantity INTEGER,
  total_price NUMERIC,
  status TEXT DEFAULT 'pending',
  delivery_address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_listings_active ON listings(is_active);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_listings_category ON listings(category);
```

### 3. Test Data (5 minutes)

Insert sample stores (optional):

```sql
INSERT INTO listings (seller_id, title, category, price, location_lat, location_lng, is_active, expires_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Chicken House - Bab El Oued', 'restaurant', 550, 36.7866, 3.0597, true, NOW() + INTERVAL '1 day'),
  ('00000000-0000-0000-0000-000000000002', 'Café Tantonville', 'cafe', 250, 36.7753, 3.0588, true, NOW() + INTERVAL '1 day'),
  ('00000000-0000-0000-0000-000000000003', 'Dry Bread for Livestock', 'animal_feed', 2000, 36.7234, 3.1345, true, NOW() + INTERVAL '2 days');
```

---

## Language System Verification

### Test All 3 Languages
- [ ] English (EN) - LTR
- [ ] French (FR) - LTR  
- [ ] Arabic (AR) - RTL

### Verify Translation Coverage
- [ ] Navigation menus
- [ ] Marketplace categories
- [ ] Order flow
- [ ] Voice guidance
- [ ] Settings labels
- [ ] Error messages

### RTL Testing (Arabic)
- [ ] Text alignment is right-aligned
- [ ] Sidebar opens from right
- [ ] Buttons respect RTL
- [ ] Input fields are RTL-aware
- [ ] Numbers display correctly

---

## Feature Testing

### Marketplace
- [ ] Homepage loads with Algiers center
- [ ] Browse listings by category
- [ ] Search functionality works
- [ ] Listings display prices & ratings

### Map
- [ ] Map loads interactive pins
- [ ] Click pin shows store details
- [ ] "Get Directions" opens Google Maps
- [ ] Phone button works
- [ ] Legend visible

### Order Flow
- [ ] Click item opens order modal
- [ ] Quantity selector works
- [ ] Address input accepts text
- [ ] Price calculation correct
- [ ] Submit creates order in Supabase
- [ ] Confirmation message appears

### Voice Assistant
- [ ] Settings > Accessibility > Voice Guidance toggle works
- [ ] Click voice button on homepage
- [ ] Groq API responds with guidance
- [ ] Response uses food waste knowledge
- [ ] Fallback to Web Speech API if needed

### Translations
- [ ] All UI changes language
- [ ] Groq responses change language
- [ ] RTL applies to Arabic
- [ ] Language selection persists

---

## Deployment

### Pre-Deploy
- [ ] All env vars set in Vercel
- [ ] Database tables created
- [ ] Groq API key verified
- [ ] No console errors in development

### Deploy to Vercel
```bash
git push origin main
```

### Post-Deploy
- [ ] Test live URL
- [ ] Check all 3 languages work
- [ ] Test order flow end-to-end
- [ ] Monitor Groq API usage
- [ ] Verify Supabase connections

---

## Monitoring & Maintenance

### Daily
- [ ] Check for order errors in Supabase
- [ ] Monitor Groq API usage
- [ ] Review user feedback

### Weekly
- [ ] Update listings with new stores
- [ ] Check analytics for popular categories
- [ ] Monitor performance metrics

### Monthly
- [ ] Analyze user behavior
- [ ] Update sustainability data
- [ ] Add new neighborhoods to map

---

## Troubleshooting

### "Voice guidance not working"
- [ ] Check GROQ_API_KEY is set
- [ ] Verify API key is valid
- [ ] Check API rate limits
- [ ] Fallback uses Web Speech API

### "Orders not saving"
- [ ] Verify Supabase credentials
- [ ] Check database tables exist
- [ ] Review error logs
- [ ] Ensure ANON_KEY has insert permissions

### "RTL not working for Arabic"
- [ ] Verify `app/rtl.css` imported
- [ ] Check `document.documentElement.dir = 'rtl'`
- [ ] Clear browser cache
- [ ] Test in incognito window

### "Map not showing locations"
- [ ] Verify coordinates in database
- [ ] Check Algiers center [36.75, 3.05]
- [ ] Test with sample data first

---

## Success Indicators

When these are working, you're production-ready:

- ✅ Users can place real orders
- ✅ All 3 languages fully translate UI
- ✅ Arabic displays RTL correctly
- ✅ Voice assistant generates responses
- ✅ Dry bread recycling category works
- ✅ Map shows stores & directions
- ✅ Orders appear in Supabase
- ✅ Performance < 2 second load times

---

## Key Files to Monitor

- `lib/i18n.ts` - Language/RTL system
- `app/api/voice-guidance/route.ts` - Groq integration
- `app/api/orders/route.ts` - Order creation
- `lib/services/database.ts` - Supabase operations
- `components/interactive-map.tsx` - Map functionality

---

## Support Resources

- Supabase Docs: https://supabase.com/docs
- Groq Console: https://console.groq.com
- Next.js Docs: https://nextjs.org/docs
- Vercel Deploy: https://vercel.com/docs/deployments

---

## Timeline Estimate

- Setup integrations: 15 minutes
- Create database: 10 minutes
- Test locally: 20 minutes
- Deploy: 5 minutes
- **Total**: ~50 minutes to production

**You're ready to serve Algerian users with a real circular food economy marketplace!**
