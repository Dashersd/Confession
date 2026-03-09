import React from 'react';

const Confetti = ({ count = 40 }) => {
    return (
        <div className="confetti-layer" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
            {Array.from({ length: count }).map((_, i) => {
                const size = Math.random() * 12 + 8; // Slightly larger: 8px to 20px
                const colors = ['#ff8fa3', '#ffb3c1', '#fb6f92', '#ffffff', '#ffccd5'];
                return (
                    <div key={i} className="confetti-piece" style={{
                        position: 'absolute',
                        top: '-10%',
                        left: `${Math.random() * 100}%`,
                        width: `${size}px`,
                        height: `${size * 0.9}px`,
                        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                        opacity: 0.8 + Math.random() * 0.2,
                        borderRadius: '1px',
                        transform: `rotate(${Math.random() * 360}deg)`,
                        animation: `confettiFall ${3 + Math.random() * 4}s linear infinite`,
                        animationDelay: `${Math.random() * 5}s`
                    }} />
                );
            })}
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
