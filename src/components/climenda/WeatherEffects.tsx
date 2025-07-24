'use client'

import React, { useEffect, useState, useMemo, useRef } from 'react';
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

    const playAudio = (ref: React.RefObject<HTMLAudioElement>) => {
        if (ref.current) {
            ref.current.play().catch(error => {
                // Autoplay was prevented. User needs to interact with the page first.
                console.warn("Audio autoplay was prevented. Please interact with the page to enable sound.");
            });
        }
    };
    
    const pauseAudio = (ref: React.RefObject<HTMLAudioElement>) => {
        if (ref.current) {
            ref.current.pause();
            ref.current.currentTime = 0;
        }
    };

    useEffect(() => {
        if (!isClient) return;

        if (isRaining) {
             playAudio(rainAudioRef);
        } else {
             pauseAudio(rainAudioRef);
        }

        if (isThundering) {
            playAudio(thunderAudioRef);
        } else {
            pauseAudio(thunderAudioRef);
        }

    }, [isRaining, isThundering, isClient]);

    const handleUnmute = () => {
        setIsMuted(false);
        if (rainAudioRef.current) rainAudioRef.current.muted = false;
        if (thunderAudioRef.current) thunderAudioRef.current.muted = false;

        // Re-trigger play in case it was blocked
        if (isRaining) playAudio(rainAudioRef);
        if (isThundering) playAudio(thunderAudioRef);
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
            <audio ref={thunderAudioRef} src="https://actions.google.com/sounds/v1/weather/thunder_crack.ogg" loop muted preload="auto"></audio>

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
                    width: 1px;
                    height: 60px;
                    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.25));
                    animation: fall linear infinite;
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
                    animation: professional-flash 5s linear infinite;
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
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    filter: blur(10px);
                    opacity: 0.8;
                }

                .cloud::before, .cloud::after {
                    content: '';
                    position: absolute;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    filter: blur(5px);
                }

                .cloud1 {
                    width: 200px;
                    height: 60px;
                    top: 10%;
                    animation: drift 25s linear infinite reverse;
                }

                .cloud1::before {
                    width: 120px;
                    height: 80px;
                    top: -40px;
                    left: 40px;
                }
                 .cloud1::after {
                    width: 100px;
                    height: 60px;
                    top: -30px;
                    right: 30px;
                }
                
                .cloud2 {
                    width: 300px;
                    height: 100px;
                    top: 20%;
                    animation: drift 35s linear infinite;
                }

                .cloud2::before {
                    width: 180px;
                    height: 120px;
                    top: -60px;
                    left: 60px;
                }

                .cloud2::after {
                    width: 150px;
                    height: 90px;
                    top: -45px;
                    right: 45px;
                }

                .cloud3 {
                    width: 250px;
                    height: 80px;
                    top: 5%;
                    animation: drift 45s linear infinite reverse;
                }
                
                .cloud3::before {
                    width: 150px;
                    height: 100px;
                    top: -50px;
                    left: 50px;
                }

                @keyframes drift {
                    from {
                        transform: translateX(-150%);
                    }
                    to {
                        transform: translateX(150%);
                    }
                }

            `}</style>
        </div>
    );
}
