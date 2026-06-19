import React from 'react';
import { IconBanknotes } from '@/components/property/PropertySectionIcons';

const stats = [
  {
    value: '9+',
    unit: 'Years',
    label: 'Industry Experience',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
  },
  {
    value: '1.2L+',
    unit: 'Visits',
    label: 'Site Visits Done',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
  },
  {
    value: '8,500+',
    unit: 'Families',
    label: 'Happy Home Buyers',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    value: '₹8000Cr+',
    unit: 'Sold',
    label: 'Worth of Homes Sold',
    icon: <IconBanknotes />,
  },
];

export default function PropertyStatsSidebar() {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-soft-lg border border-gray-100 bg-white">
      <div className="bg-gradient-to-br from-navy-blue to-[#1e4a7a] px-5 py-5 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full mb-3">
          <svg className="w-3.5 h-3.5 text-brand-teal" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-white/90 text-[11px] font-bold uppercase tracking-wider">Trusted Partner</span>
        </div>
        <h3 className="text-white font-extrabold text-base">FD MAKAN</h3>
        <p className="text-white/60 text-xs mt-1">Your Real Estate Experts</p>
      </div>

      <div className="divide-y divide-gray-100">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="px-5 py-4 hover:bg-gray-50/80 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center group-hover:bg-brand-teal group-hover:text-white transition-all">
                {stat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-xl font-extrabold text-navy-blue leading-none">{stat.value}</span>
                  <span className="text-xs font-bold text-brand-teal uppercase">{stat.unit}</span>
                </div>
                <p className="text-xs text-gray-500 font-medium mt-1 leading-snug">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3.5 bg-gradient-to-r from-brand-teal/5 to-brand-red/5 border-t border-gray-100">
        <p className="text-xs text-center text-gray-500 font-medium leading-relaxed">
          RERA Registered · Zero Brokerage · Free Site Visits
        </p>
      </div>
    </div>
  );
}
