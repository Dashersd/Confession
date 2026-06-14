import React from 'react';

const Petals = () => {
    const petals = Array.from({ length: 15 });
    return (
        <div className="petals-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
            {petals.map((_, i) => (
                <div
                    key={i}
                    className="floating-petal"
                    style={{
                        left: `${Math.random() * 100}vw`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${5 + Math.random() * 5}s`,
                        transform: `scale(${0.5 + Math.random()})`
                    }}
                />
            ))}
        </div>
    );
};

export default Petals;
