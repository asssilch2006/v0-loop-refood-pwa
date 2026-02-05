import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    console.log('[v0] Deleting file:', url);

    // Delete from Vercel Blob
    await del(url);

    console.log('[v0] File deleted successfully');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
