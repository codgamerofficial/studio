'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WeatherData } from "@/lib/weather"
import { CalendarDays, Pin } from 'lucide-react'
import { Badge } from "../ui/badge";

interface HolidayDisplayProps {
  weatherData: WeatherData | null
}

export function HolidayDisplay({ weatherData }: HolidayDisplayProps) {
  if (!weatherData || !weatherData.holidays.length) {
    return null;
  }

  const upcomingHolidays = weatherData.holidays.filter(h => {
    const holidayDate = new Date(h.date + 'T00:00:00');
    const today = new Date(weatherData.location.localtime);
    today.setHours(0,0,0,0);
    return holidayDate >= today;
  }).slice(0, 5);


  if (!upcomingHolidays.length) {
    return null;
  }


  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarDays className="w-5 h-5 text-primary" />
          Upcoming Holidays
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {upcomingHolidays.map((holiday) => (
            <li key={holiday.name} className="flex justify-between items-center text-sm">
              <span>{holiday.name}</span>
              <Badge variant="secondary" className="font-medium">
                {new Date(holiday.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
