'use client';

import { Volume2, VolumeX } from 'lucide-react';
import styles from './SoundToggle.module.css';

export interface SoundToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  ariaLabel?: string;
}

export function SoundToggle({
  checked,
  onChange,
  className = '',
  ariaLabel = '音效开关',
}: SoundToggleProps) {
  const Icon = checked ? Volume2 : VolumeX;

  return (
    <button
      className={`${styles.soundToggleControl} ${className}`}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      data-sound-on={checked}
      data-switch-active={!checked}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.soundIcon} aria-hidden="true">
        <Icon size={22} strokeWidth={2.8} />
      </span>

      <span className={styles.switchShell} aria-hidden="true">
        <span className={styles.slider} />
      </span>
    </button>
  );
}
