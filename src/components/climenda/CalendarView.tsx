'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"

export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Card>
      <CardContent className="p-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md"
        />
      </CardContent>
    </Card>
  )
}
