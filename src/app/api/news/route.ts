// IMPORTANT: You must get a free API key from https://newsapi.org/ and add it to your .env file.
// NEWS_API_KEY="YOUR_API_KEY"

import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'News API key is not configured.' }, { status: 500 });
  }
  
  // Fetches top headlines from the US. You can change this to other countries.
  const newsUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
  
  try {
    const newsRes = await fetch(newsUrl);

    if (!newsRes.ok) {
        const errorData = await newsRes.json();
        // NewsAPI error format is { status, code, message }
        return NextResponse.json({ error: errorData.message || 'Failed to fetch news data from source' }, { status: newsRes.status });
    }

    const newsData = await newsRes.json();
    return NextResponse.json(newsData);
  } catch (error) {
    let message = 'Failed to fetch news data.';
    if (error instanceof Error) {
        message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
