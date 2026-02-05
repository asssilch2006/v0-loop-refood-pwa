import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrders } from '@/lib/services/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { buyer_id, listing_id, quantity, total_price, delivery_address } = body;

    if (!buyer_id || !listing_id || !quantity || !total_price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('[v0] Creating order:', { buyer_id, listing_id });
    const order = await createOrder({
      buyer_id,
      listing_id,
      quantity,
      total_price,
      delivery_address: delivery_address || 'Algiers',
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error('[v0] Order creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    console.log('[v0] Fetching orders for user:', userId);
    const orders = await getOrders(userId);

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('[v0] Order fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
