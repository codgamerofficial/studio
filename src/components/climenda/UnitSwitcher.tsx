'use client'

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"

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
    <div className="flex gap-4">
      <div className="flex items-center space-x-2">
        <RadioGroup
          value={units.temp}
          onValueChange={handleTempChange}
          className="flex"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="C" id="celsius" />
            <Label htmlFor="celsius">°C</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="F" id="fahrenheit" />
            <Label htmlFor="fahrenheit">°F</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center space-x-2">
        <RadioGroup
          value={units.speed}
          onValueChange={handleSpeedChange}
          className="flex"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="kmh" id="kmh" />
            <Label htmlFor="kmh">km/h</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mph" id="mph" />
            <Label htmlFor="mph">mph</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
