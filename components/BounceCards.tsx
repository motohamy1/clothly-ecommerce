'use client'

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useReducedMotion } from '@/lib/use-reduced-motion';

interface BounceCardsProps {
  className?: string;
  images?: string[];
  containerWidth?: number;
  containerHeight?: number;
  animationDelay?: number;
  animationStagger?: number;
  easeType?: string;
  transformStyles?: string[];
  enableHover?: boolean;
}

export default function BounceCards({
  className = '',
  images = [],
  containerWidth = 400,
  containerHeight = 400,
  animationDelay = 0.5,
  animationStagger = 0.06,
  easeType = 'elastic.out(1, 0.8)',
  transformStyles = [
    'rotate(10deg) translate(-170px)',
    'rotate(5deg) translate(-85px)',
    'rotate(-3deg)',
    'rotate(-10deg) translate(85px)',
    'rotate(2deg) translate(170px)'
  ],
  enableHover = false
}: BounceCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const autoplayStepRef = useRef(0);
  const pointerOverRef = useRef(false);

  useEffect(() => {
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.card',
        { scale: 0 },
        {
          scale: 1,
          stagger: animationStagger,
          ease: easeType,
          delay: animationDelay
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [animationDelay, animationStagger, easeType, reduceMotion]);

  useEffect(() => {
    if (reduceMotion || images.length < 2 || transformStyles.length < 2) return;

    const timer = window.setInterval(() => {
      if (pointerOverRef.current || !containerRef.current) return;

      autoplayStepRef.current = (autoplayStepRef.current + 1) % images.length;
      images.forEach((_, index) => {
        const card = containerRef.current?.querySelector(`.card-${index}`);
        const position = (index + autoplayStepRef.current) % transformStyles.length;
        if (!card) return;
        gsap.to(card, {
          transform: transformStyles[position] || 'none',
          duration: 1.05,
          ease: 'power3.inOut',
          overwrite: 'auto',
        });
      });
    }, 3800);

    return () => window.clearInterval(timer);
  }, [images, reduceMotion, transformStyles]);

  const getNoRotationTransform = (transformStr: string): string => {
    const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
    if (hasRotate) {
      return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)');
    } else if (transformStr === 'none') {
      return 'rotate(0deg)';
    } else {
      return `${transformStr} rotate(0deg)`;
    }
  };

  const getPushedTransform = (baseTransform: string, offsetX: number): string => {
    const translateRegex = /translate\(([-0-9.]+)px\)/;
    const match = baseTransform.match(translateRegex);
    if (match) {
      const currentX = parseFloat(match[1]);
      const newX = currentX + offsetX;
      return baseTransform.replace(translateRegex, `translate(${newX}px)`);
    } else {
      return baseTransform === 'none' ? `translate(${offsetX}px)` : `${baseTransform} translate(${offsetX}px)`;
    }
  };

  const pushSiblings = (hoveredIdx: number) => {
    const q = gsap.utils.selector(containerRef);
    if (!enableHover || !containerRef.current) return;

    images.forEach((_, i) => {
      const selector = q(`.card-${i}`);
      gsap.killTweensOf(selector);

      const position = (i + autoplayStepRef.current) % transformStyles.length;
      const baseTransform = transformStyles[position] || 'none';

      if (i === hoveredIdx) {
        const noRotation = getNoRotationTransform(baseTransform);
        gsap.to(selector, {
          transform: noRotation,
          duration: 0.4,
          ease: 'back.out(1.4)',
          overwrite: 'auto'
        });
      } else {
        const offsetX = i < hoveredIdx ? -160 : 160;
        const pushedTransform = getPushedTransform(baseTransform, offsetX);

        const distance = Math.abs(hoveredIdx - i);
        const delay = distance * 0.05;

        gsap.to(selector, {
          transform: pushedTransform,
          duration: 0.4,
          ease: 'back.out(1.4)',
          delay,
          overwrite: 'auto'
        });
      }
    });
  };

  const resetSiblings = () => {
    if (!enableHover || !containerRef.current) return;
    const q = gsap.utils.selector(containerRef);

    images.forEach((_, i) => {
      const selector = q(`.card-${i}`);
      gsap.killTweensOf(selector);

      const position = (i + autoplayStepRef.current) % transformStyles.length;
      const baseTransform = transformStyles[position] || 'none';
      gsap.to(selector, {
        transform: baseTransform,
        duration: 0.4,
        ease: 'back.out(1.4)',
        overwrite: 'auto'
      });
    });
  };

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      ref={containerRef}
      onPointerEnter={() => { pointerOverRef.current = true; }}
      onPointerLeave={() => { pointerOverRef.current = false; }}
      style={{
        width: containerWidth,
        height: containerHeight
      }}
    >
      {images.map((src, idx) => (
        <div
          key={idx}
          className={`card card-${idx} absolute w-[200px] aspect-square border-8 border-white rounded-[30px] overflow-hidden`}
          style={{
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            transform: transformStyles[idx] || 'none'
          }}
          onMouseEnter={() => pushSiblings(idx)}
          onMouseLeave={resetSiblings}
        >
          <Image className="w-full h-full object-cover" src={src} alt={`card-${idx}`} fill sizes="200px" />
        </div>
      ))}
    </div>
  );
}
