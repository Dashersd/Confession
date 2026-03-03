import React, { useState, useEffect } from 'react';

const TypewriterText = ({
    text,
    speed = 40,
    delay = 0,
    onComplete,
    className = ""
}) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        const startTimer = setTimeout(() => {
            setIsStarted(true);
        }, delay);

        return () => clearTimeout(startTimer);
    }, [delay]);

    useEffect(() => {
        if (!isStarted) return;

        if (displayedText.length < text.length) {
            const charTimer = setTimeout(() => {
                setDisplayedText(text.slice(0, displayedText.length + 1));
            }, speed);
            return () => clearTimeout(charTimer);
        } else {
            // Completed, call onComplete once
            if (onComplete) {
                const completeTimer = setTimeout(() => {
                    onComplete();
                }, 800);
                return () => clearTimeout(completeTimer);
            }
        }
    }, [displayedText, text, speed, isStarted, onComplete]);

    return (
        <div className={className} style={{ minHeight: '1.4em' }}>
            {displayedText}
            {isStarted && displayedText.length < text.length && (
                <span className="type-cursor">|</span>
            )}
        </div>
    );
};

export default TypewriterText;
