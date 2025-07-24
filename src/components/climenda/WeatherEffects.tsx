'use client'

import React, { useEffect, useState, useMemo, useRef } from 'react';

const Rain = React.memo(() => {
    const raindrops = useMemo(() => Array.from({ length: 100 }).map((_, i) => {
        const style = {
          left: `${Math.random() * 100}%`,
          animationDuration: `${0.5 + Math.random() * 0.5}s`,
          animationDelay: `${Math.random() * 5}s`,
        };
        return <div key={i} className="raindrop" style={style} />;
    }), []);
  
    return <div className="rain-container">{raindrops}</div>;
});
Rain.displayName = 'Rain';

const Thunderstorm = React.memo(() => {
    return <div className="lightning-flash" />;
});
Thunderstorm.displayName = 'Thunderstorm';


interface WeatherEffectsProps {
    condition: string;
}

export function WeatherEffects({ condition }: WeatherEffectsProps) {
    const [isClient, setIsClient] = useState(false);
    const [key, setKey] = useState(0);
    const rainAudioRef = useRef<HTMLAudioElement>(null);
    const thunderAudioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        setKey(prevKey => prevKey + 1);
    }, [condition]);
    
    const lowerCaseCondition = condition.toLowerCase();
    const isThundering = lowerCaseCondition.includes('thunder') || lowerCaseCondition.includes('storm');
    const isRaining = lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('drizzle') || isThundering;

    useEffect(() => {
        if (!isClient) return;

        const playAudio = (ref: React.RefObject<HTMLAudioElement>) => {
            ref.current?.play().catch(error => {
                // Autoplay is often blocked by browsers, user interaction is needed.
                // We can ignore this error silently as it's a decorative feature.
            });
        };

        const pauseAudio = (ref: React.RefObject<HTMLAudioElement>) => {
            ref.current?.pause();
        };

        if (isRaining && rainAudioRef.current) {
            rainAudioRef.current.loop = true;
            playAudio(rainAudioRef);
        } else {
            pauseAudio(rainAudioRef);
        }

        if (isThundering && thunderAudioRef.current) {
            thunderAudioRef.current.loop = true;
            playAudio(thunderAudioRef);
        } else {
            pauseAudio(thunderAudioRef);
        }

    }, [isRaining, isThundering, isClient]);

    if (!isClient) return null;

    return (
        <div key={key} className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]">
            {isRaining && <Rain />}
            {isThundering && <Thunderstorm />}
            
            <audio ref={rainAudioRef} src="https://cdn.pixabay.com/download/audio/2022/08/17/audio_342d7a221f.mp3" preload="auto"></audio>
            <audio ref={thunderAudioRef} src="https://cdn.pixabay.com/download/audio/2022/03/10/audio_e56f4e3ece.mp3" preload="auto"></audio>

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
