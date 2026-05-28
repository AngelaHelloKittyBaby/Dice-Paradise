import React, { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, useMotionValue } from 'framer-motion';
import trackImg from '@/assets/images/ui/buttons/滚动轨道.png';
import thumbImg from '@/assets/images/ui/buttons/滚动滑块.png';

interface CustomScrollbarProps {
  containerRef: React.RefObject<HTMLDivElement>;
  contentRef: React.RefObject<HTMLDivElement>;
}

export function CustomScrollbar({ containerRef, contentRef }: CustomScrollbarProps) {
  const [thumbHeight, setThumbHeight] = useState(60);
  const [isVisible, setIsVisible] = useState(false);
  const scrollY = useMotionValue(0);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const startScrollTop = useRef(0);

  const updateScroll = useCallback(() => {
    if (!containerRef.current || !contentRef.current) return;
    
    const container = containerRef.current;
    const { scrollTop, scrollHeight, clientHeight } = container;
    
    if (scrollHeight <= clientHeight) {
      setIsVisible(false);
      return;
    }
    
    setIsVisible(true);
    const scrollRatio = scrollTop / (scrollHeight - clientHeight);
    const trackHeight = clientHeight - 40; // 减去上下间距
    const calculatedThumbHeight = Math.max(40, (clientHeight / scrollHeight) * trackHeight);
    
    setThumbHeight(calculatedThumbHeight);
    scrollY.set(scrollRatio * (trackHeight - calculatedThumbHeight));
  }, [containerRef, contentRef, scrollY]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', updateScroll);
    window.addEventListener('resize', updateScroll);
    
    // 初始更新
    updateScroll();

    return () => {
      container.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, [containerRef, updateScroll]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartY.current = clientY;
    if (containerRef.current) {
      startScrollTop.current = containerRef.current.scrollTop;
    }
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current || !containerRef.current || !contentRef.current) return;
      
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaY = clientY - dragStartY.current;
      
      const container = containerRef.current;
      const trackHeight = container.clientHeight - 40;
      const scrollableHeight = container.scrollHeight - container.clientHeight;
      const thumbTrackSpace = trackHeight - thumbHeight;
      
      const scrollDelta = (deltaY / thumbTrackSpace) * scrollableHeight;
      container.scrollTop = startScrollTop.current + scrollDelta;
    };

    const handleEnd = () => {
      isDragging.current = false;
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [containerRef, contentRef, thumbHeight]);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-y-0 left-0 w-[24px] z-20">
      {/* 轨道 */}
      <div className="absolute inset-0 w-full h-full">
        <Image 
          src={trackImg} 
          alt="" 
          fill 
          className="object-contain opacity-80" 
        />
      </div>
      
      {/* 滑块 */}
      <motion.div
        className="absolute left-1/2 w-[32px] -translate-x-1/2 cursor-grab active:cursor-grabbing"
        style={{ 
          y: scrollY,
          height: thumbHeight,
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <Image 
          src={thumbImg} 
          alt="" 
          fill 
          className="object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" 
        />
      </motion.div>
    </div>
  );
}
