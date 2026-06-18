'use client';

import { useState } from 'react';
import EnquiryIcon, { PhoneIcon } from '@/components/EnquiryIcon';

interface CallMeInstantlyCardProps {
  propertyName?: string;
  compact?: boolean;
}

export default function CallMeInstantlyCard({ propertyName, compact = false }: CallMeInstantlyCardProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const submit = async () => {
    if (!phoneNumber.trim()) {
      setFeedback({ type: 'error', text: 'Please enter your phone number' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'call_back',
          customer: {
            name: 'Website Lead',
            phone: phoneNumber,
            email: '',
          },
          items: propertyName ? [{ property: propertyName, quantity: 1, price: 0 }] : [],
          total: 0,
          notes: propertyName ? `Call back requested for ${propertyName}` : 'Call back requested from Contact page',
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to submit');

      setFeedback({
        type: 'success',
        text: data.emailSent === false
          ? 'Request received! Our team will call you shortly.'
          : 'We will call you shortly!',
      });
      setPhoneNumber('');
    } catch {
      setFeedback({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden shadow-soft border border-[#004d3d]/15">
      <div className={`bg-gradient-to-br from-[#004d3d] to-[#006b55] text-white ${compact ? 'px-3.5 py-3' : 'px-5 py-5'}`}>
        <div className="flex items-center gap-3 mb-3">
          <EnquiryIcon variant="white" size={compact ? 'sm' : 'md'}>
            <PhoneIcon className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          </EnquiryIcon>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-semibold text-green-200 uppercase tracking-wide">Available Now</span>
            </div>
            <h3 className={`font-bold ${compact ? 'text-sm' : 'text-lg'}`}>Call Me Instantly</h3>
          </div>
        </div>
        <p className={`text-white/70 mb-3 ${compact ? 'text-xs' : 'text-sm'}`}>
          Expert callback within 30 seconds
        </p>

        {feedback && (
          <div className={`mb-3 px-3 py-2 rounded-lg text-xs font-medium ${feedback.type === 'success' ? 'bg-white/15 text-green-100' : 'bg-red-500/20 text-red-100'}`}>
            {feedback.text}
          </div>
        )}

        <div className={compact ? 'flex gap-2' : 'space-y-2'}>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none">🇮🇳 +91</span>
            <input
              type="tel"
              placeholder="Your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`w-full pl-[4.25rem] pr-3 bg-white/10 border border-white/25 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 ${compact ? 'py-2 text-xs' : 'py-2.5 text-sm'}`}
            />
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className={`bg-white text-[#004d3d] font-bold rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-70 ${compact ? 'px-4 py-2 text-xs whitespace-nowrap' : 'w-full py-2.5 text-sm'}`}
          >
            <PhoneIcon className="w-4 h-4" />
            {loading ? 'Connecting...' : compact ? 'Call Now' : 'Call Me Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
