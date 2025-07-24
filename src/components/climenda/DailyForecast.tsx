'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { WeatherData } from "@/lib/weather"
import type { Units } from "./UnitSwitcher"
import { WeatherIcon } from "./WeatherIcon"
import { Droplets, Thermometer } from "lucide-react"

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
    const date = new Date(dateString);
    const today = new Date();
    if (date.getDate() === today.getDate()) return "Today";
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-accent/20">
      <CardHeader>
        <CardTitle>7-Day Forecast</CardTitle>
        <CardDescription>A look at the weather for the upcoming week.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {dailyData.map((day, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/80 transition-colors duration-200">
            <div className="flex items-center gap-4 w-1/3">
                <WeatherIcon condition={day.condition} className="w-10 h-10 drop-shadow-lg text-primary" />
                <div>
                    <p className="font-bold text-lg">{formatDay(day.date)}</p>
                    <p className="text-sm text-muted-foreground">{day.condition}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-400">
                <Droplets className="w-5 h-5" />
                <span className="font-medium">{day.daily_chance_of_rain}%</span>
            </div>
            <div className="flex items-center gap-4 w-1/4 justify-end">
                <p className="font-bold text-lg">
                    {units.temp === 'C' ? Math.round(day.maxtemp_c) : Math.round(day.maxtemp_f)}°
                </p>
                <div className="w-20 h-1.5 bg-foreground/10 rounded-full">
                    <div 
                        className="h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-red-500"
                        style={{
                            width: `${((units.temp === 'C' ? day.avgtemp_c : day.avgtemp_f) - (units.temp === 'C' ? day.mintemp_c : day.mintemp_f)) / ((units.temp === 'C' ? day.maxtemp_c : day.maxtemp_f) - (units.temp === 'C' ? day.mintemp_c : day.mintemp_f)) * 100}%`
                        }}
                    ></div>
                </div>
                <p className="font-bold text-lg text-muted-foreground">
                    {units.temp === 'C' ? Math.round(day.mintemp_c) : Math.round(day.mintemp_f)}°
                </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
