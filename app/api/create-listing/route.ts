import { NextRequest, NextResponse } from 'next/server';
import { createListing, createAnimalFeedListing } from '@/lib/services/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      seller_id,
      title,
      description,
      category,
      price,
      location_lat,
      location_lng,
      image_url,
      is_animal_feed,
      bread_type,
      weight_kg,
      price_per_kg,
    } = body;

    // Validation
    if (!seller_id || !title || !category || !price || location_lat === undefined || location_lng === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('[v0] Creating listing:', { title, category });

    let listing;

    if (is_animal_feed && category === 'animal_feed') {
      // Create animal feed listing
      listing = await createAnimalFeedListing({
        seller_id,
        bread_type: bread_type || 'dry',
        weight_kg: weight_kg || 1,
        price_per_kg: price_per_kg || price,
        location_lat,
        location_lng,
        description: description || 'Dry bread for animal feed',
      });
    } else {
      // Create regular listing
      listing = await createListing({
        seller_id,
        title,
        description: description || '',
        category,
        price,
        location_lat,
        location_lng,
        image_url,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    if (!listing) {
      return NextResponse.json(
        { error: 'Failed to create listing' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, listing },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Listing creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
