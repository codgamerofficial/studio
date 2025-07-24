'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarViewProps {
  initialDate: Date;
}

export function CalendarView({ initialDate }: CalendarViewProps) {
  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [currentMonth, setCurrentMonth] = useState(initialDate);

  useEffect(() => {
    setDate(initialDate);
    setCurrentMonth(initialDate);
  }, [initialDate]);

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleTodayClick = () => {
    setDate(initialDate);
    setCurrentMonth(initialDate);
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
            <CardTitle className="text-lg font-medium">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </CardTitle>
            <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={handleTodayClick}>
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
      <CardContent className="p-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className="rounded-md"
          showOutsideDays={true}
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
