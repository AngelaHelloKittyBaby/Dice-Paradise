'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Balloon } from 'lucide-react';
import styles from './LobbyAmbientEffects.module.css';

const canopyLights = Array.from({ length: 11 }, (_, index) => `canopy-light-${index}`);
const signLights = Array.from({ length: 9 }, (_, index) => `sign-light-${index}`);
const diceParticles = Array.from({ length: 12 }, (_, index) => `dice-particle-${index}`);
const skyParticles = Array.from({ length: 8 }, (_, index) => `sky-particle-${index}`);
const edgeParticles = Array.from({ length: 16 }, (_, index) => `edge-particle-${index}`);
const cloudBanks = Array.from({ length: 9 }, (_, index) => `cloud-bank-${index}`);
const ambientBirds = Array.from({ length: 12 }, (_, index) => `ambient-bird-${index}`);
const ambientBalloons = Array.from({ length: 3 }, (_, index) => `ambient-balloon-${index}`);
const waveSparkles = Array.from({ length: 44 }, (_, index) => `wave-sparkle-${index}`);
const floorSparkles = Array.from({ length: 40 }, (_, index) => `floor-sparkle-${index}`);

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
        {ambientBalloons.map((key, index) => (
          <motion.span
            key={key}
            className={styles.ambientBalloon}
            animate={{ y: [0, -34, 0], x: [0, index % 2 === 0 ? 34 : -28, 0], opacity: [0.62, 0.88, 0.68] }}
            transition={{ duration: 8.2 + index * 1.1, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Balloon size={66} strokeWidth={2.35} />
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
