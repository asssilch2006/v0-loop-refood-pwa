import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for database tables
export interface FoodListing {
  id: string;
  name: string;
  seller_id: string;
  seller_name: string;
  seller_location: string;
  image_url: string;
  original_price: number;
  loop_price: number;
  category: 'fastfood' | 'coffee' | 'sweets' | 'bread' | 'animal';
  subcategory?: string;
  expires_at: string;
  distance_km: number;
  latitude: number;
  longitude: number;
  rating: number;
  reviews_count: number;
  neighborhood: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'consumer' | 'seller';
  location: string;
  avatar_url?: string;
  business_name?: string;
  business_type?: 'restaurant' | 'butcher' | 'bakery';
  phone?: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  listing_id: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  quantity: number;
  total_price: number;
  created_at: string;
  updated_at: string;
}

// Fetch food listings with filters
export async function getFoodListings(filters?: {
  neighborhood?: string;
  category?: string;
  search?: string;
}) {
  let query = supabase.from('food_listings').select('*');

  if (filters?.neighborhood) {
    query = query.eq('neighborhood', filters.neighborhood);
  }
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data as FoodListing[];
}

// Fetch user profile
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as UserProfile;
}

// Create order
export async function createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}
