import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Get the URL parameters
  const url = new URL(request.url);
  const term = url.searchParams.get('term');
  const media = url.searchParams.get('media') || 'music';
  const entity = url.searchParams.get('entity') || 'song';
  const limit = url.searchParams.get('limit') || '5';

  // Make sure we have a search term
  if (!term) {
    return NextResponse.json(
      { error: 'Search term is required' },
      { status: 400 }
    );
  }

  try {
    // Build the iTunes API URL
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=${media}&entity=${entity}&limit=${limit}`;
    
    // Fetch from iTunes API
    const response = await fetch(itunesUrl);
    
    if (!response.ok) {
      throw new Error(`iTunes API responded with status: ${response.status}`);
    }
    
    // Get the response data
    const data = await response.json();
    
    // Return the response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from iTunes API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from iTunes API' },
      { status: 500 }
    );
  }
} 