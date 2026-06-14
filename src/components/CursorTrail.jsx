import React, { useEffect, useRef } from 'react';

const CursorTrail = () => {
    const canvasRef = useRef(null);
    const particles = useRef([]);
    const mouse = useRef({ x: -100, y: -100 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const handleMouseMove = (e) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
            
            // Add a few particles on movement
            for (let i = 0; i < 2; i++) {
                particles.current.push({
                    x: e.clientX,
                    y: e.clientY,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2 - 1, // slight upward drift
                    life: 1,
                    size: Math.random() * 3 + 1,
                    color: `hsla(${340 + Math.random() * 30}, 100%, 80%, 1)`
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', (e) => handleMouseMove(e.touches[0]));

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.current = particles.current.filter(p => p.life > 0);
            
            particles.current.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.02; // Fade out
                p.size *= 0.95; // Shrink
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color.replace(', 1)', `, ${p.life})`);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 9999
            }}
        />
    );
};

export default CursorTrail;
