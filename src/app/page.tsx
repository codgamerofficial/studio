'use client'

import React, { useState, useEffect, useTransition, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { getWeatherData, WeatherData, getAvailableLocations, LocationSuggestion } from '@/lib/weather'
import { CurrentWeather } from '@/components/climenda/CurrentWeather'
import { HourlyForecast } from '@/components/climenda/HourlyForecast'
import { CalendarView } from '@/components/climenda/CalendarView'
import { HolidayDisplay } from '@/components/climenda/HolidayDisplay'
import { EventSuggestions } from '@/components/climenda/EventSuggestions'
import { UnitSwitcher, Units } from '@/components/climenda/UnitSwitcher'
import { CloudSun, Search } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'


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
  const [isFetchingWeather, setIsFetchingWeather] = useState(true);
  const { toast } = useToast();

  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "New York",
    },
  })

  const fetchWeatherData = useCallback((loc: string) => {
    setIsFetchingWeather(true);
    startTransition(async () => {
      const data = await getWeatherData(loc);
      if (data) {
        setWeatherData(data);
        setLocation(data.location);
        form.setValue('location', data.location);
      } else {
        toast({
          variant: "destructive",
          title: "Location not found",
          description: `Could not fetch weather for ${loc}. Please try another location.`,
        });
        if (!weatherData) { // if there's no previous data, fetch for a default
            const defaultData = await getWeatherData('New York');
            setWeatherData(defaultData);
            setLocation('New York');
            form.setValue('location', 'New York');
        }
      }
      setIsFetchingWeather(false);
    });
  }, [toast, form, weatherData]);

  useEffect(() => {
    fetchWeatherData(location);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLocationInputChange = async (value: string) => {
    form.setValue('location', value);
    if (value.length > 2) {
        const filtered = await getAvailableLocations(value);
        setSuggestions(filtered);
        setShowSuggestions(true);
    } else {
        setSuggestions([]);
        setShowSuggestions(false);
    }
  }

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    const suggestionString = `${suggestion.name}, ${suggestion.country}`;
    form.setValue('location', suggestionString);
    setShowSuggestions(false);
    onSubmit({ location: suggestionString });
  }
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    setShowSuggestions(false);
    fetchWeatherData(values.location);
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
            <div ref={searchContainerRef} className="relative">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-center">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="Search location..." 
                              {...field} 
                              onChange={(e) => handleLocationInputChange(e.target.value)}
                              onFocus={() => handleLocationInputChange(field.value)}
                              autoComplete="off"
                              className="w-40 sm:w-64 pr-10" 
                            />
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
              {showSuggestions && suggestions.length > 0 && (
                <Card className="absolute top-full mt-2 w-full z-10 max-h-60 overflow-y-auto">
                    <CardContent className="p-2">
                        {suggestions.map((suggestion) => (
                            <div 
                                key={suggestion.id}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="p-2 hover:bg-accent rounded-md cursor-pointer text-sm"
                            >
                                {suggestion.name}, {suggestion.country}
                            </div>
                        ))}
                    </CardContent>
                </Card>
              )}
            </div>
            <UnitSwitcher units={units} onUnitChange={setUnits} />
          </div>
        </div>
      </header>

      <main className="container flex-1 py-8">
        {(isPending || isFetchingWeather) ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardContent className="p-6">
                            <Skeleton className="h-32 w-full" />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardContent className="p-6">
                            <Skeleton className="h-64 w-full" />
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-8">
                    <Card><CardContent className="p-6"><Skeleton className="h-72 w-full" /></CardContent></Card>
                    <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
                    <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
                </div>
            </div>
        ) : (
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
        )}
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
