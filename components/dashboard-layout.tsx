'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { ToastProvider } from '@/components/ToastProvider';

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'analytics', label: 'Analytics', icon: '📊' },
  { id: 'properties', label: 'Properties', icon: '🏠' },
  { id: 'orders', label: 'Enquiries', icon: '📋' },
  { id: 'developers', label: 'Developers', icon: '🏢' },
  { id: 'locations', label: 'Locations', icon: '📍' },
  { id: 'amenities', label: 'Amenities', icon: '✨' },
  { id: 'blogs', label: 'Blogs', icon: '📝' },
  { id: 'banners', label: 'Banners', icon: '🖼️' },
  { id: 'customers', label: 'Customers', icon: '👥' },
];

export default function DashboardLayout({ children, activeTab, onTabChange }: DashboardLayoutProps) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50/70 flex flex-col font-sans">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Brand & Home Link */}
              <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-2 group transition">
                  <Image
                    src="/fd_makan_logo-removebg-preview.png"
                    alt="FD MAKAN Logo"
                    width={180}
                    height={50}
                    className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                    priority
                  />
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Admin Suite
                  </span>
                </Link>

                <Link
                  href="/"
                  target="_blank"
                  className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-teal transition px-2.5 py-1.5 rounded-lg hover:bg-slate-100/70"
                >
                  <span>View Live Website</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>

              {/* Admin Profile & Actions */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <p className="text-xs font-bold text-slate-800 leading-tight">FD Makan Master</p>
                  <p className="text-[11px] font-medium text-slate-400">admin@fdmakan.com</p>
                </div>

                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-blue via-[#1e4a7a] to-brand-teal flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-white">
                  FD
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    window.location.href = '/admin/login';
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition shadow-xs cursor-pointer"
                  title="Sign out of Admin"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Navigation Pill Bar */}
        <div className="bg-white border-b border-slate-200/80 shadow-xs sticky top-16 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1.5 sm:space-x-2 py-2.5 overflow-x-auto scrollbar-hide" aria-label="Tabs">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`
                      flex items-center gap-2 py-2 px-3.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-150 cursor-pointer
                      ${
                        isActive
                          ? 'bg-navy-blue text-white shadow-sm ring-1 ring-navy-blue/20'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }
                    `}
                  >
                    <span className="text-base leading-none">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Workspace */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}

