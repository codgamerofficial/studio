'use client'

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

export type Units = {
  temp: "C" | "F"
  speed: "kmh" | "mph"
}

interface UnitSwitcherProps {
  units: Units
  onUnitChange: (units: Units) => void
}

export function UnitSwitcher({ units, onUnitChange }: UnitSwitcherProps) {
  const handleTempChange = (value: "C" | "F") => {
    onUnitChange({ ...units, temp: value })
  }

  const handleSpeedChange = (value: "kmh" | "mph") => {
    onUnitChange({ ...units, speed: value })
  }

  return (
    <div className="flex items-center gap-2 p-1 rounded-full bg-card border-border border">
      <div className="flex items-center">
        <RadioGroup
          value={units.temp}
          onValueChange={handleTempChange}
          className="flex"
        >
          <div className="flex items-center">
            <RadioGroupItem value="C" id="celsius" className="sr-only" />
            <Label htmlFor="celsius" className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${units.temp === 'C' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
              °C
            </Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="F" id="fahrenheit" className="sr-only" />
            <Label htmlFor="fahrenheit" className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${units.temp === 'F' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
              °F
            </Label>
          </div>
        </RadioGroup>
      </div>
      <Separator orientation="vertical" className="h-6" />
      <div className="flex items-center">
        <RadioGroup
          value={units.speed}
          onValueChange={handleSpeedChange}
          className="flex"
        >
          <div className="flex items-center">
            <RadioGroupItem value="kmh" id="kmh" className="sr-only" />
            <Label htmlFor="kmh" className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${units.speed === 'kmh' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
              km/h
            </Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="mph" id="mph" className="sr-only" />
            <Label htmlFor="mph" className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${units.speed === 'mph' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
              mph
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
