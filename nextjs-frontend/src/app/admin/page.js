'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import API from '@/lib/api';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const products = await API.getProducts();
      const lowStock = products.filter((p) => p.stock_on_hand < 20).length;
      const orders = await API.getOrders();

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: 0,
        lowStockProducts: lowStock,
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Low Stock Alert',
      value: stats.lowStockProducts,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers || 'N/A',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-6 animate-pulse">
              <div className="h-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to KhetiSe Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
              data-testid={`stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/admin/products')}
            className="p-4 border-2 border-dashed border-border rounded-xl hover:border-primary transition-colors text-left"
          >
            <Package className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Manage Products</h3>
            <p className="text-sm text-muted-foreground">Add, edit, or remove products</p>
          </button>

          <button
            onClick={() => router.push('/admin/orders')}
            className="p-4 border-2 border-dashed border-border rounded-xl hover:border-primary transition-colors text-left"
          >
            <ShoppingCart className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-semibold mb-1">View Orders</h3>
            <p className="text-sm text-muted-foreground">Check and manage all orders</p>
          </button>

          <button
            onClick={() => router.push('/admin/users')}
            className="p-4 border-2 border-dashed border-border rounded-xl hover:border-primary transition-colors text-left"
          >
            <Users className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Manage Users</h3>
            <p className="text-sm text-muted-foreground">View and manage user accounts</p>
          </button>
        </div>
      </div>
    </div>
  );
}
