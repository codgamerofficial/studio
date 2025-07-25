
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
                className="absolute bg-gradient-to-b from-transparent to-blue-300/50"
                style={{
                    left: `${Math.random() * 100}%`,
                    width: `${1 + Math.random()}px`,
                    height: `${20 + Math.random() * 40}px`,
                    animation: `fall ${0.5 + Math.random() * 0.5}s linear infinite`,
                    animationDelay: `${Math.random()}s`,
                    transform: 'rotate(35deg)',
                }}
            />
        ))}
        <style jsx>{`
            @keyframes fall {
                to {
                    transform: translate(35vw, 105vh) rotate(35deg);
                }
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
        <div className="absolute -top-1/4 -left-1/4 w-[200%] h-[200%] bg-[url('https://i.postimg.cc/D0C6n7v1/cloud1.png')] bg-no-repeat bg-contain opacity-40 animate-cloud-drift-1"></div>
        <div className="absolute -top-1/4 -left-1/4 w-[200%] h-[200%] bg-[url('https://i.postimg.cc/D0C6n7v1/cloud1.png')] bg-no-repeat bg-contain opacity-30 animate-cloud-drift-2"></div>
         <div className="absolute -top-1/4 -left-1/4 w-[200%] h-[200%] bg-[url('https://i.postimg.cc/pT3LgJBd/cloud2.png')] bg-no-repeat bg-contain opacity-20 animate-cloud-drift-3"></div>
        <style jsx>{`
            @keyframes cloud-drift {
                from { transform: translateX(0); }
                to { transform: translateX(-50%); }
            }
            .animate-cloud-drift-1 { animation: cloud-drift 80s linear infinite; }
            .animate-cloud-drift-2 { animation: cloud-drift 120s linear infinite; animation-direction: reverse; }
            .animate-cloud-drift-3 { animation: cloud-drift 100s linear infinite; }
        `}</style>
    </div>
);

const Trees = () => (
     <div className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 w-[200%] h-full bg-[url('https://i.postimg.cc/PrMQ5R35/trees-silhouette.png')] bg-bottom bg-repeat-x opacity-80 animate-tree-sway"></div>
         <style jsx>{`
            @keyframes tree-sway {
                0%, 100% { transform: translateX(-2%) skewX(2deg); }
                50% { transform: translateX(2%) skewX(-2deg); }
            }
            .animate-tree-sway {
                animation: tree-sway 10s ease-in-out infinite;
            }
        `}</style>
    </div>
)

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
    const isWindy = lowerCaseCondition.includes('windy') || isStormy;

    return (
        <div key={key} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-gradient-to-b from-blue-300 via-slate-600 to-gray-900 animate-sky-mood">
            {isCloudy && <Clouds />}
            {isRainy && <Rain />}
            {isStormy && <Thunder />}
            {(isWindy || isRainy || isStormy) && <Trees />}

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
