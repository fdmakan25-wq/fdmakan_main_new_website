'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ToastProvider';
import Pagination from '@/components/dashboard/Pagination';

interface Order {
  _id: string;
  orderNumber: string;
  type?: 'order' | 'call_back' | 'site_visit' | 'presentation' | 'contact';
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  items?: Array<{
    property: string;
    quantity?: number;
    price?: number;
  }>;
  propertyName?: string;
  total?: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  metadata?: {
    visitDate?: string;
    rideType?: string;
    date?: string;
    [key: string]: unknown;
  };
  subject?: string;
  message?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const toast = useToast();

  useEffect(() => {
    fetchOrders();
    setCurrentPage(1);
  }, [statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = statusFilter !== 'all'
        ? `/api/orders?status=${statusFilter}`
        : '/api/orders';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setStatusUpdating(true);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update status');
      }

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus as any } : o))
      );
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, status: newStatus as any } : null);
      }
      toast.success(`Status updated to ${newStatus.toUpperCase()}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (!window.confirm(`Are you sure you want to delete enquiry #${orderNumber}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to delete enquiry');
      }

      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(null);
      }
      toast.success(`Enquiry #${orderNumber} deleted successfully`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete enquiry');
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const propName = order.items?.[0]?.property || order.propertyName || '';
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(q) ||
      (order.customer?.name || '').toLowerCase().includes(q) ||
      (order.customer?.email || '').toLowerCase().includes(q) ||
      (order.customer?.phone || '').includes(q) ||
      propName.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeBadge = (type: string = 'order') => {
    const styles = {
      order: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      call_back: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      site_visit: 'bg-amber-50 text-amber-700 border-amber-200',
      presentation: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      contact: 'bg-rose-50 text-rose-700 border-rose-200',
    };
    const labels = {
      order: 'Order',
      call_back: 'Call Back',
      site_visit: 'Site Visit',
      presentation: 'Online Demo',
      contact: 'Contact Form',
    };
    return (
      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider ${styles[type as keyof typeof styles] || styles.order}`}>
        {labels[type as keyof typeof labels] || type}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-500 font-medium">
          <div className="w-5 h-5 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
          Loading enquiries...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Enquiries & Orders</h1>
        <p className="text-gray-600 mt-2">Manage customer enquiries, callback requests, and site visits</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Total Requests</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-6 shadow-sm border border-yellow-200">
          <div className="text-sm font-medium text-yellow-800">Pending</div>
          <div className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-200">
          <div className="text-sm font-medium text-blue-800">Processing</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">{stats.processing}</div>
        </div>
        <div className="bg-green-50 rounded-xl p-6 shadow-sm border border-green-200">
          <div className="text-sm font-medium text-green-800">Resolved</div>
          <div className="text-3xl font-bold text-green-600 mt-2">{stats.delivered}</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by ID, customer name, email, phone, or property..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
            />
          </div>
          <div className="md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered / Resolved</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600">Requests will appear here when customers make enquiries</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID / Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Request Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedOrders.map((order) => {
                  const propName = order.items?.[0]?.property || order.propertyName || 'General Inquiry';
                  return (
                    <tr key={order._id} className="hover:bg-slate-50/70 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{order.orderNumber}</div>
                        <div className="mt-1.5">{getTypeBadge(order.type)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{order.customer?.name || 'Anonymous Lead'}</div>
                        <div className="text-xs text-gray-500">{order.customer?.email || 'No email provided'}</div>
                        {order.customer?.phone && (
                          <a
                            href={`tel:${order.customer.phone}`}
                            className="inline-flex items-center gap-1 text-xs text-brand-teal font-medium mt-1 hover:underline"
                          >
                            📞 {order.customer.phone}
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium line-clamp-2">
                          {propName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {(order.type === 'site_visit' || order.type === 'presentation') && order.metadata && (
                          <div className="text-xs">
                            <div className="font-semibold text-gray-800">
                              {order.type === 'site_visit' ? 'Site Visit' : 'Online Demo'}
                            </div>
                            {(order.metadata.visitDate || order.metadata.date) && (
                              <div className="text-gray-600 mt-0.5">
                                📅 {new Date(order.metadata.visitDate || order.metadata.date || '').toLocaleString()}
                              </div>
                            )}
                            {order.metadata.rideType && (
                              <span className="inline-block mt-1 text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                                Ride: {String(order.metadata.rideType)}
                              </span>
                            )}
                          </div>
                        )}
                        {order.type === 'call_back' && (
                          <div className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Immediate callback requested
                          </div>
                        )}
                        {order.type === 'order' && (
                          <div className="text-xs text-indigo-700 font-medium">Standard Booking</div>
                        )}
                        {order.notes && (
                          <div className="text-xs text-gray-500 mt-1 line-clamp-1 italic">
                            "{order.notes}"
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-full border ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 text-white bg-slate-900 hover:bg-brand-teal px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(order._id, order.orderNumber)}
                            className="inline-flex items-center gap-1 text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200/80 hover:border-rose-600 px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                            title="Delete enquiry"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredOrders.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredOrders.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
        )}
      </div>

      {/* Elegant Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-200 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center font-bold text-lg">
                  📋
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Enquiry #{selectedOrder.orderNumber}
                  </h2>
                  <p className="text-xs text-gray-500">
                    Received on {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status & Type Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/70">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Request Type:</span>
                  {getTypeBadge(selectedOrder.type)}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Status:</span>
                  <select
                    value={selectedOrder.status}
                    disabled={statusUpdating}
                    onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                    className="text-xs font-semibold border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-brand-red"
                  >
                    <option value="pending">PENDING</option>
                    <option value="confirmed">CONFIRMED</option>
                    <option value="processing">PROCESSING</option>
                    <option value="delivered">DELIVERED / RESOLVED</option>
                    <option value="cancelled">CANCELLED</option>
                  </select>
                </div>
              </div>

              {/* Customer Information Card */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Customer Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Full Name</label>
                    <div className="text-sm font-semibold text-gray-900">
                      {selectedOrder.customer?.name || 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Email Address</label>
                    <div className="text-sm font-semibold text-gray-900 break-all">
                      {selectedOrder.customer?.email ? (
                        <a href={`mailto:${selectedOrder.customer.email}`} className="text-brand-red hover:underline">
                          {selectedOrder.customer.email}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Phone Number</label>
                    <div className="text-sm font-semibold text-gray-900">
                      {selectedOrder.customer?.phone ? (
                        <a href={`tel:${selectedOrder.customer.phone}`} className="text-brand-teal hover:underline flex items-center gap-1">
                          📞 {selectedOrder.customer.phone}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Property Concerned
                </h3>
                <div className="text-base font-semibold text-gray-900">
                  {selectedOrder.items?.[0]?.property || selectedOrder.propertyName || 'General Inquiry'}
                </div>
                {selectedOrder.items?.[0]?.price ? (
                  <div className="text-xs text-gray-500 mt-1">
                    Listed Price: ₹{selectedOrder.items[0].price.toLocaleString()}
                  </div>
                ) : null}
              </div>

              {/* Visit / Demo Details (if applicable) */}
              {selectedOrder.metadata && Object.keys(selectedOrder.metadata).length > 0 && (
                <div className="bg-amber-50/60 rounded-xl p-5 border border-amber-200/80">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-3">
                    Appointment & Booking Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {(selectedOrder.metadata.visitDate || selectedOrder.metadata.date) && (
                      <div>
                        <span className="text-xs text-amber-800 block">Requested Date & Time</span>
                        <span className="font-semibold text-amber-950">
                          {new Date(String(selectedOrder.metadata.visitDate || selectedOrder.metadata.date)).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {selectedOrder.metadata.rideType && (
                      <div>
                        <span className="text-xs text-amber-800 block">Ride Preference</span>
                        <span className="font-semibold text-amber-950">
                          {String(selectedOrder.metadata.rideType)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes / Message */}
              {(selectedOrder.notes || selectedOrder.message || selectedOrder.subject) && (
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Customer Message & Notes
                  </h3>
                  {selectedOrder.subject && (
                    <div className="text-xs font-semibold text-gray-700 mb-1">
                      Subject: {selectedOrder.subject}
                    </div>
                  )}
                  <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selectedOrder.message || selectedOrder.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDeleteOrder(selectedOrder._id, selectedOrder.orderNumber)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-200 transition shadow-xs cursor-pointer active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Enquiry
              </button>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
