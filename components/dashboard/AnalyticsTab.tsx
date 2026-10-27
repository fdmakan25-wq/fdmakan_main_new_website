'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  propertiesTotal: number;
  propertiesActive: number;
  propertiesFeatured: number;
  ordersTotal: number;
  ordersPending: number;
  developersTotal: number;
  blogsTotal: number;
}

export default function AnalyticsTab() {
  const [stats, setStats] = useState<DashboardStats>({
    propertiesTotal: 0,
    propertiesActive: 0,
    propertiesFeatured: 0,
    ordersTotal: 0,
    ordersPending: 0,
    developersTotal: 0,
    blogsTotal: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const [propsRes, ordersRes, devRes, blogsRes] = await Promise.allSettled([
        fetch('/api/properties', { cache: 'no-store' }),
        fetch('/api/orders', { cache: 'no-store' }),
        fetch('/api/developers', { cache: 'no-store' }),
        fetch('/api/blogs', { cache: 'no-store' }),
      ]);

      const properties = propsRes.status === 'fulfilled' && propsRes.value.ok ? await propsRes.value.json() : [];
      const orders = ordersRes.status === 'fulfilled' && ordersRes.value.ok ? await ordersRes.value.json() : [];
      const developers = devRes.status === 'fulfilled' && devRes.value.ok ? await devRes.value.json() : [];
      const blogs = blogsRes.status === 'fulfilled' && blogsRes.value.ok ? await blogsRes.value.json() : [];

      setStats({
        propertiesTotal: properties.length,
        propertiesActive: properties.filter((p: any) => p.available).length,
        propertiesFeatured: properties.filter((p: any) => p.featured || p.showInPremium).length,
        ordersTotal: orders.length,
        ordersPending: orders.filter((o: any) => !o.status || o.status.toLowerCase() === 'pending' || o.status.toLowerCase() === 'new').length,
        developersTotal: developers.length,
        blogsTotal: blogs.length,
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Enquiries',
      value: stats.ordersTotal,
      sub: `${stats.ordersPending} action required`,
      gradient: 'from-blue-600 to-indigo-600',
      shadow: 'shadow-blue-500/10',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Listed Properties',
      value: stats.propertiesTotal,
      sub: `${stats.propertiesActive} active & available`,
      gradient: 'from-teal-600 to-emerald-600',
      shadow: 'shadow-teal-500/10',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      title: 'Developer Partners',
      value: stats.developersTotal,
      sub: 'Verified builders',
      gradient: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/10',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: 'Published Blogs',
      value: stats.blogsTotal,
      sub: 'SEO articles live',
      gradient: 'from-purple-600 to-pink-600',
      shadow: 'shadow-purple-500/10',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-white rounded-2xl border border-slate-200/80 p-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200/80 p-5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-blue via-[#1e4a7a] to-brand-teal p-6 sm:p-8 text-white shadow-lg shadow-navy-blue/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live System Overview
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back to FD Makan Admin
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-200 leading-relaxed">
            Monitor real-time site visits, enquiries, properties, and builders across Mumbai and Navi Mumbai.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-15 pointer-events-none hidden md:block">
          <svg className="w-full h-full text-white" viewBox="0 0 200 200" fill="currentColor">
            <polygon points="100,20 180,180 20,180" />
          </svg>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`relative bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 ${card.shadow}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.title}</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-2">{card.value}</p>
                <p className="text-xs font-medium text-slate-400 mt-1">{card.sub}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-md shadow-slate-900/10`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Section: Recent Enquiries & Portfolio Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Enquiries Preview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Customer Enquiries</h2>
              <p className="text-xs text-slate-500">Latest site visits and presentation requests</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-teal/10 text-brand-teal">
              Auto-Synced
            </span>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              No customer enquiries received yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentOrders.map((order, i) => (
                <div key={order._id || i} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {order.customer?.name || 'Prospective Buyer'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {order.propertyName || order.items?.[0]?.property || 'General Enquiry'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-medium text-slate-600">
                      {order.customer?.phone || 'No phone'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        order.status === 'Closed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : order.status === 'In Progress'
                          ? 'bg-sky-50 text-sky-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {order.status || 'New'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Portfolio Status Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Portfolio Health</h2>
            <p className="text-xs text-slate-500 mb-5">Inventory status & availability</p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Available Listings</span>
                  <span>{stats.propertiesTotal > 0 ? Math.round((stats.propertiesActive / stats.propertiesTotal) * 100) : 0}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.propertiesTotal > 0 ? (stats.propertiesActive / stats.propertiesTotal) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Featured & Premium</span>
                  <span>{stats.propertiesTotal > 0 ? Math.round((stats.propertiesFeatured / stats.propertiesTotal) * 100) : 0}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-orange rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.propertiesTotal > 0 ? (stats.propertiesFeatured / stats.propertiesTotal) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Delivery Gateway</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Resend Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

