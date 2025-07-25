export interface Holiday {
  date: string;
  name: string;
}

export interface UserEvent {
  id: number;
  date: Date;
  title: string;
}

export interface Astro {
    sunrise: string;
    sunset: string;
}

export interface DayForecast {
    date: string;
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    daily_chance_of_rain: number;
    condition: string;
    totalprecip_mm: number;
}

export interface HourlyForecast {
  time: string;
  temp_c: number;
  temp_f: number;
  chance_of_rain: number;
  condition: string;
}

export interface AirQuality {
    "us-epa-index": number;
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
  air_quality?: AirQuality;
}

export interface LocationInfo {
    name: string;
    region: string;
    country: string;
    localtime: string;
    tz_id: string;
    lat: number;
    lon: number;
}

export interface WeatherData {
  location: LocationInfo;
  locationName: string;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DayForecast[];
  holidays: Holiday[];
  forecastAstro?: Astro;
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
      location: data.location,
      locationName: `${data.location.name}, ${data.location.country}`,
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
        air_quality: data.current.air_quality,
      },
      hourly: data.forecast.forecastday[0].hour.map((h: any) => ({
        time: h.time.split(' ')[1],
        temp_c: h.temp_c,
        temp_f: h.temp_f,
        chance_of_rain: h.chance_of_rain,
        condition: h.condition.text,
      })),
      daily: data.forecast.forecastday.map((d: any) => ({
        date: d.date,
        maxtemp_c: d.day.maxtemp_c,
        maxtemp_f: d.day.maxtemp_f,
        mintemp_c: d.day.mintemp_c,
        mintemp_f: d.day.mintemp_f,
        avgtemp_c: d.day.avgtemp_c,
        avgtemp_f: d.day.avgtemp_f,
        daily_chance_of_rain: d.day.daily_chance_of_rain,
        condition: d.day.condition.text,
        totalprecip_mm: d.day.totalprecip_mm,
      })),
      holidays: data.holidays?.map((h: any) => ({
        date: h.date,
        name: h.name,
      })) || [],
      forecastAstro: data.forecast.forecastday[0].astro,
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
