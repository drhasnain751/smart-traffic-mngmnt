import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTrafficStore } from '../store/useTrafficStore';
import { Radio, ShieldAlert, User, Mail, Lock, Key, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Signup() {
  const { signup, authLoading, authError } = useTrafficStore();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('OPERATOR');
  const [formErr, setFormErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErr('');

    if (!name || !email || !password) {
      setFormErr('All credentials fields must be supplied.');
      return;
    }

    if (password.length < 6) {
      setFormErr('Password must satisfy a minimum of 6 characters.');
      return;
    }

    const success = await signup(name, email, password, role);
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
            Metropolitan Infrastructure Console Registration.
          </h2>
          <p className="text-primary-muted leading-relaxed text-sm">
            Create signed credentials to access the central transit coordination mainframe. Join our smart city control centers network.
          </p>

          <div className="bg-zinc-950 p-4 border border-border rounded-2xl flex items-center space-x-3.5 max-w-md shadow-premium">
            <div className="p-2.5 bg-brand-purple/10 text-brand-purple rounded-xl">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="flex flex-col space-y-0.5">
              <span className="text-xs font-semibold">Strict Role Authentication</span>
              <span className="text-[10px] text-primary-muted">Operator roles are logged inside system audit logs when issuing overriding signals.</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center space-x-2 text-[10px] text-zinc-500 font-mono z-10">
          <span>SECURE CONSOLE REGISTER</span>
          <span>•</span>
          <span>MAY 2026</span>
        </div>
      </div>

      {/* Right side: Signup Form (5/12 width) */}
      <div className="lg:col-span-5 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="w-full max-w-sm space-y-6">
          
          {/* Logo on mobile view */}
          <div className="lg:hidden flex justify-center mb-6">
            <Link to="/" className="flex items-center space-x-2 font-display font-bold tracking-tight text-lg">
              <Radio className="h-5 w-5 text-brand-blue" />
              <span>TRANSIT<span className="text-brand-blue">.OS</span></span>
            </Link>
          </div>

          <div className="text-left space-y-2">
            <h1 className="text-2xl font-display font-extrabold tracking-tight text-primary">
              Register workstation
            </h1>
            <p className="text-xs text-primary-muted">
              Configure credentials to establish console session.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Error alerts */}
            {(formErr || authError) && (
              <div className="bg-red-950/20 border border-red-500/20 p-3.5 rounded-lg flex items-center space-x-2.5 text-red-400 text-xs font-medium">
                <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
                <span>{formErr || authError}</span>
              </div>
            )}

            {/* Name Field */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="name-input" className="text-xs font-semibold text-primary-muted">Operator Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input
                  id="name-input"
                  type="text"
                  placeholder="e.g. Officer James Gordon"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="bg-zinc-950 border border-border pl-10 pr-4 py-2.5 rounded-lg text-xs w-full focus:outline-none focus:border-brand-blue placeholder:text-zinc-600"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="email-input" className="text-xs font-semibold text-primary-muted">Workstation Email Address</label>
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

            {/* Role Field */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="role-select" className="text-xs font-semibold text-primary-muted">Operational Rank</label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <select
                  id="role-select"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="bg-zinc-950 border border-border pl-10 pr-4 py-2.5 rounded-lg text-xs w-full focus:outline-none focus:border-brand-blue"
                >
                  <option value="OPERATOR">System Dispatch Operator</option>
                  <option value="ADMIN">Municipal Transit Director</option>
                </select>
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="password-input" className="text-xs font-semibold text-primary-muted">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input
                  id="password-input"
                  type="password"
                  placeholder="At least 6 characters..."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-zinc-950 border border-border pl-10 pr-4 py-2.5 rounded-lg text-xs w-full focus:outline-none focus:border-brand-blue placeholder:text-zinc-600"
                  required
                />
              </div>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-primary hover:bg-primary-muted text-background text-xs font-bold py-3 rounded-lg flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
            >
              {authLoading ? <RefreshCw className="h-4.5 w-4.5 animate-spin" /> : <span>Establish Console Workstation</span>}
            </button>
          </form>

          <div className="text-center text-xs text-primary-muted pt-2">
            <span>Workstation already registered? </span>
            <Link to="/login" className="text-brand-blue font-semibold hover:underline">Console Login</Link>
          </div>

        </div>
      </div>

    </div>
  );
}
