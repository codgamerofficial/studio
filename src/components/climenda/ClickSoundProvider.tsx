"use client"

import React from 'react';

export function ClickSoundProvider({ children }: { children: React.ReactNode }) {
    const handlePlaySound = (event: React.MouseEvent<HTMLDivElement>) => {
        // We only want to play the sound for direct clicks on interactive elements like buttons
        if (event.target instanceof HTMLElement && event.target.closest('button, [role="button"]')) {
            const audio = document.getElementById('click-sound') as HTMLAudioElement;
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(e => console.error("Error playing sound:", e));
            }
        }
    }

    return (
        <div onClick={handlePlaySound} className="contents">
            {children}
            <audio id="click-sound" src="https://actions.google.com/sounds/v1/weapons/big_punch_with_grunt.ogg" preload="auto"></audio>
        </div>
    );
}
