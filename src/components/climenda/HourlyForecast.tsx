'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis, ComposedChart, Tooltip, ResponsiveContainer } from "recharts"
import { WeatherData } from "@/lib/weather"
import type { Units } from "./UnitSwitcher"
import { WeatherIcon } from "./WeatherIcon"

interface HourlyForecastProps {
  weatherData: WeatherData | null;
  units: Units;
}

const chartConfig = {
  temperature: {
    label: "Temp",
    color: "hsl(var(--chart-1))",
  },
  rain: {
    label: "Rain",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function HourlyForecast({ weatherData, units }: HourlyForecastProps) {
  if (!weatherData) {
    return null
  }

  const chartData = weatherData.hourly.map(hour => ({
    time: hour.time.split(':')[0] + ':00',
    temperature: units.temp === 'C' ? Math.round(hour.temp_c) : Math.round(hour.temp_f),
    rain: hour.chance_of_rain
  }));

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-accent/20">
      <CardHeader>
        <CardTitle>Next 24 Hours</CardTitle>
        <CardDescription>A look at temperature and chance of rain.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
            <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1}/>
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                />
                <YAxis
                    yAxisId="left"
                    orientation="left"
                    stroke="hsl(var(--chart-1))"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}°`}
                />
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="hsl(var(--chart-2))"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                    cursor={{ fill: 'hsl(var(--muted) / 0.5)' }}
                    content={<ChartTooltipContent 
                        formatter={(value, name) => {
                        if (name === 'temperature') return `${value}°${units.temp}`
                        if (name === 'rain') return `${value}%`
                        return value
                        }}
                        indicator="line"
                    />}
                />
                <Area yAxisId="left" type="monotone" dataKey="temperature" stroke="hsl(var(--chart-1))" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                <Bar yAxisId="right" dataKey="rain" fill="hsl(var(--chart-2))" radius={4} barSize={15} fillOpacity={0.7} />
            </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
