import React, { createContext, useContext } from 'react';

const AudioContext = createContext(null);

export const useAudio = () => useContext(AudioContext);

/**
 * Audio Provider (Silent Edition)
 * All audio files (mp3) have been removed as requested.
 * Functions remain as no-ops for compatibility.
 */
export const AudioProvider = ({ children }) => {
    const playBgm = () => {
        // Audio removed
    };

    const playSfx = () => {
        // Audio removed
    };

    return (
        <AudioContext.Provider value={{ playBgm, playSfx }}>
            {children}
        </AudioContext.Provider>
    );
};
