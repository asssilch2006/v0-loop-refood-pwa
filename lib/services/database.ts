'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('[v0] Supabase credentials missing. Database operations disabled.');
}

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Listings Operations
export async function createListing(listingData: {
  seller_id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  location_lat: number;
  location_lng: number;
  image_url?: string;
  expires_at: string;
}) {
  if (!supabase) {
    console.error('[v0] Supabase not initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('listings')
      .insert([listingData])
      .select();

    if (error) throw error;
    console.log('[v0] Listing created:', data);
    return data?.[0] || null;
  } catch (error) {
    console.error('[v0] Failed to create listing:', error);
    return null;
  }
}

export async function getListings(neighborhood?: string) {
  if (!supabase) {
    console.error('[v0] Supabase not initialized');
    return [];
  }

  try {
    let query = supabase
      .from('listings')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (neighborhood) {
      query = query.eq('neighborhood', neighborhood);
    }

    const { data, error } = await query;

    if (error) throw error;
    console.log('[v0] Fetched listings:', data?.length);
    return data || [];
  } catch (error) {
    console.error('[v0] Failed to fetch listings:', error);
    return [];
  }
}

// Orders Operations
export async function createOrder(orderData: {
  buyer_id: string;
  listing_id: string;
  quantity: number;
  total_price: number;
  delivery_address: string;
}) {
  if (!supabase) {
    console.error('[v0] Supabase not initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        ...orderData,
        status: 'pending',
        created_at: new Date().toISOString(),
      }])
      .select();

    if (error) throw error;
    console.log('[v0] Order created:', data);
    return data?.[0] || null;
  } catch (error) {
    console.error('[v0] Failed to create order:', error);
    return null;
  }
}

export async function getOrders(userId: string) {
  if (!supabase) {
    console.error('[v0] Supabase not initialized');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('buyer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    console.log('[v0] Fetched orders:', data?.length);
    return data || [];
  } catch (error) {
    console.error('[v0] Failed to fetch orders:', error);
    return [];
  }
}

// User Profile Operations
export async function updateUserProfile(userId: string, profileData: {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
}) {
  if (!supabase) {
    console.error('[v0] Supabase not initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .update(profileData)
      .eq('id', userId)
      .select();

    if (error) throw error;
    console.log('[v0] Profile updated');
    return data?.[0] || null;
  } catch (error) {
    console.error('[v0] Failed to update profile:', error);
    return null;
  }
}

export async function getUserProfile(userId: string) {
  if (!supabase) {
    console.error('[v0] Supabase not initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    console.log('[v0] Fetched user profile');
    return data || null;
  } catch (error) {
    console.error('[v0] Failed to fetch profile:', error);
    return null;
  }
}

// Dry Bread Recycling Program
export async function createAnimalFeedListing(listingData: {
  seller_id: string;
  bread_type: 'dry' | 'crumbed' | 'fresh';
  weight_kg: number;
  price_per_kg: number;
  location_lat: number;
  location_lng: number;
  description: string;
}) {
  return createListing({
    ...listingData,
    title: `Dry Bread for Animal Feed - ${listingData.weight_kg}kg`,
    category: 'animal_feed',
    price: listingData.weight_kg * listingData.price_per_kg,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });
}

export async function getAnimalFeedListings(neighborhood?: string) {
  return getListings(neighborhood);
}
