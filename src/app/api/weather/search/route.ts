import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'The WEATHER_API_KEY environment variable is not set. Please add it to your .env file.' }, { status: 500 });
  }

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required.' }, { status: 400 });
  }

  const url = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
        const errorData = await response.json();
      return NextResponse.json({ error: errorData.error.message }, { status: response.status });
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch location suggestions.' }, { status: 500 });
  }
}
