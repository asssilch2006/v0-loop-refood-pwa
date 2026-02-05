import { NextResponse } from 'next/server';
import { getRandomGreenTip } from '@/lib/algerian-waste-data';

export async function GET() {
  try {
    const tip = getRandomGreenTip();
    
    return NextResponse.json({
      tip,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[v0] Green tip generation error:', error);
    return NextResponse.json(
      { tip: 'Every food item saved is a victory for our planet!' },
      { status: 200 }
    );
  }
}
