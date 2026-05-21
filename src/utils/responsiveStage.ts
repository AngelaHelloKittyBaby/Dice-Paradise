interface ResponsiveStageInput {
  viewportWidth: number;
  viewportHeight: number;
  designWidth: number;
  designHeight: number;
}

interface ResponsiveStageMetrics {
  scale: number;
  scaledWidth: number;
  scaledHeight: number;
}

function round(value: number, precision = 5): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

/**
 * 计算固定设计画布完整放入当前视口所需的等比缩放尺寸。
 */
export function getResponsiveStageMetrics({
  viewportWidth,
  viewportHeight,
  designWidth,
  designHeight,
}: ResponsiveStageInput): ResponsiveStageMetrics {
  if (viewportWidth <= 0 || viewportHeight <= 0 || designWidth <= 0 || designHeight <= 0) {
    return {
      scale: 1,
      scaledWidth: designWidth,
      scaledHeight: designHeight,
    };
  }

  const scale = round(Math.min(viewportWidth / designWidth, viewportHeight / designHeight));

  return {
    scale,
    scaledWidth: round(designWidth * scale, 2),
    scaledHeight: round(designHeight * scale, 2),
  };
}
