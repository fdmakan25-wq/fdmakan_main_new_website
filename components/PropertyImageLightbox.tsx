'use client';

import { useState, useEffect, useCallback } from 'react';

interface PropertyImageLightboxProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
  onIndexChange?: (index: number) => void;
}

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.25;

export default function PropertyImageLightbox({
  images,
  initialIndex,
  isOpen,
  onClose,
  propertyName,
  onIndexChange,
}: PropertyImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (isOpen) setIndex(initialIndex);
  }, [isOpen, initialIndex]);

  useEffect(() => {
    setZoom(1);
  }, [index]);

  const goTo = useCallback(
    (nextIndex: number) => {
      const wrapped =
        ((nextIndex % images.length) + images.length) % images.length;
      setIndex(wrapped);
      onIndexChange?.(wrapped);
    },
    [images.length, onIndexChange]
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  const zoomIn = () => setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)));
  const zoomOut = () => setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)));
  const resetZoom = () => setZoom(1);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-') zoomOut();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, goPrev, goNext, onClose]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label={`${propertyName} photo gallery`}
    >
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-4 py-3 md:px-6 shrink-0">
        <p className="text-white/90 text-sm font-medium truncate max-w-[40%]">
          {propertyName}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-white/70 text-sm hidden sm:inline">
            {index + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= ZOOM_MIN}
            className="w-10 h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition"
            aria-label="Zoom out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            type="button"
            onClick={resetZoom}
            className="min-w-[3rem] h-10 px-2 rounded-lg bg-white/10 text-white hover:bg-white/20 text-xs font-semibold transition"
            aria-label="Reset zoom"
            title="Reset zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= ZOOM_MAX}
            className="w-10 h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition"
            aria-label="Zoom in"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition ml-1"
            aria-label="Close gallery"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main image area */}
      <div className="relative flex-1 min-h-0 flex items-center justify-center px-14 md:px-20">
        {images.length > 1 && (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition backdrop-blur-sm"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div
          className="w-full h-full overflow-auto flex items-center justify-center cursor-grab active:cursor-grabbing"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[index]}
            alt={`${propertyName} - photo ${index + 1}`}
            className="max-w-full max-h-full object-contain transition-transform duration-200 ease-out select-none"
            style={{ transform: `scale(${zoom})` }}
            draggable={false}
          />
        </div>

        {images.length > 1 && (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition backdrop-blur-sm"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Bottom thumbnails */}
      {images.length > 1 && (
        <div className="shrink-0 px-4 py-4 md:px-6 border-t border-white/10">
          <div className="flex gap-2 justify-center overflow-x-auto scrollbar-hide max-w-4xl mx-auto">
            {images.map((img, i) => (
              <button
                key={`${img}-${i}`}
                type="button"
                onClick={() => goTo(i)}
                className={`flex-shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden border-2 transition ${
                  i === index
                    ? 'border-white ring-2 ring-white/40 opacity-100'
                    : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
