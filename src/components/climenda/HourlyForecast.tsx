'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { WeatherData } from "@/lib/weather"
import type { Units } from "./UnitSwitcher"
import { WeatherIcon } from "./WeatherIcon"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Droplets } from "lucide-react"

interface HourlyForecastProps {
  weatherData: WeatherData | null;
  units: Units;
}

export function HourlyForecast({ weatherData, units }: HourlyForecastProps) {
  if (!weatherData) {
    return null
  }

  const chartData = weatherData.hourly;

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-accent/20">
      <CardHeader>
        <CardTitle>Next 24 Hours</CardTitle>
        <CardDescription>A detailed look at the weather for every hour.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea>
            <div className="flex space-x-4 pb-4">
                {chartData.map((hour, index) => (
                    <div key={index} className="flex-shrink-0 w-32 flex flex-col items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50 shadow-sm text-center">
                        <p className="font-semibold text-lg">{hour.time}</p>
                        <WeatherIcon condition={hour.condition} className="w-12 h-12 my-2 drop-shadow-lg" />
                        <p className="text-2xl font-bold">
                           {units.temp === 'C' ? Math.round(hour.temp_c) : Math.round(hour.temp_f)}°
                        </p>
                        <div className="flex items-center gap-1 text-sm text-blue-400 mt-2">
                            <Droplets className="w-4 h-4" />
                            <span>{hour.chance_of_rain}%</span>
                        </div>
                    </div>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
