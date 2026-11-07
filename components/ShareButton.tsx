'use client';

import { useState, useCallback, MouseEvent } from 'react';
import { useToast } from '@/components/ToastProvider';

interface ShareButtonProps {
  url?: string;
  title: string;
  text?: string;
  className?: string;
  iconOnly?: boolean;
}

export default function ShareButton({
  url,
  title,
  text,
  className = '',
  iconOnly = false,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const handleShare = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      // Prevent parent link navigation
      e.preventDefault();
      e.stopPropagation();

      const shareUrl =
        url || (typeof window !== 'undefined' ? window.location.href : '');
      const shareData = {
        title: title || 'FD Makan Property',
        text: text || `Check out ${title} on FD Makan`,
        url: shareUrl,
      };

      // 1. Try native Web Share API (mobile & supported browsers)
      if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
          return;
        } catch (err: any) {
          // If user aborted / cancelled, do not fallback to copy
          if (err?.name === 'AbortError') return;
        }
      }

      // 2. Fallback: Copy link to clipboard
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(shareUrl);
        } else {
          // Legacy fallback
          const textArea = document.createElement('textarea');
          textArea.value = shareUrl;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        setCopied(true);
        toast.success('Property link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy share link:', err);
        toast.error('Could not copy link. Please copy from browser address bar.');
      }
    },
    [url, title, text, toast]
  );

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={handleShare}
        aria-label={`Share ${title}`}
        title={copied ? 'Link Copied!' : 'Share Property'}
        className={`w-9 h-9 rounded-full bg-white/95 backdrop-blur-md text-gray-700 hover:text-brand-red hover:bg-white shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 active:scale-90 border border-white/60 ${className}`}
      >
        {copied ? (
          <svg className="w-4 h-4 text-emerald-600 animate-in zoom-in-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-brand-red hover:text-white text-slate-700 transition-all duration-200 active:scale-95 shadow-2xs ${className}`}
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-emerald-700 font-bold">Copied!</span>
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>Share</span>
        </>
      )}
    </button>
  );
}

