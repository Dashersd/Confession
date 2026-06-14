import React, { useMemo } from 'react';

const Confetti = ({ count = 40 }) => {
    const confettiPieces = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => {
            const size = Math.random() * 16 + 12; // 12px to 28px
            const colors = ['#ff8fa3', '#ffb3c1', '#fb6f92', '#ffffff', '#ffccd5'];
            return {
                id: i,
                left: `${Math.random() * 100}%`,
                fontSize: `${size}px`,
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: 0.8 + Math.random() * 0.2,
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `confettiFall ${3 + Math.random() * 4}s linear infinite`,
                animationDelay: `-${Math.random() * 5}s`
            };
        });
    }, [count]);

    return (
        <div className="confetti-layer" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
            {confettiPieces.map((piece) => (
                <div key={piece.id} className="confetti-piece" style={{
                    position: 'absolute',
                    top: '-10%',
                    left: piece.left,
                    fontSize: piece.fontSize,
                    color: piece.color,
                    opacity: piece.opacity,
                    transform: piece.transform,
                    animation: piece.animation,
                    animationDelay: piece.animationDelay
                }}>
                    ❤
                </div>
            ))}
            <style>{`
                @keyframes confettiFall {
                    0% { transform: translateY(0vh) rotate(0deg); }
                    100% { transform: translateY(110vh) rotate(720deg); }
                }
            `}</style>
        </div>
    );
};

export default Confetti;
