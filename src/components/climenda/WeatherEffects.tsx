
'use client'

import React, { useEffect, useState, useMemo } from 'react';

const Rain = React.memo(() => {
    const raindrops = useMemo(() => Array.from({ length: 150 }).map((_, i) => {
        const style = {
          left: `${Math.random() * 110 - 5}%`,
          top: `${Math.random() * -50}%`,
          animationDuration: `${0.6 + Math.random() * 0.4}s`,
          animationDelay: `${Math.random() * 5}s`,
        };
        return <div key={i} className="raindrop" style={style} />;
    }), []);
  
    return <>{raindrops}</>;
});
Rain.displayName = 'Rain';

const Thunderstorm = React.memo(() => {
    return <div className="lightning" />;
});
Thunderstorm.displayName = 'Thunderstorm';

const Wind = React.memo(() => {
    const particles = useMemo(() => Array.from({ length: 25 }).map((_, i) => {
        const style = {
            left: `${-10 + Math.random() * -50}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${1 + Math.random() * 2}s`,
            animationDelay: `${Math.random() * 4}s`,
            opacity: `${0.2 + Math.random() * 0.5}`,
            transform: `scale(${0.5 + Math.random() * 0.5})`,
        };
        return <div key={i} className="wind-particle" style={style} />;
    }), []);

    return <>{particles}</>;
});
Wind.displayName = 'Wind';

const Clouds = React.memo(() => {
    return (
        <div id="clouds">
            <div className="cloud x1"></div>
            <div className="cloud x2"></div>
            <div className="cloud x3"></div>
            <div className="cloud x4"></div>
            <div className="cloud x5"></div>
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

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        setKey(prevKey => prevKey + 1);
    }, [condition]);
    
    const lowerCaseCondition = condition.toLowerCase();
    const isThundering = lowerCaseCondition.includes('thunder');
    const isRaining = lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('drizzle') || isThundering;
    const isCloudy = isRaining || isThundering || lowerCaseCondition.includes('cloud') || lowerCaseCondition.includes('overcast') || lowerCaseCondition.includes('mist');
    const isWindy = lowerCaseCondition.includes('windy');
    
    if (!isClient) return null;

    return (
        <div key={key} className="fixed top-0 left-0 w-full h-[50vh] pointer-events-none z-50 overflow-hidden sky-background">
            {isCloudy && <Clouds />}
            {isRaining && <Rain />}
            {isThundering && <Thunderstorm />}
            {isWindy && <Wind />}
            <style jsx global>{`
                @keyframes fall {
                    to {
                        transform: translate(-30px, 110vh);
                    }
                }
                .raindrop {
                    position: absolute;
                    width: 1.5px;
                    height: 70px;
                    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.3));
                    animation: fall linear infinite;
                    transform-origin: top left;
                    will-change: transform;
                }

                @keyframes flash {
                    0% { opacity: 0; }
                    48% { opacity: 0; }
                    50% { opacity: 0.2; }
                    51% { opacity: 0; }
                    52% { opacity: 0.6; }
                    53% { opacity: 0; }
                    54% { opacity: 0.1; }
                    55% { opacity: 0; }
                    100% { opacity: 0; }
                }
                .lightning {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100%;
                    background: #fff;
                    opacity: 0;
                    animation: flash 5s infinite;
                    will-change: opacity;
                }
                
                #clouds{
                    padding: 50px 0;
                    z-index: -1;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }

                .cloud {
                    width: 200px; height: 60px;
                    background: #fff;
                    border-radius: 200px;
                    position: relative; 
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }

                .cloud:before, .cloud:after {
                    content: '';
                    position: absolute; 
                    background: #fff;
                    width: 100px; height: 80px;
                    top: -15px; left: 10px;
                    border-radius: 100px;
                    transform: rotate(30deg);
                }

                .cloud:after {
                    width: 120px; height: 120px;
                    top: -55px; left: auto; right: 15px;
                }
                
                .x1 {
                    animation: moveclouds 15s linear infinite;
                    opacity: 0.3;
                }

                .x2 {
                    left: 200px;
                    transform: scale(0.6);
                    opacity: 0.6; 
                    animation: moveclouds 25s linear infinite;
                }

                .x3 {
                    left: -250px; top: -200px;
                    transform: scale(0.8);
                    opacity: 0.8; 
                    animation: moveclouds 20s linear infinite;
                }
                
                .x4 {
                    left: 470px; top: -250px;
                    transform: scale(0.75);
                    opacity: 0.75;
                    animation: moveclouds 18s linear infinite;
                }

                .x5 {
                    left: -150px; top: -150px;
                    transform: scale(0.8);
                    opacity: 0.8; 
                    animation: moveclouds 20s linear infinite;
                }

                @keyframes moveclouds {
                    0% {margin-left: 1000px;}
                    100% {margin-left: -1000px;}
                }

                @keyframes blow {
                    to {
                        transform: translateX(110vw) rotate(360deg);
                    }
                }

                .wind-particle {
                    position: absolute;
                    width: 8px;
                    height: 5px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    animation: blow ease-in-out infinite;
                    will-change: transform;
                }

                @keyframes animate-sky {
                    0% { background-position: 0% 0%; }
                    100% { background-position: 100% 100%; }
                }

                .sky-background {
                    background: linear-gradient(45deg, hsl(var(--primary)/0.1), hsl(var(--accent)/0.1), hsl(var(--primary)/0.1));
                    background-size: 400% 400%;
                    animation: animate-sky 30s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
