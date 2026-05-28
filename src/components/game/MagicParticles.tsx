'use client';

import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
  type: 'star' | 'coin';
  drift: number;
  rotation: number;
}

const particles: Particle[] = Array.from({ length: 28 }, (_, index) => {
  const angle = ((index * 137.5) % 360) * (Math.PI / 180);
  const radius = 72 + (index % 7) * 22;

  return {
    id: index,
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * 110 - 22,
    delay: (index % 9) * 0.18,
    duration: 3.2 + (index % 5) * 0.38,
    size: 13 + (index % 4) * 4,
    type: index % 4 === 0 ? 'coin' : 'star',
    drift: index % 2 === 0 ? 18 : -18,
    rotation: (index * 47) % 360,
  };
});

export function MagicParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `calc(50% + ${particle.x}px)`,
            top: `calc(48% + ${particle.y}px)`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            x: [0, particle.drift, particle.drift * 0.35, 0],
            y: [0, -28, -58, 0],
            opacity: [0, 0.95, 0.52, 0],
            rotate: [particle.rotation, particle.rotation + 180, particle.rotation + 360],
            scale: [0.72, 1, 0.82, 0.72],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {particle.type === 'star' ? <StarParticle /> : <CoinParticle />}
        </motion.div>
      ))}
    </div>
  );
}

function StarParticle() {
  return (
    <svg className="h-full w-full" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 1.8L15.18 8.16L22.2 9.18L17.1 14.12L18.32 21.1L12 17.8L5.68 21.1L6.9 14.12L1.8 9.18L8.82 8.16L12 1.8Z"
        fill="#FFE76E"
        stroke="#F59E0B"
        strokeWidth="1.2"
      />
      <path d="M12 6.4L13.9 10.1L12 13.9L10.1 10.1L12 6.4Z" fill="#FFF8BF" />
    </svg>
  );
}

function CoinParticle() {
  return (
    <div
      className="h-full w-full rounded-full"
      style={{
        border: '2px solid rgba(180, 83, 9, 0.86)',
        background:
          'radial-gradient(circle at 32% 28%, #fff6a3 0%, #facc15 34%, #f59e0b 70%, #b45309 100%)',
        boxShadow:
          'inset 0 1px 2px rgba(255, 255, 255, 0.72), inset 0 -2px 3px rgba(120, 53, 15, 0.35), 0 0 14px rgba(250, 204, 21, 0.62)',
      }}
    />
  );
}
