import type { ComponentPropsWithoutRef } from 'react';
import { Star } from 'lucide-react';

export type StarIconProps = Omit<ComponentPropsWithoutRef<typeof Star>, 'color' | 'fill'>;

export function StarIcon({
  size = 16,
  strokeWidth = 2.2,
  style,
  ...props
}: StarIconProps) {
  return (
    <Star
      aria-hidden="true"
      size={size}
      strokeWidth={strokeWidth}
      fill="currentColor"
      style={{
        color: '#ffd24a',
        filter: 'drop-shadow(0 2px 4px rgba(134, 76, 0, 0.32))',
        ...style,
      }}
      {...props}
    />
  );
}
