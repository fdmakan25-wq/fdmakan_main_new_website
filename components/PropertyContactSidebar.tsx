'use client';

import React, { useState, useEffect } from 'react';
import CallMeInstantlyCard from '@/components/CallMeInstantlyCard';
import EnquiryIcon, { BuildingIcon, CalendarIcon, VideoIcon, CarIcon } from '@/components/EnquiryIcon';

interface PropertyContactSidebarProps {
    propertyName?: string;
}

export default function PropertyContactSidebar({ propertyName = "Rustomjee Urban Woods" }: PropertyContactSidebarProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [visitDate, setVisitDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(11, 0, 0, 0);
        return tomorrow.toISOString().slice(0, 16);
    });
    const [rideType, setRideType] = useState('OLA');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'site_visit' | 'presentation'>('site_visit');
    const [confirmedData, setConfirmedData] = useState<{
        orderNumber?: string;
        propertyName: string;
        name: string;
        phone: string;
        email?: string;
        visitDate?: string;
        rideType?: string;
        type: 'site_visit' | 'presentation';
    } | null>(null);

    // Lock background scroll when confirmation modal is open
    useEffect(() => {
        if (!confirmedData) return;

        const originalOverflow = document.body.style.overflow;
        const originalTouchAction = document.body.style.touchAction;

        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setConfirmedData(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.touchAction = originalTouchAction;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [confirmedData]);

    const handleInquirySubmit = async (type: 'site_visit' | 'presentation') => {
        setMessage(null);

        // Client-side validations
        if (!name.trim()) {
            setMessage({ type: 'error', text: 'Please enter your full name.' });
            return;
        }

        const cleanedPhone = phone.trim();
        if (!cleanedPhone || cleanedPhone.replace(/\D/g, '').length < 10) {
            setMessage({ type: 'error', text: 'Please enter a valid 10-digit mobile number.' });
            return;
        }

        if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setMessage({ type: 'error', text: 'Please enter a valid email address.' });
            return;
        }

        setLoading(true);

        try {
            const body = {
                type: type,
                customer: {
                    name: name.trim(),
                    email: email.trim(),
                    phone: cleanedPhone,
                },
                propertyName,
                items: [{ property: propertyName, quantity: 1, price: 0 }],
                total: 0,
                metadata: {
                    date: visitDate,
                    ...(type === 'site_visit' && { rideType })
                },
                notes: `${type === 'site_visit' ? 'Site visit' : 'Online presentation'} requested for ${propertyName}. Preferred Date: ${visitDate}${type === 'site_visit' ? `, Ride: ${rideType}` : ''}`
            };

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || data.error || 'Failed to submit enquiry');
            }

            setMessage({
                type: 'success',
                text: data.emailSent === false
                    ? 'Enquiry saved! Our team will contact you soon.'
                    : type === 'site_visit' ? 'Site visit booked successfully! Confirmation sent.' : 'Presentation appointment booked successfully!'
            });

            // Set confirmation modal data
            setConfirmedData({
                orderNumber: data.orderNumber || data.order?.orderNumber,
                propertyName,
                name: name.trim(),
                phone: cleanedPhone,
                email: email.trim(),
                visitDate,
                rideType: type === 'site_visit' ? rideType : undefined,
                type,
            });

            // Reset form fields
            setName('');
            setEmail('');
            setPhone('');
        } catch (err: any) {
            setMessage({
                type: 'error',
                text: err?.message || 'Something went wrong. Please try again.'
            });
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
                        type="button"
                        onClick={() => setActiveTab('site_visit')}
                        className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                            activeTab === 'site_visit' ? 'bg-white text-navy-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <CalendarIcon className="w-3.5 h-3.5" />
                        Site Visit
                    </button>
                    <button
                        type="button"
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

                    {/* Contact Details Fields */}
                    <div className="space-y-2 pt-1 border-t border-gray-100">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Your Contact Details</p>

                        <div>
                            <input
                                type="text"
                                placeholder="Your Full Name *"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-gray-700 text-xs focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal"
                            />
                        </div>

                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                                🇮🇳 +91
                            </span>
                            <input
                                type="tel"
                                placeholder="Mobile Number *"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full pl-14 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-xs focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal"
                            />
                        </div>

                        <div>
                            <input
                                type="email"
                                placeholder="Email Address (Optional)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-gray-700 text-xs focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                            <CalendarIcon className="w-3 h-3 text-brand-teal" />
                            Preferred Date & Time
                        </label>
                        <input
                            type="datetime-local"
                            className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-gray-700 text-xs focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal"
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
                        type="button"
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

            {/* Confirmation Modal Popup */}
            {confirmedData && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 overscroll-contain overflow-y-auto"
                    onClick={() => setConfirmedData(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="enquiry-confirmed-title"
                >
                    <div
                        className="bg-white w-full max-w-md max-h-[90vh] my-auto rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Banner - Fixed top */}
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-5 sm:px-6 sm:py-6 text-white text-center relative flex-shrink-0">
                            <button
                                type="button"
                                onClick={() => setConfirmedData(null)}
                                className="absolute top-3.5 right-3.5 text-white/80 hover:text-white bg-black/15 hover:bg-black/30 rounded-full w-8 h-8 flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-white/40"
                                aria-label="Close confirmation modal"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2.5 backdrop-blur-xs border border-white/30 shadow-inner">
                                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 id="enquiry-confirmed-title" className="text-lg sm:text-xl font-bold">Enquiry Confirmed!</h3>
                            <p className="text-emerald-100 text-[11px] sm:text-xs mt-1 max-w-xs mx-auto">
                                Your booking request has been successfully dispatched to our team.
                            </p>
                        </div>

                        {/* Modal Body / Summary Details - Scrollable if screen height is constrained */}
                        <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 overflow-y-auto overscroll-contain flex-1">
                            <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200/70 space-y-2 text-xs divide-y divide-slate-200/50">
                                {confirmedData.orderNumber && (
                                    <div className="flex justify-between items-center pb-2">
                                        <span className="text-gray-500 font-medium">Reference ID</span>
                                        <span className="font-bold text-navy-blue font-mono text-[11px] sm:text-xs bg-navy-blue/5 px-2 py-0.5 rounded">{confirmedData.orderNumber}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center py-1.5 gap-2">
                                    <span className="text-gray-500 font-medium flex-shrink-0">Property</span>
                                    <span className="font-semibold text-gray-900 text-right truncate">{confirmedData.propertyName}</span>
                                </div>
                                <div className="flex justify-between items-center py-1.5 gap-2">
                                    <span className="text-gray-500 font-medium flex-shrink-0">Enquiry Type</span>
                                    <span className="font-semibold text-navy-blue capitalize text-right">
                                        {confirmedData.type === 'site_visit' ? 'Site Visit (Free Ride)' : 'Online Presentation'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-1.5 gap-2">
                                    <span className="text-gray-500 font-medium flex-shrink-0">Name</span>
                                    <span className="font-semibold text-gray-900 text-right truncate">{confirmedData.name}</span>
                                </div>
                                <div className="flex justify-between items-center py-1.5 gap-2">
                                    <span className="text-gray-500 font-medium flex-shrink-0">Phone</span>
                                    <span className="font-semibold text-gray-900 font-mono text-right">{confirmedData.phone}</span>
                                </div>
                                {confirmedData.email && (
                                    <div className="flex justify-between items-center py-1.5 gap-2">
                                        <span className="text-gray-500 font-medium flex-shrink-0">Email</span>
                                        <span className="font-semibold text-gray-900 text-right truncate max-w-[60%]">{confirmedData.email}</span>
                                    </div>
                                )}
                                {confirmedData.visitDate && (
                                    <div className="flex justify-between items-center py-1.5 gap-2">
                                        <span className="text-gray-500 font-medium flex-shrink-0">Scheduled Time</span>
                                        <span className="font-semibold text-gray-900 text-right">
                                            {new Date(confirmedData.visitDate).toLocaleString('en-IN', {
                                                dateStyle: 'medium',
                                                timeStyle: 'short',
                                            })}
                                        </span>
                                    </div>
                                )}
                                {confirmedData.rideType && (
                                    <div className="flex justify-between items-center pt-1.5 gap-2">
                                        <span className="text-gray-500 font-medium flex-shrink-0">Pickup Partner</span>
                                        <span className="font-bold text-brand-teal text-right uppercase tracking-wider">{confirmedData.rideType}</span>
                                    </div>
                                )}
                            </div>

                            <p className="text-center text-[11px] sm:text-xs text-gray-500 leading-relaxed px-1">
                                Our dedicated property advisor will call you shortly to confirm the appointment.
                            </p>

                            <button
                                type="button"
                                onClick={() => setConfirmedData(null)}
                                className="w-full bg-navy-blue hover:bg-[#1e4a7a] active:scale-[0.99] text-white py-3 rounded-xl font-bold text-sm transition shadow-md"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
