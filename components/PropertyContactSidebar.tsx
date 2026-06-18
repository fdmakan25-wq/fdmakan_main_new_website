'use client';

import React, { useState } from 'react';
import CallMeInstantlyCard from '@/components/CallMeInstantlyCard';
import EnquiryIcon, { BuildingIcon, CalendarIcon, VideoIcon, CarIcon } from '@/components/EnquiryIcon';

interface PropertyContactSidebarProps {
    propertyName?: string;
}

export default function PropertyContactSidebar({ propertyName = "Rustomjee Urban Woods" }: PropertyContactSidebarProps) {
    const [visitDate, setVisitDate] = useState('2026-09-01T15:09');
    const [rideType, setRideType] = useState('OLA');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'site_visit' | 'presentation'>('site_visit');

    const handleInquirySubmit = async (type: 'site_visit' | 'presentation') => {
        setLoading(true);
        setMessage(null);

        try {
            const body = {
                type: type,
                customer: {
                    name: 'Website Lead',
                    email: '',
                    phone: '',
                },
                items: [{ property: propertyName, quantity: 1, price: 0 }],
                total: 0,
                metadata: {
                    date: visitDate,
                    ...(type === 'site_visit' && { rideType })
                },
                notes: `${type === 'site_visit' ? 'Site visit' : 'Online presentation'} requested for ${propertyName}. Date: ${visitDate}${type === 'site_visit' ? `, Ride: ${rideType}` : ''}`
            };

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to submit');

            setMessage({
                type: 'success',
                text: data.emailSent === false
                    ? 'Enquiry saved! Our team will contact you soon.'
                    : type === 'site_visit' ? 'Site visit enquiry sent!' : 'Presentation enquiry sent!'
            });
        } catch {
            setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            {message && (
                <div className={`px-3.5 py-2.5 rounded-xl text-sm font-medium border ${
                    message.type === 'success'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                    {message.text}
                </div>
            )}

            <CallMeInstantlyCard propertyName={propertyName} compact />

            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
                <div className="flex bg-gray-50 p-1.5 m-3 mb-0 rounded-xl">
                    <button
                        onClick={() => setActiveTab('site_visit')}
                        className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                            activeTab === 'site_visit' ? 'bg-white text-navy-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <CalendarIcon className="w-3.5 h-3.5" />
                        Site Visit
                    </button>
                    <button
                        onClick={() => setActiveTab('presentation')}
                        className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                            activeTab === 'presentation' ? 'bg-white text-navy-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <VideoIcon className="w-3.5 h-3.5" />
                        Presentation
                    </button>
                </div>

                <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2.5 p-2.5 bg-navy-blue/5 rounded-xl border border-navy-blue/10">
                        <EnquiryIcon variant="navy" size="sm">
                            <BuildingIcon className="w-3.5 h-3.5" />
                        </EnquiryIcon>
                        <div className="min-w-0">
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Project</p>
                            <p className="text-sm font-bold text-navy-blue truncate" title={propertyName}>{propertyName}</p>
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                            <CalendarIcon className="w-3 h-3 text-brand-teal" />
                            Preferred Date & Time
                        </label>
                        <input
                            type="datetime-local"
                            className="w-full bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal"
                            value={visitDate}
                            onChange={(e) => setVisitDate(e.target.value)}
                        />
                    </div>

                    {activeTab === 'site_visit' && (
                        <>
                            <div>
                                <label className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                                    <CarIcon className="w-3 h-3 text-brand-teal" />
                                    Pickup Service
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['OLA', 'Not Required'].map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => setRideType(option)}
                                            className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                                                rideType === option
                                                    ? 'bg-navy-blue text-white border-navy-blue'
                                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            {option === 'OLA' ? (
                                                <>
                                                    <CarIcon className="w-3.5 h-3.5" />
                                                    Free Ola
                                                </>
                                            ) : (
                                                'Self Drive'
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <ul className="space-y-1.5">
                                {['Free pickup & drop', 'Visit 3 projects in one tour'].map((text) => (
                                    <li key={text} className="flex items-center gap-2 text-xs text-gray-500">
                                        <EnquiryIcon variant="teal" size="sm">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </EnquiryIcon>
                                        {text}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    {activeTab === 'presentation' && (
                        <div className="flex items-start gap-2.5 bg-brand-teal/5 p-3 rounded-xl border border-brand-teal/10">
                            <EnquiryIcon variant="teal" size="sm">
                                <VideoIcon className="w-3.5 h-3.5" />
                            </EnquiryIcon>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Get a personalized video walkthrough of this property from home.
                            </p>
                        </div>
                    )}

                    <button
                        onClick={() => handleInquirySubmit(activeTab)}
                        disabled={loading}
                        className={`w-full bg-navy-blue text-white font-bold py-2.5 rounded-xl text-sm hover:bg-[#1e4a7a] transition shadow-sm flex items-center justify-center gap-2 ${loading ? 'opacity-70' : ''}`}
                    >
                        {activeTab === 'site_visit' ? (
                            <>
                                <CalendarIcon className="w-4 h-4" />
                                {loading ? 'Sending...' : 'Book Free Site Visit'}
                            </>
                        ) : (
                            <>
                                <VideoIcon className="w-4 h-4" />
                                {loading ? 'Sending...' : 'Schedule Presentation'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
