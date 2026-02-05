-- Loop Refood PWA Database Initialization
-- Run this script on your Neon PostgreSQL database

-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT,
  role TEXT NOT NULL CHECK (role IN ('consumer', 'seller')),
  location TEXT DEFAULT 'Algiers',
  avatar_url TEXT,
  business_name TEXT,
  business_type TEXT,
  business_location TEXT,
  phone TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Food Listings Table
CREATE TABLE IF NOT EXISTS food_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  seller_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  seller_name TEXT NOT NULL,
  seller_location TEXT,
  image_url TEXT,
  original_price DECIMAL(10, 2) NOT NULL,
  loop_price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('fastfood', 'coffee', 'sweets', 'bread', 'animal')),
  subcategory TEXT,
  description TEXT,
  expires_at TIMESTAMP NOT NULL,
  distance_km DECIMAL(5, 2),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(10, 8),
  rating DECIMAL(3, 1) DEFAULT 4.5,
  reviews_count INT DEFAULT 0,
  neighborhood TEXT DEFAULT 'Algiers',
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES food_listings(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  quantity INT DEFAULT 1,
  original_price DECIMAL(10, 2),
  loop_price DECIMAL(10, 2),
  total_price DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  pickup_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reviews & Ratings Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES food_listings(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  location TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Sessions Table (for authentication)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_listings_seller ON food_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_category ON food_listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_neighborhood ON food_listings(neighborhood);
CREATE INDEX IF NOT EXISTS idx_listings_expires ON food_listings(expires_at);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_reviews_listing ON reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id);

-- Insert sample data for development/testing
INSERT INTO user_profiles (email, name, password_hash, role, location, business_name, business_type)
VALUES 
  ('seller@example.com', 'Ahmed Boudjemaï', '$2b$10$example', 'seller', 'Bab El Oued', 'Chicken House', 'restaurant'),
  ('consumer@example.com', 'Fatima Saidani', '$2b$10$example', 'consumer', 'Alger Centre', NULL, NULL)
ON CONFLICT (email) DO NOTHING;

-- Insert sample food listings
INSERT INTO food_listings (name, seller_id, seller_name, seller_location, image_url, original_price, loop_price, category, expires_at, distance_km, latitude, longitude, rating, neighborhood)
SELECT 
  'Mega Zinger Box',
  (SELECT id FROM user_profiles WHERE business_name = 'Chicken House' LIMIT 1),
  'Chicken House - Bab El Oued',
  'Bab El Oued',
  'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400',
  1400,
  550,
  'fastfood',
  NOW() + INTERVAL '2 hours',
  0.6,
  36.7866,
  3.0597,
  4.9,
  'Bab El Oued'
WHERE (SELECT id FROM user_profiles WHERE business_name = 'Chicken House' LIMIT 1) IS NOT NULL
ON CONFLICT DO NOTHING;

-- Create view for active listings
CREATE OR REPLACE VIEW active_listings AS
SELECT * FROM food_listings
WHERE expires_at > NOW() AND is_available = TRUE
ORDER BY rating DESC, created_at DESC;

-- Create view for popular items (for caching)
CREATE OR REPLACE VIEW popular_items AS
SELECT * FROM active_listings
WHERE rating >= 4.5
LIMIT 20;
