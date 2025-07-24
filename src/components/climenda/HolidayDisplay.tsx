'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WeatherData } from "@/lib/weather"
import { CalendarDays } from 'lucide-react'

interface HolidayDisplayProps {
  weatherData: WeatherData | null
}

export function HolidayDisplay({ weatherData }: HolidayDisplayProps) {
  if (!weatherData || !weatherData.holidays.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="w-6 h-6" />
          Upcoming Holidays
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {weatherData.holidays.map((holiday) => (
            <li key={holiday.name} className="flex justify-between items-center text-sm">
              <span>{holiday.name}</span>
              <span className="font-medium text-muted-foreground">
                {new Date(holiday.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
