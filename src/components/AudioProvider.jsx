import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const AudioContext = createContext(null);

export const useAudio = () => useContext(AudioContext);

const AUDIO_ASSETS = {
    bgm_intro: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    bgm_letter: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    bgm_yes: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    bgm_wait: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    sfx_click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    sfx_paper: 'https://assets.mixkit.co/active_storage/sfx/2045/2045-preview.mp3',
    sfx_heartbeat: 'https://assets.mixkit.co/active_storage/sfx/2545/2545-preview.mp3',
    sfx_chime: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
};

export const AudioProvider = ({ children }) => {
    const bgmRef = useRef(new Audio());
    const [currentBgm, setCurrentBgm] = useState(null);

    const playBgm = (key, fadeTime = 1500) => {
        if (currentBgm === key) return;

        const newSrc = AUDIO_ASSETS[key];
        if (!newSrc) return;

        // Fade out current
        let volume = bgmRef.current.volume;
        const fadeOutInterval = setInterval(() => {
            if (volume > 0.05) {
                volume -= 0.05;
                bgmRef.current.volume = volume;
            } else {
                clearInterval(fadeOutInterval);
                bgmRef.current.pause();

                // Start new
                bgmRef.current.src = newSrc;
                bgmRef.current.loop = true;
                bgmRef.current.volume = 0;
                bgmRef.current.play().catch(e => console.log("Audio play blocked", e));

                let newVolume = 0;
                const fadeInInterval = setInterval(() => {
                    if (newVolume < 0.3) {
                        newVolume += 0.02;
                        bgmRef.current.volume = newVolume;
                    } else {
                        clearInterval(fadeInInterval);
                    }
                }, fadeTime / 15);
            }
        }, fadeTime / 20);

        setCurrentBgm(key);
    };

    const playSfx = (key, volume = 0.2) => {
        const src = AUDIO_ASSETS[key];
        if (!src) return;
        const sfx = new Audio(src);
        sfx.volume = volume;
        sfx.play().catch(e => console.log("SFX play blocked", e));
    };

    return (
        <AudioContext.Provider value={{ playBgm, playSfx }}>
            {children}
        </AudioContext.Provider>
    );
};
