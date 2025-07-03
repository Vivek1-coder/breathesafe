import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city')?.trim().toLowerCase();

  if (!city) {
    return NextResponse.json({ error: 'City parameter is required' }, { status: 400 });
  }

  const apiKey = process.env.API_NINJAS_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Server configuration error: API key missing' }, { status: 500 });
  }

  const apiUrl = `https://api.api-ninjas.com/v1/airquality?city=${encodeURIComponent(city)}`;

  try {
    const response = await fetch(apiUrl, {
      headers: { 'X-Api-Key': apiKey },
      cache: 'no-store', // prevent caching if needed
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (!response.ok) {
      const errorText = isJson ? await response.json() : await response.text();
      return NextResponse.json(
        { error: errorText?.error || errorText || 'Failed to fetch AQI' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (err) {
    console.error('AQI API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
