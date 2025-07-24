'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { WeatherData } from "@/lib/weather"
import { WeatherIcon } from "./WeatherIcon"
import type { Units } from "./UnitSwitcher"
import { Droplets, Wind, Sunrise, Sunset, Eye } from "lucide-react"

interface CurrentWeatherProps {
  weatherData: WeatherData | null
  units: Units
}

export function CurrentWeather({ weatherData, units }: CurrentWeatherProps) {
  if (!weatherData) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Current Weather</CardTitle>
          <CardDescription>Loading weather data...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const { current, location, forecast } = weatherData;
  const temp = units.temp === 'C' ? current.temp_c : current.temp_f;
  const feelsLike = units.temp === 'C' ? current.feelslike_c : current.feelslike_f;
  const speed = units.speed === 'kmh' ? current.wind_kph : current.wind_mph;
  const vis = units.speed === 'kmh' ? current.vis_km : current.vis_miles;

  const astro = forecast?.astro;

  return (
    <Card className="w-full bg-gradient-to-br from-primary/20 via-card to-card shadow-2xl shadow-primary/10 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-3xl font-bold tracking-tighter">{location}</CardTitle>
        <CardDescription className="text-lg">What it feels like right now.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <WeatherIcon condition={current.condition} className="w-24 h-24 text-primary drop-shadow-lg" />
            <div>
              <div className="text-7xl font-bold">
                {Math.round(temp)}°<span className="text-5xl align-top">{units.temp}</span>
              </div>
              <p className="text-xl text-muted-foreground -mt-2">{current.condition}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-lg">
            <div className="flex items-center gap-3" title="Feels Like">
                <span className="text-4xl font-bold text-accent">{Math.round(feelsLike)}°</span>
                <span className="text-muted-foreground">Feels Like</span>
            </div>
            <div className="flex items-center gap-3" title="Humidity">
              <Droplets className="w-7 h-7 text-accent" />
              <span>{current.humidity}%</span>
            </div>
            <div className="flex items-center gap-3" title={`Wind speed (${units.speed})`}>
              <Wind className="w-7 h-7 text-accent" />
              <span>{speed} {units.speed}</span>
            </div>
            <div className="flex items-center gap-3" title={`Visibility (${units.speed === 'kmh' ? 'km' : 'miles'})`}>
              <Eye className="w-7 h-7 text-accent" />
              <span>{vis} {units.speed === 'kmh' ? 'km' : 'mi'}</span>
            </div>
          </div>
        </div>
        {astro && (
            <div className="mt-6 flex justify-around items-center border-t border-primary/20 pt-4">
                <div className="flex items-center gap-3 text-lg">
                    <Sunrise className="w-8 h-8 text-chart-4" />
                    <div>
                        <p className="font-bold">{astro.sunrise}</p>
                        <p className="text-sm text-muted-foreground">Sunrise</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3 text-lg">
                    <Sunset className="w-8 h-8 text-chart-2" />
                    <div>
                        <p className="font-bold">{astro.sunset}</p>
                        <p className="text-sm text-muted-foreground">Sunset</p>
                    </div>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  )
}
