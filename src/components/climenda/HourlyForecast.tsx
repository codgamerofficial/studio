'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis, ComposedChart, Tooltip } from "recharts"
import { WeatherData } from "@/lib/weather"
import type { Units } from "./UnitSwitcher"

interface HourlyForecastProps {
  weatherData: WeatherData | null;
  units: Units;
}

const chartConfig = {
  temperature: {
    label: "Temp",
    color: "hsl(var(--accent))",
  },
  rain: {
    label: "Rain",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function HourlyForecast({ weatherData, units }: HourlyForecastProps) {
  if (!weatherData) {
    return null
  }

  const chartData = weatherData.hourly.map(hour => ({
    time: hour.time,
    temperature: units.temp === 'C' ? hour.temp_c : hour.temp_f,
    rain: hour.chance_of_rain
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>24-Hour Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <ComposedChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.split(':')[0]}
            />
            <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--accent))" />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--primary))" />
            <ChartTooltip
              content={<ChartTooltipContent 
                formatter={(value, name) => {
                  if (name === 'temperature') return `${value}°${units.temp}`
                  if (name === 'rain') return `${value}%`
                  return value
                }}
              />}
            />
            <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="hsl(var(--accent))" strokeWidth={3} dot={false} />
            <Bar yAxisId="right" dataKey="rain" fill="hsl(var(--primary))" radius={4} barSize={20} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
