'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import yachtArt from '@/assets/images/effects/yachat.png';
import waveArt from '@/assets/images/effects/wave.png';
import styles from './YachtScoreEffect.module.css';

export interface YachtScoreEffectProps {
  triggerKey: number;
}

const sparkleItems = Array.from({ length: 18 }, (_, index) => index);

export function YachtScoreEffect({ triggerKey }: YachtScoreEffectProps) {
  const [activeKey, setActiveKey] = useState<number | null>(null);

  useEffect(() => {
    if (!triggerKey) return undefined;

    setActiveKey(triggerKey);

    const timer = window.setTimeout(() => {
      setActiveKey(null);
    }, 2200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [triggerKey]);

  return (
    <AnimatePresence>
      {activeKey ? (
        <motion.div
          key={activeKey}
          className={styles.effectLayer}
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.div
            className={styles.route}
            initial={{
              x: -620,
              y: 810,
              opacity: 0,
              rotate: -23,
              scale: 0.78,
              filter: 'blur(8px) brightness(1.2)',
            }}
            animate={{
              x: 1960,
              y: -250,
              opacity: [0, 1, 1, 0],
              rotate: [-23, -20, -22, -18],
              scale: [0.78, 0.98, 1.05, 0.95],
              filter: [
                'blur(8px) brightness(1.22)',
                'blur(0px) brightness(1.08)',
                'blur(2px) brightness(1.14)',
                'blur(9px) brightness(1.25)',
              ],
            }}
            transition={{
              duration: 2,
              ease: [0.16, 0.86, 0.24, 1],
              times: [0, 0.16, 0.72, 1],
            }}
          >
            <motion.div
              className={styles.wakeGroup}
              initial={{ opacity: 0, x: -70, y: 84, scaleX: 0.62, scaleY: 0.86 }}
              animate={{
                opacity: [0, 0.96, 0.76, 0],
                x: [-80, -150, -250, -380],
                y: [92, 110, 124, 138],
                scaleX: [0.62, 1.12, 1.42, 1.72],
                scaleY: [0.84, 0.95, 1.02, 1.08],
              }}
              transition={{ duration: 2, ease: 'easeOut', times: [0, 0.18, 0.72, 1] }}
            >
              <div className={styles.trailMist} />
              <Image
                src={waveArt}
                alt=""
                className={styles.waveImage}
                width={640}
                height={360}
                draggable={false}
                priority
              />
              <div className={styles.sparkleField}>
                {sparkleItems.map(item => (
                  <span key={item} />
                ))}
              </div>
            </motion.div>

            <motion.div
              className={styles.yachtFloat}
              animate={{ y: [0, -15, 7, -10, 0], rotate: [0, 1.6, -1.2, 1, 0] }}
              transition={{ duration: 0.72, repeat: 2, ease: 'easeInOut' }}
            >
              <Image
                src={yachtArt}
                alt=""
                className={styles.yachtImage}
                width={620}
                height={360}
                draggable={false}
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

