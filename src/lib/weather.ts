export interface Holiday {
  date: string;
  name: string;
}

export interface Astro {
    sunrise: string;
    sunset: string;
}

export interface Forecast {
    astro: Astro
}

export interface HourlyForecast {
  time: string;
  temp_c: number;
  temp_f: number;
  chance_of_rain: number;
  condition: string;
}

export interface CurrentWeather {
  temp_c: number;
  temp_f: number;
  feelslike_c: number;
  feelslike_f: number;
  humidity: number;
  wind_kph: number;
  wind_mph: number;
  vis_km: number;
  vis_miles: number;
  condition: string;
}

export interface WeatherData {
  location: string;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  holidays: Holiday[];
  forecast?: Forecast;
}

export interface LocationSuggestion {
    id: number;
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    url:string;
}


export const getWeatherData = async (location: string): Promise<WeatherData | null> => {
  try {
    const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();

    const weatherData: WeatherData = {
      location: `${data.location.name}, ${data.location.country}`,
      current: {
        temp_c: data.current.temp_c,
        temp_f: data.current.temp_f,
        feelslike_c: data.current.feelslike_c,
        feelslike_f: data.current.feelslike_f,
        humidity: data.current.humidity,
        wind_kph: data.current.wind_kph,
        wind_mph: data.current.wind_mph,
        vis_km: data.current.vis_km,
        vis_miles: data.current.vis_miles,
        condition: data.current.condition.text,
      },
      hourly: data.forecast.forecastday[0].hour.map((h: any) => ({
        time: h.time.split(' ')[1],
        temp_c: h.temp_c,
        temp_f: h.temp_f,
        chance_of_rain: h.chance_of_rain,
        condition: h.condition.text,
      })),
      holidays: data.holidays?.map((h: any) => ({
        date: h.date,
        name: h.name,
      })) || [],
      forecast: {
        astro: data.forecast.forecastday[0].astro,
      }
    };
    return weatherData;
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    return null;
  }
};

export const getAvailableLocations = async (query: string): Promise<LocationSuggestion[]> => {
    if (query.length < 3) return [];
    try {
        const response = await fetch(`/api/weather/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch locations:", error);
        return [];
    }
}
