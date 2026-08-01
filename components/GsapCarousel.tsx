'use client';

import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { gsap } from 'gsap';
import styled from 'styled-components';
import { useReducedMotion } from '@/lib/use-reduced-motion';

interface GsapCarouselProps {
  children: React.ReactNode;
  itemWidth: number;
  gap: number;
}

interface ScrollState {
  canPrev: boolean;
  canNext: boolean;
}

const INITIAL_STATE: ScrollState = { canPrev: false, canNext: true };

function createCarouselStore() {
  let state: ScrollState = INITIAL_STATE;
  const listeners = new Set<() => void>();

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot() {
      return state;
    },
    getServerSnapshot() {
      return INITIAL_STATE;
    },
    set(next: ScrollState) {
      if (state.canPrev === next.canPrev && state.canNext === next.canNext) return;
      state = next;
      listeners.forEach((l) => l());
    },
  };
}

type CarouselStore = ReturnType<typeof createCarouselStore>;

export default function GsapCarousel({ children, itemWidth, gap }: GsapCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [store] = useState(createCarouselStore);
  const reduceMotion = useReducedMotion();

  const { canPrev, canNext } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  const measure = (): ScrollState => {
    if (!containerRef.current || !trackRef.current) return INITIAL_STATE;
    const x = gsap.getProperty(trackRef.current, 'x') as number;
    const max = Math.max(
      0,
      trackRef.current.scrollWidth - containerRef.current.offsetWidth,
    );
    return { canPrev: x < 0, canNext: Math.abs(x) < max - 1 };
  };

  useEffect(() => {
    store.set(measure());

    const handleResize = () => store.set(measure());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [children, store]);

  const scroll = (direction: 'prev' | 'next') => {
    if (!containerRef.current || !trackRef.current) return;
    const step = itemWidth + gap;
    const x = gsap.getProperty(trackRef.current, 'x') as number;
    const max = Math.max(
      0,
      trackRef.current.scrollWidth - containerRef.current.offsetWidth,
    );

    const targetX =
      direction === 'prev'
        ? Math.min(0, x + step)
        : Math.max(-max, x - step);

    if (reduceMotion) {
      gsap.set(trackRef.current, { x: targetX });
      store.set(measure());
      return;
    }

    gsap.to(trackRef.current, {
      x: targetX,
      duration: 0.5,
      ease: 'power2.out',
      onUpdate: () => store.set(measure()),
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
        <div className="arrow-shell">
          <button
            className="arrow"
            onClick={() => scroll('prev')}
            disabled={!canPrev}
            aria-label="Previous"
          >
            ‹
          </button>
        </div>
        <div className="arrow-shell">
          <button
            className="arrow"
            onClick={() => scroll('next')}
            disabled={!canNext}
            aria-label="Next"
          >
            ›
          </button>
        </div>
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
    justify-content: center;
    gap: 8px;
    margin-top: 12px;
    padding-right: 4px;
  }

  .arrow-shell {
    background: oklch(0.2 0.03 98 / 0.04);
    border: 1px solid oklch(0.2 0.03 98 / 0.12);
    border-radius: 50%;
    padding: 3px;
    display: inline-flex;
    transition: all 0.5s cubic-bezier(0.32, 0.72, 0, 1);
  }

  .arrow-shell:not(:has(.arrow:disabled)):hover {
    background: oklch(0.2 0.03 98 / 0.08);
    transform: scale(1.08);
  }

  .arrow {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1.5px solid oklch(0.2 0.03 98 / 0.6);
    background: oklch(0.943 0.051 98.2);
    color: oklch(0.2 0.03 98);
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    box-shadow: inset 0 1px 1px oklch(1 0 0 / 0.5);
  }

  .arrow:hover:not(:disabled) {
    background: oklch(0.2 0.03 98);
    color: oklch(0.943 0.051 98.2);
    border-color: transparent;
  }

  .arrow:active:not(:disabled) {
    transform: scale(0.95);
  }

  .arrow:disabled {
    opacity: 0.25;
    cursor: default;
  }
`;
