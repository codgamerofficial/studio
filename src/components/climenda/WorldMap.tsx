'use client'

import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';

const geoUrl =
  'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json';

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
            scale: 80,
            center: [0, 20],
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#EAEAEC20"
                  stroke="#FFFFFF40"
                  strokeWidth={0.5}
                />
              ))
            }
          </Geographies>
          <Marker coordinates={coordinates}>
            <circle r={5} fill="hsl(var(--primary))" stroke="#fff" strokeWidth={2} />
          </Marker>
        </ComposableMap>
      </CardContent>
    </Card>
  );
}
