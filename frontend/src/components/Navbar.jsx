import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrafficStore } from '../store/useTrafficStore';
import { Menu, X, Radio, LogOut, User as UserIcon } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Intersections', path: '/intersections' },
  { name: 'City Map', path: '/map' },
  { name: 'Reports', path: '/reports' },
  { name: 'Analytics', path: '/analytics' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const location = useLocation();
  const { token, user, logout } = useTrafficStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8">
      <nav className="max-w-7xl mx-auto flex items-center justify-between bg-panel/75 backdrop-blur-md border border-border px-6 py-3 rounded-full shadow-premium">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 font-display font-bold tracking-tight text-lg">
          <Radio className="h-5 w-5 text-brand-blue animate-pulse" />
          <span>TRANSIT<span className="text-brand-blue">.OS</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className="relative px-4 py-1.5 text-sm font-medium transition-colors hover:text-primary text-primary-muted duration-200"
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    className="absolute inset-0 bg-surface border border-border rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Auth Button */}
        <div className="hidden lg:flex items-center space-x-4">
          {token ? (
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5 text-xs text-primary-muted bg-surface border border-border px-3 py-1 rounded-full">
                <UserIcon className="h-3 w-3 text-brand-blue" />
                <span className="max-w-[120px] truncate">{user?.name}</span>
              </span>
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-primary hover:bg-primary-muted text-background text-xs font-semibold px-5 py-2 rounded-full transition-all duration-200 hover:scale-[1.02]"
            >
              Control Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="lg:hidden p-1 text-primary-muted hover:text-primary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-20 left-4 right-4 bg-panel border border-border rounded-2xl p-5 shadow-premium overflow-hidden z-40"
          >
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-surface text-primary border-l-2 border-brand-blue' : 'text-primary-muted hover:text-primary hover:bg-surface/50'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              
              <hr className="border-border my-2" />

              {token ? (
                <div className="flex flex-col space-y-3 pt-2">
                  <div className="flex items-center space-x-2 text-sm text-primary-muted px-4">
                    <UserIcon className="h-4 w-4 text-brand-blue" />
                    <span>Logged as: <b>{user?.name}</b></span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="flex items-center justify-center space-x-2 w-full bg-red-950/30 hover:bg-red-950/50 border border-red-900/50 text-red-300 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full bg-primary hover:bg-primary-muted text-background py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Control Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
