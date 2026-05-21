'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { DESKTOP_STAGE_SIZE } from '@/constants';
import { getResponsiveStageMetrics } from '@/utils/responsiveStage';

export interface ResponsiveStageProps {
  children: React.ReactNode;
  designWidth?: number;
  designHeight?: number;
  backgroundImage: string;
  className?: string;
  viewportClassName?: string;
  stageClassName?: string;
}

export const ResponsiveStage: React.FC<ResponsiveStageProps> = ({
  children,
  designWidth = DESKTOP_STAGE_SIZE.width,
  designHeight = DESKTOP_STAGE_SIZE.height,
  backgroundImage,
  className,
  viewportClassName,
  stageClassName,
}) => {
  const [viewportSize, setViewportSize] = useState({
    width: designWidth,
    height: designHeight,
  });

  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewportSize();
    window.addEventListener('resize', updateViewportSize);

    return () => window.removeEventListener('resize', updateViewportSize);
  }, []);

  const metrics = useMemo(
    () =>
      getResponsiveStageMetrics({
        viewportWidth: viewportSize.width,
        viewportHeight: viewportSize.height,
        designWidth,
        designHeight,
      }),
    [designHeight, designWidth, viewportSize.height, viewportSize.width]
  );

  return (
    <main className={className}>
      <div
        className={viewportClassName}
        style={{
          width: metrics.scaledWidth,
          height: metrics.scaledHeight,
        }}
      >
        <div
          className={stageClassName}
          style={{
            width: designWidth,
            height: designHeight,
            backgroundImage: `url(${backgroundImage})`,
            transform: `scale(${metrics.scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </main>
  );
};
