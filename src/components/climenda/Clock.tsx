'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';

export function Clock() {
  const [time, setTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime({
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds()
      });
    };
    
    updateClock(); // Set initial time
    const timerId = setInterval(updateClock, 1000);
    
    return () => clearInterval(timerId);
  }, []);

  const hoursDegrees = (time.hours % 12 + time.minutes / 60) * 30;
  const minutesDegrees = (time.minutes + time.seconds / 60) * 6;
  const secondsDegrees = time.seconds * 6;

  return (
    <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
      <CardContent className="p-4 flex items-center justify-center">
        <div className="relative w-48 h-48 rounded-full border-4 border-primary bg-background shadow-inner">
          {/* Clock face */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary z-20"></div>
          </div>
          
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`hour-marker-${i}`}
              className="absolute w-full h-full"
              style={{ transform: `rotate(${i * 30}deg)` }}
            >
              <div className={cn(
                "absolute top-[6px] left-1/2 -ml-0.5 h-3 w-1 rounded-full",
                i % 3 === 0 ? "bg-accent" : "bg-muted-foreground/50"
              )}></div>
            </div>
          ))}

          {/* Hour hand */}
          <div
            className="absolute bottom-1/2 left-1/2 w-1.5 h-[28%] bg-foreground rounded-t-full origin-bottom transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-50%) rotate(${hoursDegrees}deg)` }}
          />
          
          {/* Minute hand */}
          <div
            className="absolute bottom-1/2 left-1/2 w-1 h-[40%] bg-foreground/80 rounded-t-full origin-bottom transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-50%) rotate(${minutesDegrees}deg)` }}
          />
          
          {/* Second hand */}
          <div
            className="absolute bottom-1/2 left-1/2 w-0.5 h-[45%] bg-primary origin-bottom transition-transform duration-200"
            style={{ transform: `translateX(-50%) rotate(${secondsDegrees}deg)` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
