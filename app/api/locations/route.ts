import { NextResponse } from 'next/server';
import { algiersNeighborhoods } from '@/lib/algerian-waste-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const neighborhood = searchParams.get('neighborhood');
    const type = searchParams.get('type');

    let results = algiersNeighborhoods;

    if (neighborhood) {
      results = results.filter((n) =>
        n.name.toLowerCase().includes(neighborhood.toLowerCase())
      );
    }

    if (type) {
      results = results.filter((n) => n.type === type);
    }

    return NextResponse.json({
      locations: results,
      count: results.length,
      center: {
        lat: 36.75,
        lng: 3.05,
      },
    });
  } catch (error) {
    console.error('[v0] Locations API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}
