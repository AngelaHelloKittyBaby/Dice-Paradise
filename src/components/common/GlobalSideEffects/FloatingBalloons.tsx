'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import balloonImage from '@/assets/images/ui/icons/hotAirBalloon.png';
import styles from './GlobalSideEffects.module.scss';

interface BalloonEffect {
  id: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
  sway: string[];
}

const balloonEffects: BalloonEffect[] = [
  { id: 'balloon-1', left: '8%', size: 118, duration: 20, delay: -4, sway: ['0vw', '2.2vw', '-1vw', '0.8vw'] },
  { id: 'balloon-2', left: '42%', size: 154, duration: 23, delay: -15, sway: ['0vw', '-1.6vw', '1.8vw', '-0.8vw'] },
  { id: 'balloon-3', left: '70%', size: 96, duration: 21.5, delay: -9, sway: ['0vw', '1.3vw', '-1.8vw', '0.5vw'] },
];

export function FloatingBalloons() {
  return (
    <div className={styles.balloonsLayer}>
      {balloonEffects.map(item => (
        <motion.span
          key={item.id}
          className={styles.balloonItem}
          style={{
            left: item.left,
            top: '102%',
            width: item.size,
            height: Math.round(item.size * 1.24),
          }}
          animate={{
            y: ['8vh', '-118vh'],
            x: item.sway,
            opacity: [0, 0.88, 0.92, 0],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Image src={balloonImage} alt="" fill sizes={`${item.size}px`} className={styles.effectImage} draggable={false} />
        </motion.span>
      ))}
    </div>
  );
}
