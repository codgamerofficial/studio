
'use client'

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const Rain = () => (
    <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden pointer-events-none z-10">
        {Array.from({ length: 150 }).map((_, i) => (
            <div
                key={i}
                className="absolute bg-gradient-to-b from-transparent to-blue-300/50 animate-fall"
                style={{
                    left: `${Math.random() * 100}%`,
                    width: `${1 + Math.random()}px`,
                    height: `${20 + Math.random() * 40}px`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${0.5 + Math.random() * 0.5}s`,
                }}
            />
        ))}
        <style jsx>{`
            @keyframes fall {
                from {
                    transform: translateY(-20%) rotate(15deg);
                }
                to {
                    transform: translateY(120%) rotate(15deg);
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

const Thunder = () => {
    const audioRef = React.useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }
    }, []);

    return (
        <>
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 animate-lightning-bg pointer-events-none z-20" />
            <audio ref={audioRef} src="https://www.soundjay.com/nature/sounds/thunder-2.mp3" loop autoPlay preload="auto" />
            <style jsx>{`
                @keyframes lightning-bg {
                    0%, 100% { opacity: 0; }
                    2% { opacity: 0.3; }
                    5% { opacity: 0; }
                    7% { opacity: 0.2; }
                    15% { opacity: 0; }
                }
                .animate-lightning-bg {
                    animation: lightning-bg 9s linear infinite;
                    animation-delay: 3s;
                }
            `}</style>
        </>
    );
};

const Clouds = () => (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
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
                background: white;
                border-radius: 50%;
                opacity: 0.15;
                filter: blur(8px);
            }
            .cloud::before, .cloud::after {
                content: '';
                position: absolute;
                background: white;
                border-radius: 50%;
            }
            .cloud-1 { top: 5%; left: 10%; width: 120px; height: 35px; }
            .cloud-1::before { top: -18px; left: 15px; width: 60px; height: 60px; }
            .cloud-1::after { top: -30px; left: 50px; width: 70px; height: 70px; }
            
            .cloud-2 { top: 12%; left: 35%; width: 180px; height: 50px; }
            .cloud-2::before { top: -25px; left: 25px; width: 80px; height: 80px; }
            .cloud-2::after { top: -40px; left: 70px; width: 90px; height: 90px; }

            .cloud-3 { top: 8%; left: 80%; width: 150px; height: 40px; }
            .cloud-3::before { top: -20px; left: 20px; width: 65px; height: 65px; }
            .cloud-3::after { top: -30px; left: 60px; width: 80px; height: 80px; }

            .cloud-4 { top: 20%; left: 5%; width: 140px; height: 45px; opacity: 0.2; }
            .cloud-4::before { top: -22px; left: 18px; width: 68px; height: 68px; }
            .cloud-4::after { top: -35px; left: 60px; width: 85px; height: 85px; }

            .cloud-5 { top: 28%; left: 55%; width: 200px; height: 60px; opacity: 0.25; }
            .cloud-5::before { top: -30px; left: 30px; width: 90px; height: 90px; }
            .cloud-5::after { top: -45px; left: 80px; width: 100px; height: 100px; }
            
            .cloud-6 { top: 22%; left: 90%; width: 130px; height: 35px; opacity: 0.22; }
            .cloud-6::before { top: -18px; left: 15px; width: 55px; height: 55px; }
            .cloud-6::after { top: -28px; left: 45px; width: 70px; height: 70px; }

            @keyframes cloud-drift {
                from { transform: translateX(5%); }
                to { transform: translateX(-105%); }
            }
            .animate-cloud-drift-1 { animation: cloud-drift 120s linear infinite; }
            .animate-cloud-drift-2 { animation: cloud-drift 180s linear infinite; }
        `}</style>
    </div>
);


const Wind = () => (
    <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden pointer-events-none z-10">
        {Array.from({ length: 50 }).map((_, i) => (
            <div
                key={i}
                className="absolute bg-white/20 rounded-full animate-wind"
                style={{
                    left: `${-10 + Math.random() * -20}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${5 + Math.random() * 10}px`,
                    height: `${1 + Math.random() * 2}px`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                }}
            />
        ))}
        <style jsx>{`
            @keyframes wind {
                from {
                    transform: translateX(0) scaleX(1);
                    opacity: 1;
                }
                to {
                    transform: translateX(120vw) scaleX(2.5);
                    opacity: 0;
                }
            }
            .animate-wind {
                animation-name: wind;
                animation-timing-function: ease-in;
                animation-iteration-count: infinite;
            }
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
    const isWindy = lowerCaseCondition.includes('windy') || lowerCaseCondition.includes('blustery');

    return (
        <div key={key} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-300/30 via-slate-600/20 to-gray-900/10 animate-sky-mood"></div>
            {isCloudy && <Clouds />}
            {isWindy && <Wind />}
            {isRainy && <Rain />}
            {isStormy && <Thunder />}

            <style jsx global>{`
                @keyframes sky-mood {
                    0% { filter: brightness(0.9) saturate(1); }
                    50% { filter: brightness(1.1) saturate(1.2); }
                    100% { filter: brightness(0.9) saturate(1); }
                }
                .animate-sky-mood {
                    animation: sky-mood 60s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
