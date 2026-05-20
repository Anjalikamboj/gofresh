'use client';

import React, { useState, useEffect } from 'react';
import { Package, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import API from '@/lib/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await API.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-[hsl(var(--success))]" />;
      case 'blocked':
        return <AlertCircle className="w-4 h-4 text-[hsl(var(--warning))]" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-[hsl(var(--success))]/15 text-[hsl(var(--success))] border border-[hsl(var(--success))]/25';
      case 'blocked':
        return 'bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))] border border-[hsl(var(--warning))]/25';
      case 'created':
        return 'bg-secondary text-secondary-foreground border border-border';
      default:
        return 'bg-muted text-muted-foreground border border-border';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
        <div className="bg-card rounded-2xl border border-border p-6 animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Orders</h1>
        <p className="text-muted-foreground">View and manage all customer orders</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
          <p className="text-muted-foreground">
            Orders will appear here once customers create subscriptions
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="admin-orders-table">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium">Order ID</th>
                  <th className="text-left px-6 py-4 text-sm font-medium">User ID</th>
                  <th className="text-left px-6 py-4 text-sm font-medium">Delivery Date</th>
                  <th className="text-left px-6 py-4 text-sm font-medium">Total Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-medium">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    data-testid={`order-row-${order.id}`}
                  >
                    <td className="px-6 py-4 font-mono text-sm">{order.id.slice(0, 8)}...</td>
                    <td className="px-6 py-4 font-mono text-sm">
                      {order.user_id?.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4">
                      {order.scheduled_for
                        ? new Date(order.scheduled_for).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ₹{order.total_amount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getStatusBadgeClass(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString()
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {orders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[hsl(var(--success))]/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-[hsl(var(--success))]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold">
                  {orders.filter((o) => o.status === 'delivered').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[hsl(var(--warning))]/10 rounded-lg">
                <AlertCircle className="w-5 h-5 text-[hsl(var(--warning))]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blocked</p>
                <p className="text-2xl font-bold">
                  {orders.filter((o) => o.status === 'blocked').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
