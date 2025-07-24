'use client'

import { useState, useEffect } from 'react'
import { suggestEvents, SuggestEventsOutput } from '@/ai/flows/suggest-events'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Lightbulb, AlertTriangle } from 'lucide-react'
import { CurrentWeather as CurrentWeatherType } from '@/lib/weather'

interface EventSuggestionsProps {
  weather: CurrentWeatherType | null
  location: string | null
}

export function EventSuggestions({ weather, location }: EventSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SuggestEventsOutput | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (weather && location) {
      setLoading(true)
      setError(null)
      const input = {
        location: location,
        weatherDescription: weather.condition,
        temperature: weather.temp_c,
      }
      suggestEvents(input)
        .then(setSuggestions)
        .catch(() => setError("Could not fetch suggestions."))
        .finally(() => setLoading(false))
    }
  }, [weather, location])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-primary" />
          AI Event Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        )}
        {error && (
            <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                <p>{error}</p>
            </div>
        )}
        {!loading && !error && suggestions && (
          <ul className="space-y-2 list-disc list-inside text-sm">
            {suggestions.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
