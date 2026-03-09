import React, { createContext, useContext, useRef } from 'react';

const AudioContext = createContext(null);

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
    const bgmRef = useRef(null);

    const playBgm = (name) => {
        if (bgmRef.current) {
            bgmRef.current.pause();
        }

        let src = '';
        if (name === 'bgm_intro') src = '/bgm_reason.mp3'; // Default to the new song
        else if (name === 'bgm_letter') src = '/bgm_reason.mp3';
        else if (name === 'bgm_yes') src = '/bgm_reason.mp3';
        else if (name === 'bgm_wait') src = '/bgm_reason.mp3';
        else src = `/bgm_reason.mp3`;

        const audio = new Audio(src);
        audio.loop = true;
        audio.volume = 0.4;
        audio.play().catch(e => console.log("Audio play blocked until interaction:", e));
        bgmRef.current = audio;
    };

    const playSfx = (name, volume = 0.5) => {
        // SFX can stay silent or if you had specific files in public/
        // const audio = new Audio(`/sfx_${name}.mp3`);
        // audio.volume = volume;
        // audio.play().catch(() => {});
    };

    return (
        <AudioContext.Provider value={{ playBgm, playSfx }}>
            {children}
        </AudioContext.Provider>
    );
};
