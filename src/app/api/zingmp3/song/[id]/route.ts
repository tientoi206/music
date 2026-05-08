import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const response = await axios.get('https://zingmp3.vn/api/song/get-song-info', {
      params: { id },
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('ZingMP3 proxy error:', error);
    return NextResponse.json(
      { error: 'Kh�ng th? l?y th�ng tin b�i h�t t? ZingMP3' },
      { status: 500 }
    );
  }
}
