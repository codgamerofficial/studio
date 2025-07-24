'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Holiday } from '@/lib/weather'
import { Badge } from "@/components/ui/badge"

interface CalendarViewProps {
  initialDate: Date;
  holidays: Holiday[];
}

export function CalendarView({ initialDate, holidays }: CalendarViewProps) {
  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [currentMonth, setCurrentMonth] = useState(initialDate);
  const [today, setToday] = useState(initialDate);

  useEffect(() => {
    const locationToday = new Date(initialDate);
    locationToday.setHours(0, 0, 0, 0);
    
    setDate(locationToday);
    setCurrentMonth(locationToday);
    setToday(locationToday);
  }, [initialDate]);
  
  const holidayDates = useMemo(() => holidays.map(h => {
    // API returns date as YYYY-MM-DD, need to parse as UTC to avoid timezone shifts
    const parts = h.date.split('-').map(p => parseInt(p, 10));
    return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  }), [holidays]);

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleTodayClick = () => {
    setDate(today);
    setCurrentMonth(today);
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-border/50">
            <CardTitle className="text-lg font-medium">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </CardTitle>
            <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={handleTodayClick} className="h-8">
                    Today
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handlePrevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </CardHeader>
      <CardContent className="p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className="rounded-md"
          showOutsideDays={true}
          today={today}
          modifiers={{
            holiday: holidayDates,
          }}
          modifiersClassNames={{
            holiday: 'holiday',
          }}
          classNames={{
            day_today: "bg-accent/50 text-accent-foreground rounded-md",
          }}
          components={{
            Caption: () => null, // Hide default caption
          }}
        />
      </CardContent>
    </Card>
  )
}
