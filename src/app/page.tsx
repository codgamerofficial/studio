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
import { Clock } from '@/components/climenda/Clock'
import { TimeTools } from '@/components/climenda/TimeTools'
import { CloudSun, Search, MapPin } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DailyForecast } from '@/components/climenda/DailyForecast'
import { WeatherEffects } from '@/components/climenda/WeatherEffects'


const formSchema = z.object({
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
})

export default function Home() {
  const [location, setLocation] = useState('Manila')
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
      location: "Manila",
    },
  })

  const fetchWeatherData = useCallback((loc: string) => {
    setIsFetchingWeather(true);
    startTransition(async () => {
      try {
        const data = await getWeatherData(loc);
        if (data) {
          setWeatherData(data);
          setLocation(data.locationName);
          form.setValue('location', data.locationName);
        } else {
          toast({
            variant: "destructive",
            title: "Location not found",
            description: `Could not fetch weather for ${loc}. Please try another location.`,
          });
          if (!weatherData) { // if there's no previous data, fetch for a default
              const defaultData = await getWeatherData('Manila');
              if (defaultData) {
                setWeatherData(defaultData);
                setLocation(defaultData.locationName);
                form.setValue('location', defaultData.locationName);
              }
          }
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `An error occurred while fetching weather data.`,
        });
      } finally {
        setIsFetchingWeather(false);
      }
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
    setSuggestions([]);
    setShowSuggestions(false);
    onSubmit({ location: suggestionString });
  }
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    setSuggestions([]);
    setShowSuggestions(false);
    fetchWeatherData(values.location);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-headline">
      <WeatherEffects condition={weatherData?.current.condition ?? ''} />
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CloudSun className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold tracking-tighter">Climenda</h1>
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
                              onFocus={() => {
                                if (field.value.length > 2) {
                                  setShowSuggestions(true);
                                }
                              }}
                              autoComplete="off"
                              className="w-48 sm:w-72 pr-10 bg-card border-2 border-primary/50 focus:border-primary transition-all duration-300 rounded-full" 
                            />
                            <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full hover:bg-transparent">
                              <Search className="h-5 w-5 text-primary/80 hover:text-primary" />
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
                <Card className="absolute top-full mt-2 w-full z-50 max-h-72 overflow-y-auto bg-card/90 backdrop-blur-lg border-primary/30 animate-in fade-in-0 zoom-in-95">
                    <CardContent className="p-2">
                        {suggestions.map((suggestion) => (
                            <div 
                                key={suggestion.id}
                                onMouseDown={() => handleSuggestionClick(suggestion)}
                                className="flex items-center gap-3 p-3 hover:bg-primary/20 rounded-lg cursor-pointer text-sm transition-colors duration-200"
                            >
                                <MapPin className="w-5 h-5 text-accent" />
                                <span>{suggestion.name}, {suggestion.country}</span>
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
                    <Skeleton className="h-56 w-full rounded-2xl" />
                    <Skeleton className="h-[22rem] w-full rounded-2xl" />
                    <Skeleton className="h-72 w-full rounded-2xl" />
                </div>
                <div className="space-y-8">
                    <Skeleton className="h-[22rem] w-full rounded-2xl" />
                    <Skeleton className="h-32 w-full rounded-2xl" />
                    <Skeleton className="h-32 w-full rounded-2xl" />
                </div>
            </div>
        ) : weatherData ? (
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-opacity duration-500 ${isPending ? 'opacity-30' : 'opacity-100'}`}>
                <div className="lg:col-span-2 space-y-8 animate-fade-in-up">
                    <CurrentWeather weatherData={weatherData} units={units} />
                    <DailyForecast weatherData={weatherData} units={units} />
                    <HourlyForecast weatherData={weatherData} units={units} />
                </div>
                <div className="space-y-8 animate-fade-in-up" style={{animationDelay: '200ms'}}>
                    <Clock location={weatherData?.location} />
                    <TimeTools />
                    <CalendarView 
                      initialDate={weatherData?.location.localtime ? new Date(weatherData.location.localtime) : new Date()}
                      holidays={weatherData?.holidays || []}
                    />
                    <HolidayDisplay weatherData={weatherData} />
                    <EventSuggestions weather={weatherData?.current ?? null} location={weatherData?.locationName ?? null} />
                </div>
            </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-2xl font-semibold mb-2">Could not load weather data.</h2>
              <p className="text-muted-foreground">Please try searching for a different location.</p>
          </div>
        )}
      </main>
      
      <footer className="py-6 md:px-8 md:py-0 border-t border-white/10 mt-8">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
            Built with Next.js, ShadCN/UI and Genkit. Designed with a funky vibe.
          </p>
        </div>
      </footer>
    </div>
  )
}
