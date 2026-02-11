import React from 'react';

export default function PropertyStatsSidebar() {
    const stats = [
        {
            label: "Experience",
            value: "9+",
            unit: "YEARS",
            labelType: "badge",
            icon: (
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-9 h-9">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
            )
        },
        {
            label: "Site Visit Done",
            value: "1.2 Lacs",
            unit: "+",
            labelType: "badge",
            icon: (
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-9 h-9">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
            )
        },
        {
            label: "Happy Home Buyers",
            value: "8,500+",
            unit: "",
            labelType: "text",
            icon: (
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-9 h-9">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
            )
        },
        {
            label: "Worth Home Sold",
            value: "8000 Cr+",
            unit: "",
            labelType: "badge-below",
            icon: (
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-9 h-9">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
            )
        }
    ];

    return (
        <div className="flex flex-col gap-0 w-full rounded-xl overflow-hidden shadow-soft-lg border border-gray-100">
            {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center">
                    {/* Dark Block Container */}
                    <div className="w-full bg-navy-blue p-4 flex flex-col items-center text-center gap-3 relative z-10 transition-colors hover:bg-navy-blue/95">
                        {/* Icon */}
                        <div className="text-white/60">
                            {stat.icon}
                        </div>

                        {/* Value & Multi-line Unit */}
                        <div className="flex flex-col items-center leading-none tracking-tight">
                            <span className="text-2xl font-black text-white">{stat.value}</span>
                            {stat.unit && (
                                <span className="text-xl font-black text-white mt-1 uppercase tracking-tighter">{stat.unit}</span>
                            )}
                        </div>

                        {/* Badge inside dark block */}
                        {stat.labelType === 'badge' && (
                            <div className="bg-white rounded-lg px-3 py-2 shadow-inner mt-1 w-[90%] mx-auto">
                                <span className="text-navy-blue font-bold text-[11px] leading-tight block">
                                    {stat.label}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Label below if NOT a badge inside */}
                    {stat.labelType === 'text' && (
                        <div className="w-full bg-white py-4 text-center">
                            <span className="text-navy-blue font-bold text-sm leading-tight block px-2">
                                {stat.label}
                            </span>
                        </div>
                    )}

                    {/* Badge below if badge-below */}
                    {stat.labelType === 'badge-below' && (
                        <div className="w-full bg-white flex flex-col items-center">
                            <div className="w-full bg-navy-blue h-10 relative z-0"></div>
                            <div className="bg-white border-2 border-slate-100 rounded-lg px-4 py-2 shadow-md -mt-7 mb-4 z-20 mx-2 w-[90%]">
                                <span className="text-navy-blue font-bold text-[11px] leading-tight block text-center">
                                    {stat.label}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
