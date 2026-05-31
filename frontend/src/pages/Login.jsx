import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTrafficStore } from '../store/useTrafficStore';
import { Radio, ShieldCheck, Mail, Lock, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const { login, authLoading, authError } = useTrafficStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@smartcity.gov');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(false);
  const [formErr, setFormErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErr('');
    
    if (!email || !password) {
      setFormErr('Please input email and password details.');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-background">
      
      {/* Left side: Premium Animated Brand Graphics (7/12 width) */}
      <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-between p-12 bg-panel border-r border-border grid-bg">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/5 to-transparent pointer-events-none" />
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 font-display font-bold tracking-tight text-lg z-10">
          <Radio className="h-5 w-5 text-brand-blue animate-pulse" />
          <span>TRANSIT<span className="text-brand-blue">.OS</span></span>
        </Link>

        {/* Dynamic graphics container */}
        <div className="my-auto space-y-6 max-w-xl z-10">
          <h2 className="text-4xl font-display font-extrabold tracking-tight leading-tight">
            Autonomous Urban Transit Coordination.
          </h2>
          <p className="text-primary-muted leading-relaxed text-sm">
            Access the municipal control dashboard. Synchronize traffic grids, manage IoT edge cameras, view predictive bottleneck forecasting, and execute priority emergency overrides.
          </p>

          <div className="bg-zinc-950 p-4 border border-border rounded-2xl flex items-center space-x-3.5 max-w-md shadow-premium">
            <div className="p-2.5 bg-brand-blue/10 text-brand-blue rounded-xl">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex flex-col space-y-0.5">
              <span className="text-xs font-semibold">End-To-End Encrypted Tunneling</span>
              <span className="text-[10px] text-primary-muted">All control commands require signed JWT credentials validation.</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center space-x-2 text-[10px] text-zinc-500 font-mono z-10">
          <span>SECURE ACCESS PORT</span>
          <span>•</span>
          <span>MAY 2026</span>
        </div>
      </div>

      {/* Right side: Login Credentials Entry Form (5/12 width) */}
      <div className="lg:col-span-5 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="w-full max-w-sm space-y-8">
          
          {/* Logo on mobile view */}
          <div className="lg:hidden flex justify-center mb-6">
            <Link to="/" className="flex items-center space-x-2 font-display font-bold tracking-tight text-lg">
              <Radio className="h-5 w-5 text-brand-blue" />
              <span>TRANSIT<span className="text-brand-blue">.OS</span></span>
            </Link>
          </div>

          <div className="text-left space-y-2">
            <h1 className="text-2xl font-display font-extrabold tracking-tight text-primary">
              Control console entry
            </h1>
            <p className="text-xs text-primary-muted">
              Input credential details to access grid management.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Error alerts */}
            {(formErr || authError) && (
              <div className="bg-red-950/20 border border-red-500/20 p-3.5 rounded-lg flex items-center space-x-2.5 text-red-400 text-xs font-medium">
                <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
                <span>{formErr || authError}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="email-input" className="text-xs font-semibold text-primary-muted">Workstation Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input
                  id="email-input"
                  type="email"
                  placeholder="operator@smartcity.gov"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-zinc-950 border border-border pl-10 pr-4 py-2.5 rounded-lg text-xs w-full focus:outline-none focus:border-brand-blue placeholder:text-zinc-600"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password-input" className="text-xs font-semibold text-primary-muted">Password</label>
                <a href="#" className="text-[10px] text-brand-blue hover:underline">Forgot credentials?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input
                  id="password-input"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-zinc-950 border border-border pl-10 pr-4 py-2.5 rounded-lg text-xs w-full focus:outline-none focus:border-brand-blue placeholder:text-zinc-600"
                  required
                />
              </div>
            </div>

            {/* Checkbox row */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-[11px] text-primary-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-brand-blue bg-zinc-950 focus:ring-0 cursor-pointer"
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-primary hover:bg-primary-muted text-background text-xs font-bold py-3 rounded-lg flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
            >
              {authLoading ? <RefreshCw className="h-4.5 w-4.5 animate-spin" /> : <span>Access Control Panel</span>}
            </button>
          </form>

          {/* Test Credentials Box */}
          <div className="bg-panel border border-border/80 p-4 rounded-xl space-y-2 text-xs">
            <div className="font-semibold text-primary-muted uppercase tracking-wider text-[9px] font-mono">
              Development Test Credentials
            </div>
            <div className="space-y-1 text-primary-muted text-[10px]">
              <div>• Email: <span className="text-primary font-mono select-all">admin@smartcity.gov</span></div>
              <div>• Password: <span className="text-primary font-mono select-all">admin123</span></div>
            </div>
          </div>

          <div className="text-center text-xs text-primary-muted pt-4">
            <span>Need workstation registration? </span>
            <Link to="/signup" className="text-brand-blue font-semibold hover:underline">Register console</Link>
          </div>

        </div>
      </div>

    </div>
  );
}
