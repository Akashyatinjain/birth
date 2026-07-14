import React, { useEffect, useState } from 'react';

const BackgroundParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate particles only on mount
    const emojis = ['🎈', '✨', '🎉', '🍰', '🧁', '🛢️', '💖', '⭐'];
    const generated = Array.from({ length: 25 }).map((_, i) => {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      const size = Math.floor(Math.random() * 20) + 20; // 20px to 40px
      const left = Math.random() * 100; // 0% to 100%
      const duration = Math.random() * 12 + 10; // 10s to 22s
      const delay = Math.random() * 15; // 0s to 15s
      const swayType = Math.random() > 0.5 ? 'sway-left-right' : 'sway-right-left';

      return {
        id: i,
        emoji,
        size,
        left,
        duration,
        delay,
        swayType,
      };
    });
    setParticles(generated);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 1,
    }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className={`floating-particle`}
          style={{
            position: 'absolute',
            bottom: '-50px',
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animationName: 'balloon-rise',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            opacity: 0.15,
            filter: p.emoji === '🛢️' ? 'hue-rotate(240deg)' : 'none', // Color it a bit differently if gas cylinder
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
};

export default BackgroundParticles;
