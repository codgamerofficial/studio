'use client'

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const Rain = () => {
    const [raindrops, setRaindrops] = useState<JSX.Element[]>([]);
  
    useEffect(() => {
      const createRaindrops = () => {
        const drops = Array.from({ length: 100 }).map((_, i) => {
          const style = {
            left: `${Math.random() * 100}%`,
            animationDuration: `${0.5 + Math.random() * 0.5}s`,
            animationDelay: `${Math.random() * 5}s`,
          };
          return <div key={i} className="raindrop" style={style} />;
        });
        setRaindrops(drops);
      };
  
      createRaindrops();
    }, []);
  
    return <div className="rain-container">{raindrops}</div>;
};

const Thunderstorm = () => {
    return <div className="lightning-flash" />;
};

interface WeatherEffectsProps {
    condition: string;
}

export function WeatherEffects({ condition }: WeatherEffectsProps) {
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
    }, []);
    
    if (!isClient) return null;
    
    const lowerCaseCondition = condition.toLowerCase();
    const isRaining = lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('drizzle');
    const isThundering = lowerCaseCondition.includes('thunder') || lowerCaseCondition.includes('storm');

    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]">
            {isRaining && <Rain />}
            {isThundering && <Thunderstorm />}
            <style jsx global>{`
                @keyframes fall {
                    to {
                        transform: translateY(100vh);
                    }
                }
                .rain-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }
                .raindrop {
                    position: absolute;
                    bottom: 100%;
                    width: 1px;
                    height: 60px;
                    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.25));
                    animation: fall linear infinite;
                }

                @keyframes flash {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 0.3; }
                }
                .lightning-flash {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: #a4a9b5;
                    opacity: 0;
                    animation: flash 4s infinite;
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    );
}
