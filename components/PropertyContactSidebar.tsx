'use client';

import React, { useState } from 'react';

interface PropertyContactSidebarProps {
    propertyName?: string;
}

export default function PropertyContactSidebar({ propertyName = "Rustomjee Urban Woods" }: PropertyContactSidebarProps) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [visitDate, setVisitDate] = useState('2026-09-01T15:09'); // Default or empty
    const [rideType, setRideType] = useState('OLA');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'site_visit' | 'presentation'>('site_visit');

    const handleCallMeNow = async () => {
        if (!phoneNumber) {
            setMessage({ type: 'error', text: 'Please enter your phone number' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'call_back',
                    customer: {
                        name: 'Lead (Call Me)',
                        phone: phoneNumber,
                        email: 'noreply@fdmakan.com'
                    },
                    items: [{ property: propertyName, quantity: 1, price: 0 }],
                    total: 0,
                    notes: `Call back requested for ${propertyName}`
                })
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Request sent! We will call you back soon.' });
                setPhoneNumber('');
            } else {
                throw new Error('Failed to send request');
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleInquirySubmit = async (type: 'site_visit' | 'presentation') => {
        setLoading(true);
        setMessage(null);

        try {
            const body = {
                type: type,
                customer: {
                    name: `Lead (${type === 'site_visit' ? 'Site Visit' : 'Presentation'})`,
                    email: 'noreply@fdmakan.com'
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

            if (response.ok) {
                setMessage({
                    type: 'success',
                    text: type === 'site_visit' ? 'Site visit booked successfully!' : 'Online presentation scheduled!'
                });
            } else {
                throw new Error('Failed to submit request');
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Success/Error Message */}
            {message && (
                <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {/* Call Me Instantly Card */}
            <div className="bg-[#004d3d] rounded-xl p-6 text-white shadow-lg transition-all hover:shadow-xl">
                <h3 className="text-xl font-bold mb-2">Call Me Instantly</h3>
                <p className="text-sm text-gray-200 mb-4">Hang Tight! Our Executive is calling you right now</p>

                <div className="space-y-4">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
                            <span className="mr-1">🇮🇳</span>
                        </div>
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleCallMeNow}
                        disabled={loading}
                        className={`w-full bg-white text-[#004d3d] font-bold py-3 rounded-full hover:bg-gray-100 transition shadow-md flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Processing...' : 'Call me now'}
                    </button>
                </div>
            </div>

            {/* Interactive Card */}
            <div className="bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100">
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('site_visit')}
                        className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'site_visit' ? 'text-navy-blue border-b-2 border-navy-blue' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Book Free Site Visit
                    </button>
                    <button
                        onClick={() => setActiveTab('presentation')}
                        className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'presentation' ? 'text-navy-blue border-b-2 border-navy-blue' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Online Presentation
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            readOnly
                            value={propertyName}
                            className="w-full bg-navy-blue text-white px-4 py-2 rounded-full text-sm pr-8"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <input
                            type="datetime-local"
                            className="w-full bg-gray-100 pl-10 pr-4 py-3 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-navy-blue appearance-none"
                            value={visitDate}
                            onChange={(e) => setVisitDate(e.target.value)}
                        />
                    </div>

                    {activeTab === 'site_visit' && (
                        <>
                            <div className="flex gap-4">
                                <label className="flex items-center text-sm font-bold text-black cursor-pointer">
                                    <input
                                        type="radio"
                                        name="ride"
                                        className="w-4 h-4 text-black mr-2 accent-black"
                                        checked={rideType === 'OLA'}
                                        onChange={() => setRideType('OLA')}
                                    />
                                    OLA
                                </label>
                                <label className="flex items-center text-sm font-normal text-gray-500 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="ride"
                                        className="w-4 h-4 text-gray-300 mr-2 accent-gray-400"
                                        checked={rideType === 'Not Required'}
                                        onChange={() => setRideType('Not Required')}
                                    />
                                    Not Required
                                </label>
                            </div>

                            <ul className="space-y-1 text-xs text-navy-blue opacity-80">
                                <li className="flex items-start">
                                    <span className="mr-1.5 mt-0.5 w-1 h-1 bg-navy-blue rounded-full"></span>
                                    Free Pick Up & Drop - Book Personal Ola
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-1.5 mt-0.5 w-1 h-1 bg-navy-blue rounded-full"></span>
                                    Visit Your Selected 3 Projects in One Tour
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-1.5 mt-0.5 w-1 h-1 bg-navy-blue rounded-full"></span>
                                    Just Visit & Decide later
                                </li>
                            </ul>
                        </>
                    )}

                    {activeTab === 'presentation' && (
                        <div className="bg-brand-teal/5 p-4 rounded-lg border border-brand-teal/10">
                            <p className="text-xs text-navy-blue/80 leading-relaxed italic">
                                Schedule a 1-on-1 online video presentation to explore the property from the comfort of your home.
                            </p>
                        </div>
                    )}

                    <button
                        onClick={() => handleInquirySubmit(activeTab)}
                        disabled={loading}
                        className={`w-full bg-navy-blue text-white font-bold py-3 rounded-lg hover:opacity-90 transition shadow-md flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Processing...' : activeTab === 'site_visit' ? 'Book Site Visit' : 'Schedule Presentation'}
                    </button>
                </div>
            </div>
        </div>
    );
}
