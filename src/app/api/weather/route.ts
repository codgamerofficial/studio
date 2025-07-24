// IMPORTANT: You must get a free API key from https://www.weatherapi.com/ and add it to your .env file.
// WEATHER_API_KEY="YOUR_API_KEY"

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Weather API key is not configured.' }, { status: 500 });
  }

  if (!location) {
    return NextResponse.json({ error: 'Location parameter is required.' }, { status: 400 });
  }

  const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7&aqi=yes`;
  const holidaysUrl = `https://api.weatherapi.com/v1/holidays.json?key=${apiKey}&q=${location}&dt=${new Date().getFullYear()}-01-01`;
  
  try {
    const [forecastRes, holidaysRes] = await Promise.all([
        fetch(forecastUrl),
        fetch(holidaysUrl)
    ]);

    if (!forecastRes.ok) {
        const errorData = await forecastRes.json();
        return NextResponse.json({ error: errorData.error.message }, { status: forecastRes.status });
    }

    const forecastData = await forecastRes.json();
    
    let holidaysData = [];
    if(holidaysRes.ok) {
        const holidaysJson = await holidaysRes.json();
        holidaysData = holidaysJson.holidays;
    }

    const combinedData = {
        ...forecastData,
        holidays: holidaysData
    };

    return NextResponse.json(combinedData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch weather data.' }, { status: 500 });
  }
}
