export interface Holiday {
  date: string;
  name: string;
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
  humidity: number;
  wind_kph: number;
  wind_mph: number;
  condition: string;
}

export interface WeatherData {
  location: string;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  holidays: Holiday[];
}

const generateHourlyForecast = (startTempC: number, condition: string): HourlyForecast[] => {
  const forecast: HourlyForecast[] = [];
  for (let i = 0; i < 24; i++) {
    const hour = (new Date().getHours() + i) % 24;
    const temp_c = startTempC + Math.sin(i / 6) * 3 + (Math.random() - 0.5) * 2;
    const temp_f = temp_c * 1.8 + 32;
    const chance_of_rain = Math.max(0, Math.min(100, (condition.toLowerCase().includes('rain') ? 60 : 10) + Math.sin(i/4) * 20 + (Math.random() - 0.5) * 30));
    
    forecast.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      temp_c: Math.round(temp_c),
      temp_f: Math.round(temp_f),
      chance_of_rain: Math.round(chance_of_rain),
      condition: chance_of_rain > 40 ? "Light Rain" : condition,
    });
  }
  return forecast;
};

const mockData: Record<string, WeatherData> = {
  "new york": {
    location: "New York, USA",
    current: {
      temp_c: 22,
      temp_f: 72,
      humidity: 55,
      wind_kph: 15,
      wind_mph: 9,
      condition: "Partly Cloudy",
    },
    hourly: generateHourlyForecast(22, "Partly Cloudy"),
    holidays: [
      { date: "2024-07-04", name: "Independence Day" },
      { date: "2024-09-02", name: "Labor Day" },
    ],
  },
  "london": {
    location: "London, UK",
    current: {
      temp_c: 17,
      temp_f: 63,
      humidity: 70,
      wind_kph: 20,
      wind_mph: 12,
      condition: "Light Rain",
    },
    hourly: generateHourlyForecast(17, "Light Rain"),
    holidays: [
        { date: "2024-08-26", name: "Summer Bank Holiday" },
        { date: "2024-12-25", name: "Christmas Day" },
    ],
  },
  "tokyo": {
    location: "Tokyo, Japan",
    current: {
      temp_c: 28,
      temp_f: 82,
      humidity: 75,
      wind_kph: 10,
      wind_mph: 6,
      condition: "Sunny",
    },
    hourly: generateHourlyForecast(28, "Sunny"),
    holidays: [
        { date: "2024-07-15", name: "Marine Day" },
        { date: "2024-08-11", name: "Mountain Day" },
    ],
  },
  "paris": {
    location: "Paris, France",
    current: {
        temp_c: 24,
        temp_f: 75,
        humidity: 60,
        wind_kph: 12,
        wind_mph: 7,
        condition: "Sunny",
    },
    hourly: generateHourlyForecast(24, "Sunny"),
    holidays: [
        { date: "2024-07-14", name: "Bastille Day" },
        { date: "2024-08-15", name: "Assumption of Mary" },
    ],
  },
  "sydney": {
      location: "Sydney, Australia",
      current: {
          temp_c: 18,
          temp_f: 64,
          humidity: 65,
          wind_kph: 25,
          wind_mph: 16,
          condition: "Windy",
      },
      hourly: generateHourlyForecast(18, "Windy"),
      holidays: [
          { date: "2024-10-07", name: "Labour Day" },
          { date: "2024-12-25", name: "Christmas Day" },
      ],
  }
};

export const getMockWeatherData = (location: string): WeatherData | null => {
  const key = location.toLowerCase();
  const foundKey = Object.keys(mockData).find(k => mockData[k].location.toLowerCase() === key);
  return mockData[foundKey || key] || null;
};

export const getAvailableLocations = (): string[] => {
    return Object.values(mockData).map(data => data.location);
}
