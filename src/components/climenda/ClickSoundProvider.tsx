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
            <audio id="click-sound" src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_273180d136.mp3" preload="auto"></audio>
        </div>
    );
}
