import { NextRequest, NextResponse } from 'next/server';
import {
  searchByNeighborhood,
  indexListing,
  getPopularOffers,
  cachePopularOffers,
} from '@/lib/services/upstash';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'neighborhood';
    const latitude = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : 36.75;
    const longitude = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : 3.05;
    const radius = searchParams.get('radius') ? parseInt(searchParams.get('radius')!) : 5;

    console.log(
      `[v0] Search request: type=${type}, location=[${latitude}, ${longitude}], radius=${radius}km`
    );

    if (type === 'popular') {
      // Return cached popular offers
      const cached = await getPopularOffers();
      if (cached) {
        console.log('[v0] Returning cached popular offers');
        return NextResponse.json({
          data: cached,
          source: 'redis_cache',
          cached: true,
        });
      }
    }

    if (type === 'neighborhood') {
      // Search by location using vector index
      const results = await searchByNeighborhood(latitude, longitude, radius);
      console.log(`[v0] Found ${results.length} items in neighborhood search`);

      return NextResponse.json({
        data: results,
        source: 'vector_index',
        location: { lat: latitude, lng: longitude },
        radius: radius,
      });
    }

    return NextResponse.json(
      { error: 'Invalid search type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[v0] Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, listing, offers } = body;

    if (action === 'index-listing') {
      // Index a new listing for geographic search
      await indexListing(listing);
      console.log('[v0] Listing indexed for search');
      return NextResponse.json({ success: true, message: 'Listing indexed' });
    }

    if (action === 'cache-popular') {
      // Cache popular offers
      await cachePopularOffers(offers);
      console.log('[v0] Popular offers cached');
      return NextResponse.json({
        success: true,
        message: `Cached ${offers.length} popular offers`,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[v0] Search POST error:', error);
    return NextResponse.json(
      { error: 'Action failed' },
      { status: 500 }
    );
  }
}
