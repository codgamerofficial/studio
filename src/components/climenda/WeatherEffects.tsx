
'use client'

import React, { useEffect, useState, useMemo } from 'react';

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
    return <div className="lightning" />;
});
Thunderstorm.displayName = 'Thunderstorm';

const Clouds = React.memo(() => {
    return (
        <>
            <div id="cloud1" className="cloud"></div>
            <div id="cloud2" className="cloud"></div>
            <div id="cloud3" className="cloud"></div>
        </>
    );
});
Clouds.displayName = 'Clouds';

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
    
    const lowerCaseCondition = condition.toLowerCase();
    const isThundering = lowerCaseCondition.includes('thunder');
    const isRaining = lowerCaseCondition.includes('rain') || isThundering;
    const isCloudy = isRaining || isThundering || lowerCaseCondition.includes('cloud') || lowerCaseCondition.includes('overcast');

    if (!isClient) return null;

    return (
        <div key={key} className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 overflow-hidden">
            {isCloudy && <Clouds />}
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
                    0% { opacity: 0; }
                    50% { opacity: 0; }
                    51% { opacity: 0.2; }
                    52% { opacity: 0; }
                    53% { opacity: 0.5; }
                    54% { opacity: 0; }
                    100% { opacity: 0; }
                }
                .lightning {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: #fff;
                    opacity: 0;
                    animation: flash 4s infinite;
                }

                .cloud {
                    position: absolute;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    filter: blur(10px);
                    animation-name: drift;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                    opacity: 0;
                }

                #cloud1 {
                    width: 200px;
                    height: 60px;
                    top: 20px;
                    animation-duration: 20s;
                    animation-delay: -10s;
                }

                #cloud2 {
                    width: 300px;
                    height: 100px;
                    top: 50px;
                    animation-duration: 30s;
                }
                
                #cloud3 {
                    width: 250px;
                    height: 80px;
                    top: 80px;
                    animation-duration: 25s;
                    animation-delay: -15s;
                }

                @keyframes drift {
                    from {
                        transform: translateX(-250px);
                        opacity: 0;
                    }
                    25% {
                        opacity: 1;
                    }
                    75% {
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100vw);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}
