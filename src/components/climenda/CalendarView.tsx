
'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Holiday, UserEvent } from '@/lib/weather'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
});


interface AddEventDialogProps {
  date: Date;
  onAddEvent: (event: Omit<UserEvent, 'id'>) => void;
  children: React.ReactNode;
}

function AddEventDialog({ date, onAddEvent, children }: AddEventDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = (values: z.infer<typeof eventFormSchema>) => {
    onAddEvent({
      date,
      title: values.title,
    });
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Event for {date.toLocaleDateString()}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Doctor's Appointment" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save Event</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


interface CalendarViewProps {
  initialDate: Date;
  holidays: Holiday[];
  userEvents: UserEvent[];
  onAddEvent: (event: Omit<UserEvent, 'id'>) => void;
}

export function CalendarView({ initialDate, holidays, userEvents, onAddEvent }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate);
  const [currentMonth, setCurrentMonth] = useState(initialDate);
  const [today, setToday] = useState(new Date());

  useEffect(() => {
    const locationToday = new Date(initialDate);
    locationToday.setHours(0, 0, 0, 0);
    
    setSelectedDate(locationToday);
    setCurrentMonth(locationToday);
    setToday(locationToday);
  }, [initialDate]);
  
   const holidaysByDate = useMemo(() => {
    const map = new Map<string, Holiday>();
    holidays.forEach(h => {
        // Normalize date to prevent timezone issues
        const date = new Date(h.date + 'T00:00:00');
        map.set(date.toDateString(), h);
    });
    return map;
  }, [holidays]);

  const holidayDates = useMemo(() => Array.from(holidaysByDate.keys()).map(d => new Date(d)), [holidaysByDate]);

  const userEventDates = useMemo(() => userEvents.map(e => e.date), [userEvents]);

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleTodayClick = () => {
    setSelectedDate(today);
    setCurrentMonth(today);
  }

  const eventsForSelectedDay = useMemo(() => {
    if (!selectedDate) return [];
    return userEvents.filter(event => 
      event.date.getFullYear() === selectedDate.getFullYear() &&
      event.date.getMonth() === selectedDate.getMonth() &&
      event.date.getDate() === selectedDate.getDate()
    );
  }, [selectedDate, userEvents]);

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
        <TooltipProvider>
            <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="rounded-md"
            showOutsideDays={true}
            today={today}
            modifiers={{
                holiday: holidayDates,
                userEvent: userEventDates,
            }}
            modifiersClassNames={{
                holiday: 'holiday-date',
                userEvent: 'user-event-date',
            }}
            classNames={{
                day_today: "bg-accent/50 text-accent-foreground rounded-md",
                cell: "relative",
            }}
            components={{
                Caption: () => null, // Hide default caption
                DayContent: (props) => {
                const holidayInfo = holidaysByDate.get(props.date.toDateString());
                const isHoliday = !!holidayInfo && props.displayMonth.getMonth() === props.date.getMonth();
                const hasUserEvent = props.displayMonth.getMonth() === props.date.getMonth() && props.activeModifiers.userEvent;

                const dayContent = (
                    <div className="relative w-full h-full flex items-center justify-center">
                    <span>{props.date.getDate()}</span>
                    {hasUserEvent && (
                        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-chart-2"></span>
                    )}
                    </div>
                );

                if (isHoliday) {
                    return (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <AddEventDialog date={props.date} onAddEvent={onAddEvent}>
                                    {dayContent}
                                </AddEventDialog>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{holidayInfo.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                }
                
                return (
                    <AddEventDialog date={props.date} onAddEvent={onAddEvent}>
                        {dayContent}
                    </AddEventDialog>
                );
                }
            }}
            />
        </TooltipProvider>
      </CardContent>
       {selectedDate && (eventsForSelectedDay.length > 0 || holidaysByDate.has(selectedDate.toDateString())) && (
         <CardContent className="p-4 border-t border-border/50">
           <h4 className="font-semibold mb-2 text-sm">Events for {selectedDate.toLocaleDateString()}</h4>
           <ul className="space-y-1 text-xs list-disc list-inside">
             {Array.from(holidaysByDate.values()).filter(h => new Date(h.date + 'T00:00:00').toDateString() === selectedDate.toDateString()).map(h => (
                <li key={h.name} className="text-red-400">{h.name} (Holiday)</li>
             ))}
             {eventsForSelectedDay.map(event => (
               <li key={event.id}>{event.title}</li>
             ))}
           </ul>
         </CardContent>
       )}
        <style jsx global>{`
            .holiday-date {
                background-color: hsl(var(--destructive) / 0.2);
                font-weight: bold;
                color: hsl(var(--destructive) / 0.9);
            }
            :global(.dark) .holiday-date {
                 color: hsl(var(--destructive));
            }
            .holiday-date:hover {
                background-color: hsl(var(--destructive) / 0.3) !important;
            }
            .rdp-day_selected.holiday-date,
            .rdp-day_selected.holiday-date:hover {
                 background-color: hsl(var(--primary)) !important;
                 color: hsl(var(--primary-foreground)) !important;
            }
        `}</style>
    </Card>
  )
}
