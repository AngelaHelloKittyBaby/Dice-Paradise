'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import airshipImage from '@/assets/images/ui/icons/skyairplane.png';
import styles from './GlobalSideEffects.module.scss';

export function FloatingAirship() {
  return (
    <div className={styles.airshipLayer}>
      <motion.span
        className={styles.airshipItem}
        style={{
          left: '100%',
          top: '9%',
          width: 220,
          height: 122,
        }}
        animate={{
          x: ['28%', '-290%'],
          y: ['0vh', '2vh', '-1vh', '0vh'],
          opacity: [0, 0.96, 0.96, 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
          times: [0, 0.08, 0.92, 1],
        }}
      >
        <Image src={airshipImage} alt="" fill sizes="220px" className={styles.effectImage} draggable={false} />
      </motion.span>
    </div>
  );
}
