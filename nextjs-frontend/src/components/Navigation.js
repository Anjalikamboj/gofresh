'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Leaf, Calendar, Package, Settings, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [{ path: '/', label: 'Products', icon: Leaf, protected: false }];

  if (isAdmin) {
    navItems.push({ path: '/admin', label: 'Admin', icon: Settings, protected: true });
  }

  const handleLogout = () => {
    setShowProfileMenu(false);
    logout();
    router.push('/login');
  };

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2" data-testid="logo-link">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="text-2xl font-semibold tracking-tight">KhetiSe</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {navItems.map((item) => {
                if (item.protected && !isAuthenticated) return null;
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
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

            {isAuthenticated ? (
              <div className="relative ml-2 pl-2 border-l border-border" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                  data-testid="profile-menu-button"
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium hidden sm:inline">
                    {user?.full_name || user?.email}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${
                      showProfileMenu ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-border bg-muted/50">
                      <p className="text-sm font-medium truncate">{user?.full_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary transition-colors"
                        data-testid="dropdown-profile"
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">My Profile</span>
                      </Link>

                      <Link
                        href="/subscriptions"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary transition-colors"
                        data-testid="dropdown-subscriptions"
                      >
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">My Subscriptions</span>
                      </Link>

                      <Link
                        href="/orders"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary transition-colors"
                        data-testid="dropdown-orders"
                      >
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Orders</span>
                      </Link>
                    </div>

                    <div className="border-t border-border py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-destructive/10 text-destructive transition-colors"
                        data-testid="dropdown-logout"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="ml-2 pl-2 border-l border-border">
                <Link
                  href="/register"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  data-testid="register-nav-link"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
