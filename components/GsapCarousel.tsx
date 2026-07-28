'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styled from 'styled-components';

interface GsapCarouselProps {
  children: React.ReactNode;
  itemWidth: number;
  gap: number;
}

export default function GsapCarousel({ children, itemWidth, gap }: GsapCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const getMaxScroll = () => {
    if (!containerRef.current || !trackRef.current) return 0;
    const containerW = containerRef.current.offsetWidth;
    const trackW = trackRef.current.scrollWidth;
    return Math.max(0, trackW - containerW);
  };

  const getCurrentX = () => {
    if (!trackRef.current) return 0;
    return gsap.getProperty(trackRef.current, 'x') as number;
  };

  const updateButtons = () => {
    const x = getCurrentX();
    const max = getMaxScroll();
    setCanPrev(x < 0);
    setCanNext(Math.abs(x) < max - 1);
  };

  useEffect(() => {
    updateButtons();
    const handleResize = () => updateButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [children]);

  const scroll = (direction: 'prev' | 'next') => {
    if (!trackRef.current) return;
    const step = itemWidth + gap;
    const currentX = getCurrentX();
    const max = getMaxScroll();

    let targetX: number;
    if (direction === 'prev') {
      targetX = Math.min(0, currentX + step);
    } else {
      targetX = Math.max(-max, currentX - step);
    }

    gsap.to(trackRef.current, {
      x: targetX,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: updateButtons,
    });
  };

  return (
    <StyledWrapper>
      <div className="carousel-container" ref={containerRef}>
        <div
          className="carousel-track"
          ref={trackRef}
          style={{ gap: `${gap}px` }}
        >
          {children}
        </div>
      </div>
      <div className="controls">
        <button
          className="arrow"
          onClick={() => scroll('prev')}
          disabled={!canPrev}
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          className="arrow"
          onClick={() => scroll('next')}
          disabled={!canNext}
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: relative;
  width: 100%;

  .carousel-container {
    overflow: hidden;
    width: 100%;
  }

  .carousel-track {
    display: flex;
    will-change: transform;
  }

  .controls {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 12px;
    padding-right: 4px;
  }

  .arrow {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #02343F;
    background: transparent;
    color: #02343F;
    font-size: 22px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, color 0.2s, opacity 0.2s;
  }

  .arrow:hover:not(:disabled) {
    background: #02343F;
    color: #fff;
  }

  .arrow:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;
