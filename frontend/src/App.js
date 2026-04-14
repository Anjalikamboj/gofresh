import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Leaf, ShoppingBag, Calendar, Package, Settings } from 'lucide-react';
import './App.css';

// Pages
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';
import CreateSubscriptionPage from './pages/CreateSubscriptionPage';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Products', icon: Leaf },
    { path: '/subscriptions', label: 'My Subscriptions', icon: Calendar },
    { path: '/orders', label: 'Orders', icon: Package },
    { path: '/admin', label: 'Admin', icon: Settings }
  ];
  
  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2" data-testid="logo-link">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="text-2xl font-semibold tracking-tight">GroFresh</span>
          </Link>
          
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="py-8">
          <Routes>
            <Route path="/" element={<ProductsPage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/create-subscription" element={<CreateSubscriptionPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
