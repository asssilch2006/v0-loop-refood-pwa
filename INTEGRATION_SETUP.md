# Loop Refood PWA - Integration Setup Guide

This guide walks you through setting up all 5 critical integrations for the Loop Refood application.

## 1. Supabase - Real-time Food Listings Database

### Purpose
Stores and streams real-time food listings from marketplace sellers in Algiers.

### Setup Steps
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key
3. Create a new table called `food_listings` with this schema:
   ```sql
   CREATE TABLE food_listings (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     seller_id UUID REFERENCES user_profiles(id),
     seller_name TEXT NOT NULL,
     seller_location TEXT,
     image_url TEXT,
     original_price DECIMAL,
     loop_price DECIMAL,
     category TEXT CHECK (category IN ('fastfood', 'coffee', 'sweets', 'bread', 'animal')),
     expires_at TIMESTAMP,
     distance_km DECIMAL,
     latitude DECIMAL,
     longitude DECIMAL,
     rating DECIMAL,
     reviews_count INT DEFAULT 0,
     neighborhood TEXT DEFAULT 'Algiers',
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

4. Create `user_profiles` table:
   ```sql
   CREATE TABLE user_profiles (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     email TEXT UNIQUE NOT NULL,
     name TEXT NOT NULL,
     role TEXT CHECK (role IN ('consumer', 'seller')),
     location TEXT DEFAULT 'Algiers',
     avatar_url TEXT,
     business_name TEXT,
     business_type TEXT,
     phone TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

5. Add these environment variables to Vercel:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

## 2. Neon - PostgreSQL for User Profiles & Order History

### Purpose
Stores user profiles, authentication data, and complete order history.

### Setup Steps
1. Go to [neon.tech](https://neon.tech) and create a project
2. Copy your connection string
3. Create tables for orders:
   ```sql
   CREATE TABLE orders (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES user_profiles(id),
     listing_id UUID REFERENCES food_listings(id),
     status TEXT DEFAULT 'pending',
     quantity INT DEFAULT 1,
     total_price DECIMAL,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

4. Add to Vercel environment variables:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/database
   ```

## 3. Groq - AI Voice Guidance for Accessibility

### Purpose
Provides female AI voice guidance for visually impaired users. Reads screen content when accessibility is enabled.

### Setup Steps
1. Visit [console.groq.com](https://console.groq.com) and sign up
2. Create an API key
3. Add to Vercel environment:
   ```
   GROQ_API_KEY=your-groq-api-key
   ```

### How It Works
- When "Voice Guidance" is toggled in Settings, the Groq AI activates
- Uses Mixtral 8x7b model for natural speech synthesis
- Falls back to Web Speech API if Groq is unavailable
- Provides descriptions of marketplace sections and food items

## 4. Upstash Redis - Caching Popular Offers

### Purpose
Caches the most popular food offers for instant loading (1-hour TTL).

### Setup Steps
1. Go to [upstash.com](https://upstash.com) and create a Redis database
2. Copy your REST URL and token
3. Add to Vercel environment:
   ```
   UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-redis-token
   ```

### Usage
- Automatically caches top 20 offers by rating
- Refreshes every hour or when new listings are added
- Serves cached data for faster initial page load

## 5. Upstash Vector (Search) - Neighborhood-Based Filtering

### Purpose
Enables fast geographic search to find food items near you in Algiers neighborhoods.

### Setup Steps
1. In Upstash console, create a Vector Index
2. Dimension: 2 (for latitude/longitude coordinates)
3. Copy URL and token
4. Add to Vercel environment:
   ```
   UPSTASH_VECTOR_REST_URL=https://your-vector-url.upstash.io
   UPSTASH_VECTOR_REST_TOKEN=your-vector-token
   ```

### How It Works
- Each listing is indexed with its coordinates
- Users search by their location (default: Algiers [36.75, 3.05])
- Returns items within 5km radius
- Supports filter by neighborhood name

## 6. Vercel Blob - Instant Photo Uploads

### Purpose
Enables instant uploads of food item photos without page refresh.

### Setup Steps
1. Enable Blob in your Vercel project settings
2. The token is automatically available
3. Add to Vercel environment:
   ```
   BLOB_READ_WRITE_TOKEN=your-blob-token
   ```

### Usage
- Upload food photos from seller dashboard
- Supports JPG, PNG, WebP (max 5MB)
- Returns instant public URL
- Photos auto-cached for fast loading

## Testing the Integrations

After setting up all environment variables:

1. **Listings API**: `GET /api/listings?neighborhood=Algiers`
2. **Voice Guidance**: Toggle "Voice Guidance" in Settings
3. **Cache Test**: First load should use cache if available
4. **Photo Upload**: Try uploading a test image from seller dashboard
5. **Search**: Filter by neighborhood name

## Default Location Fallback

If user location is not set, defaults to:
- **Coordinates**: Algiers [36.75, 3.05]
- **Neighborhood**: "Algiers"

## Environment Variables Summary

```
# Supabase (Food Listings)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Neon (User Data)
DATABASE_URL=

# Groq (Voice AI)
GROQ_API_KEY=

# Upstash Redis (Caching)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Upstash Vector (Search)
UPSTASH_VECTOR_REST_URL=
UPSTASH_VECTOR_REST_TOKEN=

# Vercel Blob (Photos)
BLOB_READ_WRITE_TOKEN=
```

All integrations are now configured! Deploy to Vercel and enjoy real-time food marketplace with AI voice guidance.
