
'use client'

import React, { useEffect, useState, useMemo } from 'react';

const Rain = React.memo(() => {
    const raindrops = useMemo(() => Array.from({ length: 150 }).map((_, i) => {
        const style = {
          left: `${Math.random() * 110 - 5}%`, // Allow rain to go slightly off-screen
          top: `${Math.random() * -50}%`, // Start raindrops above the view
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
            left: `${-10 + Math.random() * -50}%`, // Start off-screen to the left
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
        <div className="clouds-container">
            <div className="cloud-layer cloud-layer-1"></div>
            <div className="cloud-layer cloud-layer-2"></div>
            <div className="cloud-layer cloud-layer-3"></div>
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
        <div key={key} className="fixed top-0 left-0 w-full h-[50vh] pointer-events-none z-50 overflow-hidden bg-gradient-to-b from-primary/10 to-transparent">
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

                @keyframes drift {
                    from {
                        transform: translateX(-100%);
                    }
                    to {
                        transform: translateX(100%);
                    }
                }
                
                .clouds-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }

                .cloud-layer {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 200%;
                    height: 100%;
                    background-repeat: repeat-x;
                    animation: drift linear infinite;
                    will-change: transform;
                }

                .cloud-layer-1 {
                    background-image: url('https://i.postimg.cc/qR4g0pNH/clouds-1.png');
                    animation-duration: 60s;
                    opacity: 0.3;
                    filter: blur(2px);
                }

                .cloud-layer-2 {
                    background-image: url('https://i.postimg.cc/PqV8H2tX/clouds-2.png');
                    animation-duration: 90s;
                    animation-direction: reverse;
                    opacity: 0.2;
                    filter: blur(4px);
                }
                
                .cloud-layer-3 {
                    background-image: url('https://i.postimg.cc/44rZdZtW/clouds-3.png');
                    animation-duration: 120s;
                    opacity: 0.15;
                    filter: blur(6px);
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
            `}</style>
        </div>
    );
}
