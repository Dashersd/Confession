import React, { createContext, useContext, useRef, useState } from 'react';

const AudioContext = createContext(null);

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
    const bgmRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);
    const isMutedRef = useRef(false);

    const playBgm = () => {
        if (!bgmRef.current) {
            bgmRef.current = new Audio('/bgm_reason.mp3');
            bgmRef.current.loop = true;
        }
        
        bgmRef.current.muted = isMutedRef.current;
        bgmRef.current.volume = 0.4;

        if (bgmRef.current.paused && !isMutedRef.current) {
            const playPromise = bgmRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => console.log("Audio play blocked until interaction:", e));
            }
        }
    };

    const toggleMute = () => {
        setIsMuted((prev) => {
            const nextMuted = !prev;
            isMutedRef.current = nextMuted;
            if (bgmRef.current) {
                bgmRef.current.muted = nextMuted;
                if (nextMuted) {
                    bgmRef.current.pause();
                } else {
                    const playPromise = bgmRef.current.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(e => console.log("Audio play blocked until interaction:", e));
                    }
                }
            }
            return nextMuted;
        });
    };

    const audioCtxRef = useRef(null);

    const playSfx = (name, volume = 0.5) => {
        if (isMutedRef.current) return;

        if (!audioCtxRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            audioCtxRef.current = new AudioContext();
        }
        
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (name === 'sfx_chime') {
            // High magical chime
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, t);
            osc.frequency.exponentialRampToValueAtTime(1200, t + 0.1);
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(volume * 0.3, t + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 1.5);
            osc.start(t);
            osc.stop(t + 1.5);
        } else if (name === 'sfx_heartbeat') {
            // Deep heartbeat thump
            osc.type = 'sine';
            osc.frequency.setValueAtTime(60, t);
            osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(volume * 0.8, t + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
            osc.start(t);
            osc.stop(t + 0.4);

            // Second thump
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.frequency.setValueAtTime(60, t + 0.2);
            osc2.frequency.exponentialRampToValueAtTime(40, t + 0.3);
            gain2.gain.setValueAtTime(0, t + 0.2);
            gain2.gain.linearRampToValueAtTime(volume * 0.6, t + 0.25);
            gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.6);
            osc2.start(t + 0.2);
            osc2.stop(t + 0.6);
        } else if (name === 'sfx_click') {
            // Soft UI click
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, t);
            osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(volume * 0.2, t + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
            osc.start(t);
            osc.stop(t + 0.1);
        } else if (name === 'sfx_paper') {
            // Simulated rustle (noise)
            const bufferSize = ctx.sampleRate * 0.5; // 0.5 seconds
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1000;
            
            noise.connect(filter);
            filter.connect(gain);
            
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(volume * 0.15, t + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
            
            noise.start(t);
            noise.stop(t + 0.5);
        }
    };

    return (
        <AudioContext.Provider value={{ playBgm, playSfx, toggleMute, isMuted }}>
            {children}
        </AudioContext.Provider>
    );
};
