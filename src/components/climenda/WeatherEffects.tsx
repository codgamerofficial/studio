
'use client'

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

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

const Clouds = React.memo(() => {
    return (
        <div className="clouds-container">
            <div className="cloud cloud1"></div>
            <div className="cloud cloud2"></div>
            <div className="cloud cloud3"></div>
        </div>
    );
});
Clouds.displayName = 'Clouds';


interface WeatherEffectsProps {
    condition: string;
}

export function WeatherEffects({ condition }: WeatherEffectsProps) {
    const [isClient, setIsClient] = useState(false);
    const [key, setKey] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const rainAudioRef = useRef<HTMLAudioElement>(null);
    const thunderAudioRef = useRef<HTMLAudioElement>(null);
    const thunderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        setKey(prevKey => prevKey + 1);
    }, [condition]);
    
    const lowerCaseCondition = condition.toLowerCase();
    const isThundering = lowerCaseCondition.includes('thunder') || lowerCaseCondition.includes('storm');
    const isRaining = lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('drizzle') || isThundering;
    const isCloudy = isRaining || isThundering || lowerCaseCondition.includes('cloud') || lowerCaseCondition.includes('overcast') || lowerCaseCondition.includes('mist');

    const playAudio = useCallback((ref: React.RefObject<HTMLAudioElement>) => {
        if (ref.current) {
            ref.current.play().catch(error => {
                console.warn("Audio autoplay was prevented. Please interact with the page to enable sound.");
            });
        }
    }, []);
    
    const pauseAudio = useCallback((ref: React.RefObject<HTMLAudioElement>) => {
        if (ref.current) {
            ref.current.pause();
            ref.current.currentTime = 0;
        }
    }, []);

    const scheduleThunder = useCallback(() => {
        if (thunderTimeoutRef.current) {
            clearTimeout(thunderTimeoutRef.current);
        }
        const play = () => {
            if (thunderAudioRef.current) {
                playAudio(thunderAudioRef);
            }
            const delay = 5000 + Math.random() * 10000; // Random delay between 5 and 15 seconds
            thunderTimeoutRef.current = setTimeout(play, delay);
        };
        play();
    }, [playAudio]);


    useEffect(() => {
        if (!isClient) return;

        if (isRaining) {
             playAudio(rainAudioRef);
        } else {
             pauseAudio(rainAudioRef);
        }

        if (isThundering) {
            scheduleThunder();
        } else {
            if (thunderTimeoutRef.current) clearTimeout(thunderTimeoutRef.current);
            pauseAudio(thunderAudioRef);
        }

        return () => {
            if (thunderTimeoutRef.current) clearTimeout(thunderTimeoutRef.current);
        }

    }, [isRaining, isThundering, isClient, playAudio, pauseAudio, scheduleThunder]);

    const handleUnmute = () => {
        setIsMuted(false);
        if (rainAudioRef.current) rainAudioRef.current.muted = false;
        if (thunderAudioRef.current) thunderAudioRef.current.muted = false;

        if (isRaining) playAudio(rainAudioRef);
        if (isThundering) {
            // Restart the scheduled thunder to play immediately on unmute
            scheduleThunder();
        }
    }
    
    const handleMute = () => {
        setIsMuted(true);
        if (rainAudioRef.current) rainAudioRef.current.muted = true;
        if (thunderAudioRef.current) thunderAudioRef.current.muted = true;
    }


    if (!isClient) return null;

    const showEffects = isRaining || isThundering || isCloudy;

    return (
        <div key={key} className="fixed top-0 left-0 w-full h-1/2 pointer-events-none z-[9999] overflow-hidden">
            {isCloudy && <Clouds />}
            {isRaining && <Rain />}
            {isThundering && <Thunderstorm />}
            
            <audio ref={rainAudioRef} src="https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg" loop muted preload="auto"></audio>
            <audio ref={thunderAudioRef} src="https://actions.google.com/sounds/v1/weather/thunder_crack.ogg" muted preload="auto"></audio>

            {showEffects && (
                <div className="fixed bottom-5 right-5 pointer-events-auto">
                    {isMuted ? (
                        <Button onClick={handleUnmute} variant="outline" size="icon" className="rounded-full bg-background/50 backdrop-blur-sm">
                            <VolumeX className="w-5 h-5" />
                            <span className="sr-only">Unmute</span>
                        </Button>
                    ) : (
                        <Button onClick={handleMute} variant="outline" size="icon" className="rounded-full bg-background/50 backdrop-blur-sm">
                            <Volume2 className="w-5 h-5" />
                             <span className="sr-only">Mute</span>
                        </Button>
                    )}
                </div>
            )}


            <style jsx global>{`
                @keyframes fall {
                    to {
                        transform: translateY(50vh);
                        opacity: 0;
                    }
                }
                .rain-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
                .raindrop {
                    position: absolute;
                    bottom: 100%;
                    width: 1.5px;
                    height: 80px;
                    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.3));
                    animation: fall linear infinite;
                    transform: rotate(10deg);
                }

                @keyframes professional-flash {
                    0% { opacity: 0; }
                    90% { opacity: 0; }
                    91% { opacity: 0.1; }
                    92% { opacity: 0.6; }
                    93% { opacity: 0.2; }
                    94% { opacity: 0.8; }
                    95% { opacity: 0; }
                    100% { opacity: 0; }
                }
                .lightning-flash {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 50vh;
                    background: radial-gradient(ellipse at center, #d0d5e0 0%,#a4a9b5 40%,#7a808f 100%);
                    opacity: 0;
                    animation: professional-flash 6s ease-in-out infinite;
                }

                .clouds-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }

                .cloud {
                    position: absolute;
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 50%;
                    filter: blur(12px);
                    opacity: 0;
                    animation-name: drift;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }

                .cloud::before, .cloud::after {
                    content: '';
                    position: absolute;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                }

                .cloud1 {
                    width: 250px;
                    height: 80px;
                    top: 5%;
                    animation-duration: 40s;
                    animation-delay: -10s;
                    animation-name: drift, fadeIn;
                }

                .cloud1::before {
                    width: 150px;
                    height: 100px;
                    top: -50px;
                    left: 50px;
                }
                 .cloud1::after {
                    width: 120px;
                    height: 70px;
                    top: -35px;
                    right: 40px;
                }
                
                .cloud2 {
                    width: 350px;
                    height: 120px;
                    top: 15%;
                    animation-duration: 55s;
                     animation-delay: -25s;
                    animation-name: drift, fadeIn;
                }

                .cloud2::before {
                    width: 200px;
                    height: 140px;
                    top: -70px;
                    left: 70px;
                }

                .cloud2::after {
                    width: 180px;
                    height: 110px;
                    top: -55px;
                    right: 55px;
                }

                .cloud3 {
                    width: 300px;
                    height: 100px;
                    top: 25%;
                    animation-duration: 30s;
                     animation-delay: 0s;
                    animation-name: drift, fadeIn;
                }
                
                .cloud3::before {
                    width: 180px;
                    height: 120px;
                    top: -60px;
                    left: 60px;
                }
                
                @keyframes fadeIn {
                    0% { opacity: 0; }
                    10% { opacity: 0.9; }
                    90% { opacity: 0.9; }
                    100% { opacity: 0; }
                }

                @keyframes drift {
                    from {
                        transform: translateX(-200%);
                    }
                    to {
                        transform: translateX(200%);
                    }
                }

            `}</style>
        </div>
    );

    