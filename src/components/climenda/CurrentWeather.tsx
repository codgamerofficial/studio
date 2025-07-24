'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { WeatherData } from "@/lib/weather"
import { WeatherIcon } from "./WeatherIcon"
import type { Units } from "./UnitSwitcher"
import { Droplets, Wind } from "lucide-react"

interface CurrentWeatherProps {
  weatherData: WeatherData | null
  units: Units
}

export function CurrentWeather({ weatherData, units }: CurrentWeatherProps) {
  if (!weatherData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Weather</CardTitle>
          <CardDescription>Loading weather data...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const { current, location } = weatherData;
  const temp = units.temp === 'C' ? current.temp_c : current.temp_f;
  const speed = units.speed === 'kmh' ? current.wind_kph : current.wind_mph;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Current Weather</CardTitle>
        <CardDescription>{location}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <WeatherIcon condition={current.condition} className="w-20 h-20 text-accent" />
            <div>
              <div className="text-6xl font-bold">
                {temp}°<span className="text-4xl align-top">{units.temp}</span>
              </div>
              <p className="text-xl text-muted-foreground">{current.condition}</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 text-lg">
            <div className="flex items-center gap-2">
              <Droplets className="w-6 h-6 text-muted-foreground" />
              <span>Humidity: {current.humidity}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-6 h-6 text-muted-foreground" />
              <span>Wind: {speed} {units.speed}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
