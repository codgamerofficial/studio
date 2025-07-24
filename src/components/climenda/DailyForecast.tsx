'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { WeatherData } from "@/lib/weather"
import type { Units } from "./UnitSwitcher"
import { WeatherIcon } from "./WeatherIcon"
import { Droplets, Thermometer, Wind } from "lucide-react"

interface DailyForecastProps {
  weatherData: WeatherData | null;
  units: Units;
}

export function DailyForecast({ weatherData, units }: DailyForecastProps) {
  if (!weatherData) {
    return null
  }

  const dailyData = weatherData.daily;

  const formatDay = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00'); // Avoid timezone issues
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date.getTime() === today.getTime()) return "Today";
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-accent/20">
      <CardHeader>
        <CardTitle>7-Day Forecast</CardTitle>
        <CardDescription>A look at the weather for the upcoming week.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {dailyData.map((day, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/80 transition-colors duration-200">
            <div className="flex items-center gap-4 w-1/3 sm:w-1/4">
                <WeatherIcon condition={day.condition} className="w-10 h-10 drop-shadow-lg text-primary" />
                <div className="w-24">
                    <p className="font-bold text-lg">{formatDay(day.date)}</p>
                    <p className="text-sm text-muted-foreground truncate" title={day.condition}>{day.condition}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-blue-400 w-1/4 justify-center">
                <Droplets className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-bold">{day.daily_chance_of_rain}%</p>
                  <p className="text-xs text-muted-foreground">{day.totalprecip_mm.toFixed(1)} mm</p>
                </div>
            </div>

            <div className="flex items-center gap-2 w-1/3 sm:w-1/2 justify-end">
                <p className="font-bold text-lg text-muted-foreground">
                    {units.temp === 'C' ? Math.round(day.mintemp_c) : Math.round(day.mintemp_f)}°
                </p>
                <div className="w-full max-w-24 h-2 bg-foreground/10 rounded-full overflow-hidden">
                    <div 
                        className="h-2 rounded-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-500"
                    ></div>
                </div>
                <p className="font-bold text-lg">
                    {units.temp === 'C' ? Math.round(day.maxtemp_c) : Math.round(day.maxtemp_f)}°
                </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
