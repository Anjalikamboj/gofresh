import React, { useState, useEffect } from 'react';
import { Package, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import API from '../api';

function OrdersPage() {
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

  const getOrderIcon = (status) => {
    switch (status) {
      case 'created':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'blocked':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getOrderBadgeClass = (status) => {
    switch (status) {
      case 'created':
        return 'badge-order-created';
      case 'blocked':
        return 'badge-order-blocked';
      case 'delivered':
        return 'badge-order-delivered';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-6 animate-pulse">
              <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">Orders</h1>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
          <p className="text-muted-foreground">Your subscription orders will appear here once they're generated</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const scheduledDate = new Date(order.scheduled_for);
            
            return (
              <div
                key={order.id}
                className="bg-card rounded-2xl border border-border p-6"
                data-testid={`order-card-${order.id}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {getOrderIcon(order.status)}
                    <div>
                      <h3 className="text-lg font-semibold">Order #{order.id.slice(-8)}</h3>
                      <p className="text-sm text-muted-foreground">
                        Scheduled for: {format(scheduledDate, 'PPP')}
                      </p>
                    </div>
                  </div>
                  
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${getOrderBadgeClass(order.status)}`}
                    data-testid={`order-status-${order.id}`}
                  >
                    {order.status}
                  </span>
                </div>

                {order.status === 'blocked' && order.reason && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 mb-4">
                    <p className="text-sm text-destructive font-medium mb-1">Order Blocked</p>
                    <p className="text-xs text-destructive/80">
                      Reason: {order.reason.replace('_', ' ')}
                    </p>
                    {order.inventory_check && (
                      <div className="mt-2 text-xs">
                        {order.inventory_check.map((check, idx) => (
                          <div key={idx} className="text-destructive/70">
                            {check.sku}: Required {check.required}, Available {check.available}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-medium mb-3">Order Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm"
                        data-testid={`order-item-${order.id}-${item.sku}`}
                      >
                        <span className="text-muted-foreground">{item.sku}</span>
                        <span className="font-medium">Quantity: {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
