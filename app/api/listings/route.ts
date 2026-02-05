import { NextRequest, NextResponse } from 'next/server';
import { getFoodListings } from '@/lib/services/supabase';
import { getPopularOffers, searchByNeighborhood } from '@/lib/services/upstash';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const neighborhood = searchParams.get('neighborhood') || 'Algiers';
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const useCache = searchParams.get('useCache') === 'true';

    console.log('[v0] Fetching listings:', { neighborhood, category, search });

    // Try to get cached popular offers if requested
    if (useCache) {
      const cached = await getPopularOffers();
      if (cached) {
        return NextResponse.json({ data: cached, source: 'cache' });
      }
    }

    // Fetch from Supabase
    const listings = await getFoodListings({
      neighborhood,
      category,
      search,
    });

    console.log(`[v0] Retrieved ${listings.length} listings`);

    return NextResponse.json({ data: listings, source: 'database' });
  } catch (error) {
    console.error('[v0] Listings API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}
