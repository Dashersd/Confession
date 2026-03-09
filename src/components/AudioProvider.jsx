import React, { createContext, useContext, useRef } from 'react';

const AudioContext = createContext(null);

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
    const bgmRef = useRef(null);

    const playBgm = (timestamp = 0) => {
        if (!bgmRef.current) {
            bgmRef.current = new Audio('/bgm_reason.mp3');
            bgmRef.current.loop = true;
            bgmRef.current.volume = 0.4;
        }

        // Set the time and play
        bgmRef.current.currentTime = timestamp;
        bgmRef.current.play().catch(e => console.log("Audio play blocked until interaction:", e));
    };

    const playSfx = (name, volume = 0.5) => {
        // SFX logic if needed
    };

    return (
        <AudioContext.Provider value={{ playBgm, playSfx }}>
            {children}
        </AudioContext.Provider>
    );
};
