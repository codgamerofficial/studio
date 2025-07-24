"use client"

import type { LucideProps } from "lucide-react";
import { Sun, Cloud, CloudRain, Cloudy, CloudSnow, Wind, CloudSun, CloudLightning, Thermometer } from 'lucide-react';
import { cn } from "@/lib/utils";

interface WeatherIconProps extends Omit<LucideProps, 'className'> {
    condition: string;
    className?: string;
}

export function WeatherIcon({ condition, className, ...props }: WeatherIconProps) {
    const lowerCaseCondition = condition.toLowerCase();

    const Icon = (() => {
        if (lowerCaseCondition.includes('sunny') || lowerCaseCondition.includes('clear')) {
            return Sun;
        }
        if (lowerCaseCondition.includes('partly cloudy')) {
            return CloudSun;
        }
        if (lowerCaseCondition.includes('cloudy') || lowerCaseCondition.includes('overcast')) {
            return Cloud;
        }
        if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('drizzle')) {
            return CloudRain;
        }
        if (lowerCaseCondition.includes('thunder') || lowerCaseCondition.includes('storm')) {
            return CloudLightning;
        }
        if (lowerCaseCondition.includes('snow') || lowerCaseCondition.includes('sleet') || lowerCaseCondition.includes('blizzard')) {
            return CloudSnow;
        }
        if (lowerCaseCondition.includes('wind')) {
            return Wind;
        }
        return Cloudy; // Default icon
    })();

    return <Icon className={cn("text-primary", className)} {...props} />;
}
