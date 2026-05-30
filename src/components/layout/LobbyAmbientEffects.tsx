'use client';

import React, { type CSSProperties } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { motion } from 'framer-motion';
import hotAirBalloonImage from '@/assets/images/ui/icons/hotAirBalloon.png';
import skyAirplaneImage from '@/assets/images/ui/icons/skyairplane.png';
import styles from './LobbyAmbientEffects.module.css';

const canopyLights = Array.from({ length: 11 }, (_, index) => `canopy-light-${index}`);
const signLights = Array.from({ length: 9 }, (_, index) => `sign-light-${index}`);
const diceParticles = Array.from({ length: 12 }, (_, index) => `dice-particle-${index}`);
const skyParticles = Array.from({ length: 8 }, (_, index) => `sky-particle-${index}`);
const edgeParticles = Array.from({ length: 16 }, (_, index) => `edge-particle-${index}`);
const cloudBanks = Array.from({ length: 9 }, (_, index) => `cloud-bank-${index}`);
const ambientBirds = Array.from({ length: 12 }, (_, index) => `ambient-bird-${index}`);
const waveSparkles = Array.from({ length: 44 }, (_, index) => `wave-sparkle-${index}`);
const floorSparkles = Array.from({ length: 40 }, (_, index) => `floor-sparkle-${index}`);

interface AmbientSkyObject {
  id: string;
  image: StaticImageData;
  className: string;
  style: CSSProperties;
  sizes: string;
  animate: {
    x: number[];
    y: number[];
    rotate: number[];
    opacity: number[];
  };
  duration: number;
  delay: number;
}

const ambientSkyObjects: AmbientSkyObject[] = [
  {
    id: 'ambient-hot-air-balloon-left',
    image: hotAirBalloonImage,
    className: styles.hotAirBalloonObject,
    style: { top: '11%', left: '28%', width: 72, height: 92 },
    sizes: '72px',
    animate: {
      x: [0, 28, -14, 0],
      y: [0, -20, 10, 0],
      rotate: [-3, 4, -2, -3],
      opacity: [0.78, 0.94, 0.82, 0.78],
    },
    duration: 14,
    delay: -2.4,
  },
  {
    id: 'ambient-sky-airplane',
    image: skyAirplaneImage,
    className: styles.skyAirplaneObject,
    style: { top: '8%', right: '21%', width: 112, height: 68 },
    sizes: '112px',
    animate: {
      x: [0, -76, -18, 28, 0],
      y: [0, 12, -10, 6, 0],
      rotate: [0, -4, 3, -2, 0],
      opacity: [0.8, 0.96, 0.9, 0.95, 0.8],
    },
    duration: 20,
    delay: -7.5,
  },
  {
    id: 'ambient-hot-air-balloon-right',
    image: hotAirBalloonImage,
    className: styles.hotAirBalloonObject,
    style: { top: '18%', right: '14%', width: 58, height: 76 },
    sizes: '58px',
    animate: {
      x: [0, -24, 16, 0],
      y: [0, -16, 9, 0],
      rotate: [4, -3, 2, 4],
      opacity: [0.7, 0.88, 0.74, 0.7],
    },
    duration: 16,
    delay: -5.2,
  },
];

export const LobbyAmbientEffects: React.FC = () => {
  return (
    <div className={styles.ambientLayer} aria-hidden="true">
      <div className={styles.cinematicEdgeGlow} />
      <div className={styles.volumetricLight} />
      <div className={styles.sunSweep} />

      <div className={styles.cloudLayer}>
        {cloudBanks.map((key, index) => (
          <motion.div
            key={key}
            className={styles.cloudBank}
            animate={{
              x: index % 2 === 0 ? [0, 168, -32, 0] : [0, -142, 28, 0],
              y: index % 3 === 0 ? [0, -18, 10, 0] : [0, 12, -14, 0],
              opacity: [0.42, 0.82, 0.58, 0.42],
            }}
            transition={{ duration: 18 + index * 1.65, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className={styles.ambientCreatures}>
        {ambientBirds.map((key, index) => (
          <motion.span
            key={key}
            className={styles.ambientBird}
            animate={{
              x: index % 2 === 0 ? [0, 260, 112, 0] : [0, -230, -86, 0],
              y: index % 3 === 0 ? [0, -36, 22, 0] : [0, 28, -20, 0],
              opacity: [0.7, 0.98, 0.76],
            }}
            transition={{ duration: 18 + index * 1.05, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className={styles.birdSilhouette} />
          </motion.span>
        ))}
        {ambientSkyObjects.map(item => (
          <motion.span
            key={item.id}
            className={`${styles.ambientSkyObject} ${item.className}`}
            style={item.style}
            animate={item.animate}
            transition={{ duration: item.duration, delay: item.delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image src={item.image} alt="" fill sizes={item.sizes} className={styles.ambientSkyImage} draggable={false} />
          </motion.span>
        ))}
      </div>

      <div className={styles.oceanWaveFoam} />
      <div className={styles.oceanShimmer}>
        <div className={styles.waveSparkles}>
          {waveSparkles.map(key => (
            <span key={key} />
          ))}
        </div>
      </div>
      <div className={styles.oceanRipplePrimary} />
      <div className={styles.oceanRippleSecondary} />
      <div className={styles.floorSparkles}>
        {floorSparkles.map(key => (
          <span key={key} />
        ))}
      </div>
      <div className={styles.mistLayer} />

      <div className={styles.canopyLights}>
        {canopyLights.map(key => (
          <span key={key} />
        ))}
      </div>
      <div className={styles.signLights}>
        {signLights.map(key => (
          <span key={key} />
        ))}
      </div>

      <div className={styles.poolRipple} />
      <div className={styles.poolReflection} />

      <div className={styles.diceParticles}>
        {diceParticles.map(key => (
          <span key={key} />
        ))}
      </div>

      <div className={styles.skyParticles}>
        {skyParticles.map(key => (
          <span key={key} />
        ))}
      </div>

      <div className={styles.edgeParticles}>
        {edgeParticles.map(key => (
          <span key={key} />
        ))}
      </div>

      <div className={styles.stageVignette} />
    </div>
  );
};
