
'use client'

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface WeatherEffectsProps {
    condition: string;
}

const Rain = () => (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
            <div
                key={i}
                className="absolute bg-gradient-to-b from-transparent to-blue-300/50 animate-fall"
                style={{
                    left: `${Math.random() * 100}%`,
                    width: `${1 + Math.random()}px`,
                    height: `${20 + Math.random() * 40}px`,
                    animationDelay: `${Math.random()}s`,
                    animationDuration: `${0.5 + Math.random() * 0.5}s`,
                }}
            />
        ))}
        <style jsx>{`
            @keyframes fall {
                from {
                    transform: translateY(-10vh) rotate(35deg);
                }
                to {
                    transform: translateY(105vh) rotate(35deg);
                }
            }
            .animate-fall {
                animation-name: fall;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }
        `}</style>
    </div>
);


const Thunder = () => (
    <>
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 animate-lightning-bg" />
        <style jsx>{`
            @keyframes lightning-bg {
                0%, 100% { opacity: 0; }
                5% { opacity: 0.2; }
                10% { opacity: 0; }
                12% { opacity: 0.1; }
                20% { opacity: 0; }
            }
            .animate-lightning-bg {
                animation: lightning-bg 7s linear infinite;
                animation-delay: 2s;
            }
        `}</style>
    </>
);

const Clouds = () => (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div id="cloud-group-1" className="absolute top-0 w-[200%] h-full animate-cloud-drift-1">
            <div className="cloud cloud-1"></div>
            <div className="cloud cloud-2"></div>
            <div className="cloud cloud-3"></div>
        </div>
        <div id="cloud-group-2" className="absolute top-0 w-[200%] h-full animate-cloud-drift-2">
            <div className="cloud cloud-4"></div>
            <div className="cloud cloud-5"></div>
            <div className="cloud cloud-6"></div>
        </div>
        <style jsx>{`
            .cloud {
                position: absolute;
                background: #fff;
                border-radius: 50%;
                opacity: 0.2;
                filter: blur(5px);
            }
            .cloud::before, .cloud::after {
                content: '';
                position: absolute;
                background: #fff;
                border-radius: 50%;
            }
            .cloud-1 { top: 10%; left: 5%; width: 100px; height: 30px; }
            .cloud-1::before { top: -15px; left: 10px; width: 50px; height: 50px; }
            .cloud-1::after { top: -25px; left: 40px; width: 60px; height: 60px; }
            
            .cloud-2 { top: 20%; left: 25%; width: 150px; height: 45px; }
            .cloud-2::before { top: -20px; left: 20px; width: 70px; height: 70px; }
            .cloud-2::after { top: -30px; left: 60px; width: 80px; height: 80px; }

            .cloud-3 { top: 15%; left: 70%; width: 120px; height: 35px; }
            .cloud-3::before { top: -18px; left: 15px; width: 55px; height: 55px; }
            .cloud-3::after { top: -28px; left: 50px; width: 70px; height: 70px; }

            .cloud-4 { top: 30%; left: 10%; width: 130px; height: 40px; opacity: 0.3; }
            .cloud-4::before { top: -18px; left: 15px; width: 60px; height: 60px; }
            .cloud-4::after { top: -28px; left: 55px; width: 75px; height: 75px; }

            .cloud-5 { top: 40%; left: 50%; width: 160px; height: 50px; opacity: 0.25; }
            .cloud-5::before { top: -25px; left: 25px; width: 80px; height: 80px; }
            .cloud-5::after { top: -35px; left: 70px; width: 90px; height: 90px; }
            
            .cloud-6 { top: 35%; left: 85%; width: 110px; height: 30px; opacity: 0.3; }
            .cloud-6::before { top: -15px; left: 10px; width: 50px; height: 50px; }
            .cloud-6::after { top: -25px; left: 40px; width: 60px; height: 60px; }


            @keyframes cloud-drift {
                from { transform: translateX(0%); }
                to { transform: translateX(-100%); }
            }
            .animate-cloud-drift-1 { animation: cloud-drift 80s linear infinite; }
            .animate-cloud-drift-2 { animation: cloud-drift 120s linear infinite; animation-direction: reverse; }
        `}</style>
    </div>
);


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

    const lowerCaseCondition = condition.toLowerCase();
    const isRainy = lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('drizzle');
    const isStormy = lowerCaseCondition.includes('thunder') || lowerCaseCondition.includes('storm');
    const isCloudy = lowerCaseCondition.includes('cloudy') || lowerCaseCondition.includes('overcast') || isRainy || isStormy;

    return (
        <div key={key} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-gradient-to-b from-blue-300 via-slate-600 to-gray-900 animate-sky-mood">
            {isCloudy && <Clouds />}
            {isRainy && <Rain />}
            {isStormy && <Thunder />}

            <style jsx global>{`
                @keyframes sky-mood {
                    0% { filter: brightness(0.8) saturate(1); }
                    50% { filter: brightness(1.1) saturate(1.2); }
                    100% { filter: brightness(0.8) saturate(1); }
                }
                .animate-sky-mood {
                    animation: sky-mood 45s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
