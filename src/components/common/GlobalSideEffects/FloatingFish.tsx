'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import fishImage from '@/assets/images/ui/icons/fish.png';
import styles from './GlobalSideEffects.module.scss';

interface FishEffect {
  id: string;
  left: string;
  bottom: string;
  size: number;
  duration: number;
  delay: number;
  distance: number;
  height: number;
  rotate: number;
}

const fishEffects: FishEffect[] = [
  { id: 'fish-1', left: '72%', bottom: '9%', size: 118, duration: 10.8, delay: -1.2, distance: 300, height: 126, rotate: -10 },
  { id: 'fish-2', left: '58%', bottom: '4%', size: 142, duration: 12.4, delay: -7.4, distance: 360, height: 154, rotate: 8 },
  { id: 'fish-3', left: '84%', bottom: '18%', size: 92, duration: 11.2, delay: -4.8, distance: 250, height: 116, rotate: -8 },
  { id: 'fish-4', left: '68%', bottom: '0%', size: 86, duration: 12.8, delay: -9.5, distance: 330, height: 104, rotate: 14 },
];

export function FloatingFish() {
  return (
    <div className={styles.fishLayer}>
      {fishEffects.map(item => (
        <motion.span
          key={item.id}
          className={styles.fishItem}
          style={{
            left: item.left,
            bottom: item.bottom,
            width: item.size,
            height: Math.round(item.size * 0.72),
          }}
          animate={{
            x: [0, item.distance * -0.2, item.distance * -0.58, item.distance * -1],
            y: [0, item.height * -0.72, item.height * -1, 0],
            rotate: [item.rotate, item.rotate + 16, item.rotate - 12, item.rotate - 24],
            opacity: [0, 0.92, 0.98, 0],
            scale: [0.82, 1.08, 1, 0.9],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.28, 0.52, 1],
          }}
        >
          <Image src={fishImage} alt="" fill sizes={`${item.size}px`} className={styles.effectImage} draggable={false} />
        </motion.span>
      ))}
    </div>
  );
}
