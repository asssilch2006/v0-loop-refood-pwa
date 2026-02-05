// Upstash Redis and Search Integration

import { Redis } from '@upstash/redis';
import { Index } from '@upstash/vector';

// Redis for caching popular offers
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Vector Index for neighborhood-based filtering
const vectorIndex = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

// Cache popular offers for instant loading
export async function cachePopularOffers(offers: any[]) {
  try {
    const cacheKey = 'popular-offers:algiers';
    await redis.setex(
      cacheKey,
      3600, // 1 hour cache
      JSON.stringify(offers)
    );
    console.log('[v0] Cached popular offers for Algiers');
  } catch (error) {
    console.error('[v0] Failed to cache offers:', error);
  }
}

// Get cached popular offers
export async function getPopularOffers() {
  try {
    const cacheKey = 'popular-offers:algiers';
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log('[v0] Returning cached popular offers');
      return JSON.parse(cached as string);
    }
    return null;
  } catch (error) {
    console.error('[v0] Failed to get cached offers:', error);
    return null;
  }
}

// Neighborhood-based search using vectors
export async function searchByNeighborhood(
  latitude: number,
  longitude: number,
  radius: number = 5 // km
) {
  try {
    console.log(
      `[v0] Searching for items near [${latitude}, ${longitude}] within ${radius}km`
    );

    // Convert coordinates to vector representation
    const query = [latitude / 100, longitude / 100]; // Simple normalization

    const results = await vectorIndex.query({
      vector: query,
      topK: 20,
      includeMetadata: true,
    });

    console.log(`[v0] Found ${results.length} items near location`);
    return results;
  } catch (error) {
    console.error('[v0] Neighborhood search failed:', error);
    return [];
  }
}

// Index new listings for fast search
export async function indexListing(listing: {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  neighborhood: string;
}) {
  try {
    const vector = [listing.latitude / 100, listing.longitude / 100];

    await vectorIndex.upsert([
      {
        id: listing.id,
        vector: vector,
        metadata: {
          name: listing.name,
          category: listing.category,
          neighborhood: listing.neighborhood,
        },
      },
    ]);

    console.log(`[v0] Indexed listing: ${listing.name}`);
  } catch (error) {
    console.error('[v0] Failed to index listing:', error);
  }
}

// Clear cache when new listings are added
export async function invalidateOfferCache() {
  try {
    await redis.del('popular-offers:algiers');
    console.log('[v0] Invalidated offer cache');
  } catch (error) {
    console.error('[v0] Failed to invalidate cache:', error);
  }
}
