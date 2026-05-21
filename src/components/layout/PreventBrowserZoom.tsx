'use client';

import { useEffect } from 'react';

const zoomKeys = new Set(['+', '-', '=', '_', '0']);

export function PreventBrowserZoom() {
  useEffect(() => {
    const preventWheelZoom = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
    };

    const preventKeyboardZoom = (event: KeyboardEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      if (!zoomKeys.has(event.key)) return;
      event.preventDefault();
    };

    const preventGestureZoom = (event: Event) => {
      event.preventDefault();
    };

    window.addEventListener('wheel', preventWheelZoom, { passive: false });
    window.addEventListener('keydown', preventKeyboardZoom);
    window.addEventListener('gesturestart', preventGestureZoom);
    window.addEventListener('gesturechange', preventGestureZoom);

    return () => {
      window.removeEventListener('wheel', preventWheelZoom);
      window.removeEventListener('keydown', preventKeyboardZoom);
      window.removeEventListener('gesturestart', preventGestureZoom);
      window.removeEventListener('gesturechange', preventGestureZoom);
    };
  }, []);

  return null;
}
