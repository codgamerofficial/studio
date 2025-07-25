'use client'

import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
  Annotation
} from 'react-simple-maps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import { LocationInfo } from '@/lib/weather';

interface WorldMapProps {
  location: LocationInfo;
}

export function WorldMap({ location }: WorldMapProps) {
  const coordinates: [number, number] = [location.lon, location.lat];
  const locationName = `${location.name}, ${location.region}`;
  
  return (
    <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Location Map
            </CardTitle>
        </CardHeader>
      <CardContent className="p-0 h-64 relative">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            rotate: [-10, 0, 0],
            scale: 100
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup center={coordinates} zoom={8}>
            <Geographies geography={'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isSelectedCountry = geo.properties.name === location.country;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isSelectedCountry ? "hsl(var(--accent))" : "hsl(var(--muted))"}
                      stroke="hsl(var(--background))"
                      strokeWidth={0.2}
                      style={{
                        default: { outline: 'none' },
                        hover: { fill: isSelectedCountry ? "hsl(var(--accent))" : "hsl(var(--primary) / 0.5)", outline: 'none' },
                        pressed: { fill: "hsl(var(--primary))", outline: 'none' },
                      }}
                    />
                  )
                })
              }
            </Geographies>
            <Marker coordinates={coordinates}>
              <circle r={2} fill="hsl(var(--primary))" stroke="#fff" strokeWidth={0.5} />
            </Marker>
            <Annotation
              subject={coordinates}
              dx={-15}
              dy={-30}
              connectorProps={{
                stroke: "hsl(var(--foreground))",
                strokeWidth: 1,
                strokeLinecap: "round"
              }}
            >
              <text x="-8" textAnchor="end" alignmentBaseline="middle" fill="hsl(var(--foreground))" className="text-xs font-bold">
                {locationName}
              </text>
              <text x="-8" textAnchor="end" alignmentBaseline="middle" fill="hsl(var(--foreground))" dy="12" className="text-xs">
                {location.country}
              </text>
            </Annotation>
          </ZoomableGroup>
        </ComposableMap>
      </CardContent>
    </Card>
  );
}
