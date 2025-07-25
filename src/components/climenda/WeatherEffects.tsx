
'use client'

import React, { useEffect, useState } from 'react';

interface WeatherEffectsProps {
    condition: string;
}

export function WeatherEffects({ condition }: WeatherEffectsProps) {
    const [isClient, setIsClient] = useState(false);
    const [key, setKey] = useState(0);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        setKey(prevKey => prevKey + 1);
    }, [condition]);
    
    if (!isClient) return null;

    return (
        <div key={key} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden sky-background">
            <style jsx global>{`
                @keyframes animate-sky {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .sky-background {
                    background: linear-gradient(-45deg, hsl(var(--primary)/0.1), hsl(var(--accent)/0.15), hsl(var(--primary)/0.1), hsl(var(--accent)/0.1));
                    background-size: 400% 400%;
                    animation: animate-sky 30s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
