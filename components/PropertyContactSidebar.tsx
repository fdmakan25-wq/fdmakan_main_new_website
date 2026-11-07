'use client';

import React, { useState } from 'react';
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
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
                    onClick={() => setConfirmedData(null)}
                >
                    <div
                        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Banner */}
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-6 text-white text-center relative">
                            <button
                                type="button"
                                onClick={() => setConfirmedData(null)}
                                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 rounded-full w-8 h-8 flex items-center justify-center transition"
                                aria-label="Close"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-xs border border-white/30">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold">Enquiry Confirmed!</h3>
                            <p className="text-emerald-100 text-xs mt-1">
                                Your booking request has been successfully dispatched to our team.
                            </p>
                        </div>

                        {/* Modal Body / Summary Details */}
                        <div className="p-6 space-y-4">
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70 space-y-2 text-xs">
                                {confirmedData.orderNumber && (
                                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                                        <span className="text-gray-500 font-medium">Reference ID</span>
                                        <span className="font-bold text-navy-blue font-mono">{confirmedData.orderNumber}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-gray-500 font-medium">Property</span>
                                    <span className="font-semibold text-gray-900 text-right max-w-[60%] truncate">{confirmedData.propertyName}</span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-gray-500 font-medium">Enquiry Type</span>
                                    <span className="font-semibold text-navy-blue capitalize">
                                        {confirmedData.type === 'site_visit' ? 'Site Visit with Free Ride' : 'Online Presentation'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-gray-500 font-medium">Name</span>
                                    <span className="font-semibold text-gray-900">{confirmedData.name}</span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-gray-500 font-medium">Phone</span>
                                    <span className="font-semibold text-gray-900">{confirmedData.phone}</span>
                                </div>
                                {confirmedData.email && (
                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-gray-500 font-medium">Email</span>
                                        <span className="font-semibold text-gray-900">{confirmedData.email}</span>
                                    </div>
                                )}
                                {confirmedData.visitDate && (
                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-gray-500 font-medium">Scheduled Date/Time</span>
                                        <span className="font-semibold text-gray-900">
                                            {new Date(confirmedData.visitDate).toLocaleString('en-IN', {
                                                dateStyle: 'medium',
                                                timeStyle: 'short',
                                            })}
                                        </span>
                                    </div>
                                )}
                                {confirmedData.rideType && (
                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-gray-500 font-medium">Pickup Partner</span>
                                        <span className="font-bold text-brand-teal">{confirmedData.rideType}</span>
                                    </div>
                                )}
                            </div>

                            <p className="text-center text-xs text-gray-500 leading-relaxed">
                                Our dedicated property advisor will call you shortly to confirm the appointment.
                            </p>

                            <button
                                type="button"
                                onClick={() => setConfirmedData(null)}
                                className="w-full bg-navy-blue hover:bg-[#1e4a7a] text-white py-3 rounded-xl font-bold text-sm transition shadow-md"
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
