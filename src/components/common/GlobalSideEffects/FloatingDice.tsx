'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import diceImage from '@/assets/images/ui/icons/骰子.png';
import styles from './GlobalSideEffects.module.scss';

interface DiceEffect {
  id: string;
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  lift: number;
  rotation: number;
  spin: number;
  opacity: number;
}

type EffectSide = 'left' | 'right';

const diceEffects: Record<EffectSide, DiceEffect[]> = {
  left: [
    { id: 'dice-left-1', left: '12%', top: '11%', size: 88, duration: 12.4, delay: -3.4, drift: 22, lift: 38, rotation: -18, spin: 34, opacity: 0.82 },
    { id: 'dice-left-2', left: '54%', top: '45%', size: 122, duration: 14.5, delay: -9.2, drift: -20, lift: 50, rotation: 12, spin: -42, opacity: 0.76 },
    { id: 'dice-left-3', left: '24%', top: '74%', size: 98, duration: 10.6, delay: -7.1, drift: 20, lift: 40, rotation: 20, spin: -36, opacity: 0.8 },
  ],
  right: [
    { id: 'dice-right-1', left: '60%', top: '17%', size: 92, duration: 11.8, delay: -4.2, drift: -18, lift: 36, rotation: -26, spin: 44, opacity: 0.76 },
    { id: 'dice-right-2', left: '18%', top: '62%', size: 116, duration: 13.2, delay: -1.6, drift: 24, lift: 46, rotation: -8, spin: 38, opacity: 0.72 },
  ],
};

export function FloatingDice({ side }: { side: EffectSide }) {
  return (
    <div className={styles.diceLayer}>
      {diceEffects[side].map(item => (
        <motion.span
          key={item.id}
          className={styles.diceItem}
          style={{
            left: item.left,
            top: item.top,
            width: item.size,
            height: item.size,
          }}
          animate={{
            x: [0, item.drift, item.drift * -0.72, item.drift * 0.38, 0],
            y: [0, item.lift * -1, item.lift * -0.34, item.lift * 0.22, 0],
            rotate: [item.rotation, item.rotation + item.spin, item.rotation + item.spin * 0.15, item.rotation - item.spin * 0.42, item.rotation],
            scale: [0.9, 1.08, 0.96, 1.03, 0.9],
            opacity: [item.opacity * 0.68, item.opacity, item.opacity * 0.88, item.opacity, item.opacity * 0.68],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Image src={diceImage} alt="" fill sizes={`${item.size}px`} className={styles.effectImage} draggable={false} />
        </motion.span>
      ))}
    </div>
  );
}
