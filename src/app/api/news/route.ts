// IMPORTANT: You must get a free API key from https://newsapi.org/ and add it to your .env file.
// NEWS_API_KEY="YOUR_API_KEY"

import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'The NEWS_API_KEY environment variable is not set. Please add it to your .env file.' }, { status: 500 });
  }
  
  // Fetches top headlines from the US. You can change this to other countries.
  const newsUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
  
  try {
    const newsRes = await fetch(newsUrl);
    const newsData = await newsRes.json();

    if (!newsRes.ok) {
        // NewsAPI error format is { status, code, message }
        const errorMessage = newsData.message || 'Failed to fetch news data from source';
        console.error("NewsAPI Error:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: newsRes.status });
    }

    return NextResponse.json(newsData);
  } catch (error) {
    let message = 'Failed to fetch news data.';
    if (error instanceof Error) {
        message = error.message;
    }
    console.error("Internal Server Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
