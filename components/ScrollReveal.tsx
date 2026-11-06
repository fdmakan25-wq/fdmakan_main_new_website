'use client';

import React, { useEffect, useRef, useState } from 'react';

export type RevealAnimation =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'pop'
  | 'tilt-up';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: RevealAnimation;
  delay?: number; // in milliseconds
  duration?: number; // in milliseconds
  threshold?: number;
  className?: string;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 750,
  threshold = 0.1,
  className = '',
  once = true,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  const getStyle = (): React.CSSProperties => {
    if (isVisible) {
      return {
        opacity: 1,
        transform: 'none',
        filter: 'blur(0px)',
      };
    }

    switch (animation) {
      case 'fade-up':
        return {
          opacity: 0,
          transform: 'translate3d(0, 36px, 0)',
          filter: 'blur(4px)',
        };
      case 'fade-down':
        return {
          opacity: 0,
          transform: 'translate3d(0, -36px, 0)',
          filter: 'blur(4px)',
        };
      case 'fade-left':
        return {
          opacity: 0,
          transform: 'translate3d(-48px, 0, 0)',
          filter: 'blur(4px)',
        };
      case 'fade-right':
        return {
          opacity: 0,
          transform: 'translate3d(48px, 0, 0)',
          filter: 'blur(4px)',
        };
      case 'zoom-in':
        return {
          opacity: 0,
          transform: 'scale3d(0.92, 0.92, 1) translate3d(0, 20px, 0)',
          filter: 'blur(4px)',
        };
      case 'pop':
        return {
          opacity: 0,
          transform: 'scale3d(0.85, 0.85, 1)',
          filter: 'blur(6px)',
        };
      case 'tilt-up':
        return {
          opacity: 0,
          transform: 'perspective(1000px) rotateX(12deg) translate3d(0, 32px, 0)',
          filter: 'blur(4px)',
        };
      default:
        return {
          opacity: 0,
          transform: 'translate3d(0, 32px, 0)',
        };
    }
  };

  const animStyle = getStyle();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...animStyle,
        transitionProperty: 'opacity, transform, filter',
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: isVisible ? 'auto' : 'opacity, transform, filter',
      }}
    >
      {children}
    </div>
  );
}

