'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { getMockWeatherData, WeatherData } from '@/lib/weather'
import { CurrentWeather } from '@/components/climenda/CurrentWeather'
import { HourlyForecast } from '@/components/climenda/HourlyForecast'
import { CalendarView } from '@/components/climenda/CalendarView'
import { HolidayDisplay } from '@/components/climenda/HolidayDisplay'
import { EventSuggestions } from '@/components/climenda/EventSuggestions'
import { UnitSwitcher, Units } from '@/components/climenda/UnitSwitcher'
import { CloudSun, Search } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"


const formSchema = z.object({
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
})

export default function Home() {
  const [location, setLocation] = useState('New York')
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [units, setUnits] = useState<Units>({ temp: 'C', speed: 'kmh' })
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "New York",
    },
  })

  useEffect(() => {
    startTransition(() => {
      const data = getMockWeatherData(location);
      if(data.location.toLowerCase().includes(location.toLowerCase())) {
        setWeatherData(data);
      } else {
        // Fallback for when location is not found in mock data
        const defaultData = getMockWeatherData('new york');
        setWeatherData(defaultData);
        toast({
          variant: "destructive",
          title: "Location not found",
          description: `Showing weather for New York instead. Try "London" or "Tokyo".`,
        })
      }
    });
  }, [location, toast])
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    setLocation(values.location);
    form.reset({ location: values.location });
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-headline">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CloudSun className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Climenda</h1>
          </div>
          <div className="flex items-center gap-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-center">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="Search location..." {...field} className="w-40 sm:w-64 pr-10" />
                          <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
                            <Search className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="absolute"/>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <UnitSwitcher units={units} onUnitChange={setUnits} />
          </div>
        </div>
      </header>

      <main className="container flex-1 py-8">
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
          <div className="lg:col-span-2 space-y-8">
            <CurrentWeather weatherData={weatherData} units={units} />
            <HourlyForecast weatherData={weatherData} units={units} />
          </div>
          <div className="space-y-8">
            <CalendarView />
            <HolidayDisplay weatherData={weatherData} />
            <EventSuggestions weather={weatherData?.current ?? null} location={weatherData?.location ?? null} />
          </div>
        </div>
      </main>
      
      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
            Built with Next.js, ShadCN/UI and Genkit.
          </p>
        </div>
      </footer>
    </div>
  )
}
