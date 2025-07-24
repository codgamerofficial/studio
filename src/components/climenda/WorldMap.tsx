'use client'

import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';

const geoUrl =
  'https://raw.githubusercontent.com/deldersveld/topojson/master/world-110m.json';

interface WorldMapProps {
  coordinates: [number, number];
}

export function WorldMap({ coordinates }: WorldMapProps) {
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
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="hsl(var(--muted))"
                    stroke="hsl(var(--background))"
                    strokeWidth={0.2}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>
            <Marker coordinates={coordinates}>
              <circle r={2} fill="hsl(var(--primary))" stroke="#fff" strokeWidth={0.5} />
            </Marker>
          </ZoomableGroup>
        </ComposableMap>
      </CardContent>
    </Card>
  );
}
