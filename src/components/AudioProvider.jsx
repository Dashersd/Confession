import React, { createContext, useContext, useRef, useState } from 'react';

const AudioContext = createContext(null);

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
    const bgmRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);

    const playBgm = () => {
        if (!bgmRef.current) {
            bgmRef.current = new Audio('/bgm_reason.mp3');
            bgmRef.current.loop = true;
            bgmRef.current.volume = 0.4;
            bgmRef.current.muted = isMuted;
        }

        if (bgmRef.current.paused) {
            bgmRef.current.play().catch(e => console.log("Audio play blocked until interaction:", e));
        }
    };

    const toggleMute = () => {
        setIsMuted((prev) => {
            const nextMuted = !prev;
            if (bgmRef.current) {
                bgmRef.current.muted = nextMuted;
            }
            return nextMuted;
        });
    };

    const playSfx = (name, volume = 0.5) => {
        // SFX logic if needed
    };

    return (
        <AudioContext.Provider value={{ playBgm, playSfx, toggleMute, isMuted }}>
            {children}
        </AudioContext.Provider>
    );
};
