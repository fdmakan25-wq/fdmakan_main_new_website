'use client';

import { useState, useEffect } from 'react';

interface Order {
  _id: string;
  orderNumber: string;
  type?: 'order' | 'call_back' | 'site_visit' | 'presentation';
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  items: Array<{
    property: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  metadata?: {
    visitDate?: string;
    rideType?: string;
    date?: string;
  };
  notes?: string;
  createdAt: string;
}

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

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

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.items?.[0]?.property?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getTypeBadge = (type: string = 'order') => {
    const styles = {
      order: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      call_back: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      site_visit: 'bg-amber-100 text-amber-800 border-amber-200',
      presentation: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    };
    const labels = {
      order: 'Order',
      call_back: 'Call Back',
      site_visit: 'Site Visit',
      presentation: 'Online Demo',
    };
    return (
      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border uppercase tracking-wider ${styles[type as keyof typeof styles]}`}>
        {labels[type as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Enquiries & Orders</h1>
        <p className="text-gray-600 mt-2">Manage customer enquiries and property bookings</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Total Requests</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Pending</div>
          <div className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Processing</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">{stats.processing}</div>
        </div>
        <div className="bg-green-50 rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Resolved</div>
          <div className="text-3xl font-bold text-green-600 mt-2">{stats.delivered}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by ID, customer name, email, or property..."
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
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID / Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{order.orderNumber}</div>
                      <div className="mt-1">{getTypeBadge(order.type)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                      <div className="text-xs text-gray-500">{order.customer.email}</div>
                      {order.customer.phone && (
                        <div className="text-xs text-brand-teal font-bold mt-1">📞 {order.customer.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">
                        {order.items?.[0]?.property || 'Property Inquiry'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {(order.type === 'site_visit' || order.type === 'presentation') && order.metadata && (
                        <div className="text-xs">
                          <div className="font-bold text-gray-700">
                            {order.type === 'site_visit' ? 'Visit' : 'Demo'}: {new Date(order.metadata.visitDate || order.metadata.date || '').toLocaleString()}
                          </div>
                          {order.type === 'site_visit' && <div className="text-gray-500">Ride: {order.metadata.rideType}</div>}
                        </div>
                      )}
                      {order.type === 'call_back' && (
                        <div className="text-xs text-emerald-600 font-medium">Immediate callback requested</div>
                      )}
                      {order.type === 'order' && (
                        <div className="text-xs text-gray-500">Standard Booking</div>
                      )}
                      {order.notes && <div className="text-[10px] text-gray-400 mt-1 line-clamp-1 italic">"{order.notes}"</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-[10px] font-bold rounded-full ${getStatusBadge(
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
                      <button
                        onClick={() => {
                          alert(`Details for ${order.orderNumber}:\n${JSON.stringify({
                            customer: order.customer,
                            metadata: order.metadata,
                            notes: order.notes
                          }, null, 2)}`);
                        }}
                        className="text-brand-red hover:text-brand-red-dark bg-brand-red/10 px-3 py-1 rounded-lg"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

