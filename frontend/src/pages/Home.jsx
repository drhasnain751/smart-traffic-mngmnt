import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Radio, Shield, Zap, BarChart3,
  MapPin, Sliders, Database, FileText, Bell, CheckCircle2, ChevronRight
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const mockSparkData = [
  { val: 30 }, { val: 45 }, { val: 38 }, { val: 65 }, { val: 50 }, { val: 78 }, { val: 82 }, { val: 70 }, { val: 90 }
];

export default function Home() {
  const containerRef = useRef(null);
  const [liveVehicles, setLiveVehicles] = useState(4820);
  const [liveCongestion, setLiveCongestion] = useState(42.4);
  const [activeWorkflow, setActiveWorkflow] = useState(0);

  // Live counter ticking
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveVehicles(prev => prev + Math.floor(Math.random() * 9) - 4);
      setLiveCongestion(prev => {
        const delta = (Math.random() * 0.4 - 0.2);
        return parseFloat(Math.min(100, Math.max(0, prev + delta)).toFixed(1));
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Workflow steps
  const workflowSteps = [
    { title: "IoT Sensor Detection", desc: "Thermal and optical camera sensors track queue counts at approach lanes.", icon: Radio },
    { title: "Prisma DB Storing", desc: "Data streams securely into high-performance sub-second data lakes.", icon: Database },
    { title: "Core Optimization", desc: "Express routing and analytics pipelines compile congestion patterns.", icon: Zap },
    { title: "WS Synchronization", desc: "Socket.IO tunnels deliver immediate telemetry frames to clients.", icon: Radio },
    { title: "Manual Override", desc: "Operators trigger priority green waves instantly via command center.", icon: Sliders },
    { title: "Report Dispatch", desc: "Automated daily CSV/PDF compliance reports export to authorities.", icon: FileText }
  ];

  return (
    <div ref={containerRef} className="w-full relative overflow-x-hidden bg-background">

      {/* SECTION 1 - HERO */}
      <section className="min-h-screen relative flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 border-b border-border grid-bg">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Asymmetric Left side - Typography */}
          <div className="lg:col-span-7 flex flex-col space-y-8 text-left z-10">
            <div className="inline-flex items-center space-x-2 bg-panel border border-border px-3 py-1.5 rounded-full text-xs font-medium text-brand-blue w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-blue animate-ping" />
              <span>TRANSIT.OS v2.4 Active</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[1.05] text-primary">
              Smarter City <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-purple to-primary">
                Smart Transit
              </span> <br />
              Optimization.
            </h1>

            <p className="text-base sm:text-lg text-primary-muted max-w-xl font-normal leading-relaxed">
              Empower metropolitan grids with decentralized edge sensors, sub-second latency controls, and predictive AI dispatching. Crafted for modern smart cities.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                to="/dashboard"
                className="flex items-center justify-center space-x-2 bg-primary hover:bg-primary-muted text-background font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:scale-[1.02]"
              >
                <span>Launch Control</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="flex items-center justify-center space-x-2 bg-panel border border-border hover:border-border-focus px-8 py-4 rounded-full text-sm font-medium transition-colors"
              >
                <span>Architecture overview</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/60 max-w-lg">
              <div>
                <div className="text-2xl font-bold font-display">{liveVehicles}</div>
                <div className="text-[10px] uppercase font-mono text-primary-muted tracking-wider">Live Vehicles</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-display text-brand-blue">{liveCongestion}%</div>
                <div className="text-[10px] uppercase font-mono text-primary-muted tracking-wider">Average Delay</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-display text-traffic-green">99.8%</div>
                <div className="text-[10px] uppercase font-mono text-primary-muted tracking-wider">Uptime SLA</div>
              </div>
            </div>
          </div>

          {/* Asymmetric Right side - Visual Traffic System & Floating Panels */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[450px]">
            {/* SVG Interactive Traffic System */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/5 to-transparent rounded-3xl blur-3xl -z-10" />

            {/* Animated Traffic Path visual */}
            <div className="w-full max-w-md aspect-square bg-panel/50 border border-border rounded-2xl p-6 relative flex flex-col justify-between overflow-hidden shadow-premium">
              <div className="absolute inset-0 grid-bg opacity-30" />

              <div className="flex justify-between items-start z-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-primary-muted tracking-wider uppercase">Live Node Telemetry</span>
                  <span className="font-semibold text-sm">Broadway grid sector 4</span>
                </div>
                <span className="h-2 w-2 rounded-full bg-traffic-green pulsing-green" />
              </div>

              {/* Central intersection visual representation */}
              <div className="relative w-full h-44 flex items-center justify-center my-4">
                {/* Horizontal Road */}
                <div className="absolute w-full h-8 bg-zinc-900 border-y border-zinc-800 flex items-center justify-around">
                  <div className="h-0.5 w-6 bg-dashed border-t border-dashed border-zinc-700" />
                  <div className="h-0.5 w-6 bg-dashed border-t border-dashed border-zinc-700" />
                  <div className="h-0.5 w-6 bg-dashed border-t border-dashed border-zinc-700" />
                </div>
                {/* Vertical Road */}
                <div className="absolute h-full w-8 bg-zinc-900 border-x border-zinc-800 flex flex-col items-center justify-around">
                  <div className="w-0.5 h-6 border-l border-dashed border-zinc-700" />
                  <div className="w-0.5 h-6 border-l border-dashed border-zinc-700" />
                </div>

                {/* Animated vehicles moving on horizontal road */}
                <motion.div
                  animate={{ x: [-150, 180] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="absolute left-0 h-2.5 w-4 bg-brand-blue rounded-sm"
                  style={{ top: 'calc(50% - 6px)' }}
                />
                <motion.div
                  animate={{ x: [180, -150] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "linear", delay: 1 }}
                  className="absolute right-0 h-2.5 w-4 bg-brand-purple rounded-sm"
                  style={{ top: 'calc(50% + 1px)' }}
                />

                {/* Animated vehicles moving on vertical road */}
                <motion.div
                  animate={{ y: [-100, 100] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "linear", delay: 0.5 }}
                  className="absolute top-0 w-2.5 h-4 bg-primary rounded-sm"
                  style={{ left: 'calc(50% - 6px)' }}
                />

                {/* Signal Light Indicator */}
                <div className="absolute flex space-x-1 p-1 bg-black/80 rounded-full border border-border z-10">
                  <div className="h-2 w-2 rounded-full bg-traffic-red/40" />
                  <div className="h-2 w-2 rounded-full bg-traffic-yellow/40" />
                  <div className="h-2 w-2 rounded-full bg-traffic-green" />
                </div>
              </div>

              {/* Floating Realtime Control widget */}
              <div className="bg-surface/90 border border-border/80 p-3.5 rounded-xl flex items-center justify-between shadow-premium z-10 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-lg">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold">Priority Dispatch Mode</span>
                    <span className="text-[10px] text-primary-muted">Admin green wave standby</span>
                  </div>
                </div>
                <div className="h-5 w-10 bg-brand-blue/20 rounded-full flex items-center justify-end px-0.5 border border-brand-blue/30 cursor-pointer">
                  <div className="h-4 w-4 bg-brand-blue rounded-full" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2 - SMART CITY OVERVIEW */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-border relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Editorial Content */}
          <div className="space-y-6">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-brand-blue">
              METROPOLITAN DEPLOYMENT
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-primary">
              Unified control for modern smart municipalities.
            </h2>
            <p className="text-primary-muted leading-relaxed">
              Managing metropolitan traffic grids is no longer a static hardware problem. TRANSIT.OS merges edge computer vision detectors and automated micro-adjustments into a unified dashboard interface.
            </p>
            <p className="text-primary-muted leading-relaxed">
              By connecting vehicle counts with real-time timers, signal networks coordinate automatically to clear queues before bottlenecks occur.
            </p>
            <div className="pt-4">
              <Link to="/about" className="inline-flex items-center space-x-2 text-brand-blue hover:text-brand-purple transition-colors font-medium">
                <span>Read detailed architecture guide</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right side - Overview visual */}
          <div className="bg-panel border border-border rounded-2xl p-8 relative overflow-hidden shadow-premium">
            <div className="absolute top-0 right-0 h-40 w-40 bg-brand-purple/5 blur-2xl pointer-events-none" />

            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted font-mono">
                System Load Metrics
              </span>
              <span className="text-xs bg-brand-purple/10 text-brand-purple px-2 py-0.5 rounded border border-brand-purple/20 font-mono">
                Dynamic Optimization Active
              </span>
            </div>

            <div className="space-y-4">
              <div className="bg-surface/50 border border-border p-4 rounded-xl">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-primary-muted font-medium">Grid Delay Index</span>
                  <span className="font-semibold text-brand-blue">Stable (-12%)</span>
                </div>
                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '42%' }}
                    transition={{ duration: 1 }}
                    className="h-full bg-brand-blue"
                  />
                </div>
              </div>

              <div className="bg-surface/50 border border-border p-4 rounded-xl">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-primary-muted font-medium">Edge Sensor Status</span>
                  <span className="font-semibold text-traffic-green">98/100 Online</span>
                </div>
                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '98%' }}
                    transition={{ duration: 1 }}
                    className="h-full bg-traffic-green"
                  />
                </div>
              </div>

              <div className="bg-surface/50 border border-border p-4 rounded-xl">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-primary-muted font-medium">Average Travel Speeds</span>
                  <span className="font-semibold text-primary">54.8 km/h</span>
                </div>
                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '75%' }}
                    transition={{ duration: 1 }}
                    className="h-full bg-zinc-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - FEATURES BENTO GRID */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto space-y-12">

          <div className="max-w-2xl text-left">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-brand-blue">
              SYSTEM CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-primary mt-2">
              Everything required to orchestrate smart grids.
            </h2>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Bento Card 1 - Real-Time Monitoring */}
            <div className="bento-card p-6 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="h-9 w-9 bg-brand-blue/10 text-brand-blue rounded-lg flex items-center justify-center mb-4">
                  <Radio className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">Real-Time Monitoring</h3>
                <p className="text-xs text-primary-muted mt-2 leading-relaxed">
                  Listen to live telemetry frames broadcasted via websockets. View immediate counts and lights transitions.
                </p>
              </div>
              <div className="mt-4 flex items-center space-x-1.5 text-xs text-traffic-green font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-traffic-green animate-ping" />
                <span>Live connection tunnels online</span>
              </div>
            </div>

            {/* Bento Card 2 - Manual Signal Control */}
            <div className="bento-card p-6 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="h-9 w-9 bg-brand-purple/10 text-brand-purple rounded-lg flex items-center justify-center mb-4">
                  <Sliders className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">Manual Signal Override</h3>
                <p className="text-xs text-primary-muted mt-2 leading-relaxed">
                  Bypass autonomous timers to activate instant manual red/green locks for emergency dispatch or special events.
                </p>
              </div>
              <span className="text-[10px] font-mono text-primary-muted mt-4 bg-zinc-950 px-2.5 py-1 w-fit rounded-full border border-border">
                Secured JWT Validation Required
              </span>
            </div>

            {/* Bento Card 3 - Smart Analytics */}
            <div className="bento-card p-6 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="h-9 w-9 bg-zinc-800 text-primary rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">Predictive Analytics</h3>
                <p className="text-xs text-primary-muted mt-2 leading-relaxed">
                  Identify historical bottleneck patterns, project 24h congestion trends, and evaluate grid performance.
                </p>
              </div>
              <div className="h-10 w-full mt-4 bg-zinc-950 rounded border border-border overflow-hidden p-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockSparkData}>
                    <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={1} fill="#3b82f6" fillOpacity={0.15} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bento Card 4 - Live Traffic Density */}
            <div className="bento-card p-6 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="h-9 w-9 bg-brand-blue/10 text-brand-blue rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">Live Density Optimization</h3>
                <p className="text-xs text-primary-muted mt-2 leading-relaxed">
                  Automated sensor loops calculate signal phase lengths according to vehicle backlog rates dynamically.
                </p>
              </div>
              <div className="flex items-center space-x-2 mt-4 text-xs font-mono">
                <span className="px-2 py-0.5 bg-zinc-900 border border-border rounded text-primary-muted">Auto mode</span>
                <span className="text-traffic-green font-semibold">95% Efficiency</span>
              </div>
            </div>

            {/* Bento Card 5 - AI Recommendations */}
            <div className="bento-card p-6 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="h-9 w-9 bg-brand-purple/10 text-brand-purple rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">AI Calibration Advisories</h3>
                <p className="text-xs text-primary-muted mt-2 leading-relaxed">
                  Receive recommendations on scheduling offsets, coordination green waves, and signal timing adjustments.
                </p>
              </div>
              <span className="text-[10px] text-brand-purple mt-4 font-mono font-medium">
                12 recommendations compiled today
              </span>
            </div>

            {/* Bento Card 6 - Incident Alerts System */}
            <div className="bento-card p-6 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="h-9 w-9 bg-red-950/20 text-red-400 rounded-lg flex items-center justify-center mb-4">
                  <Bell className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">Incident Console</h3>
                <p className="text-xs text-primary-muted mt-2 leading-relaxed">
                  Track collisions, offline grid components, emergency overrides, and extreme delay alerts inside a central feed.
                </p>
              </div>
              <div className="flex items-center space-x-2 mt-4 text-xs">
                <span className="h-2 w-2 rounded-full bg-traffic-red pulsing-red" />
                <span className="text-red-400 font-mono font-medium">Critical incident feed online</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4 - LIVE TRAFFIC VISUALIZATION SIMULATION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-border bg-panel/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-4 space-y-6">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-brand-blue">
              METROPOLITAN GRID SIMULATOR
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-primary">
              Real-time road systems coordination.
            </h2>
            <p className="text-primary-muted leading-relaxed">
              Observe how cars flow based on active lights. The simulator adjusts queue rates dynamically. Under red lights, vehicles build. Under green lights, they accelerate and pass, showing fluid grid optimization.
            </p>
            <div className="pt-2">
              <Link to="/dashboard" className="inline-flex items-center justify-center bg-panel border border-border hover:border-brand-blue px-6 py-3 rounded-full text-xs font-semibold text-primary transition-all duration-200">
                <span>View control center</span>
                <ChevronRight className="h-4 w-4 ml-1.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-8 bg-panel border border-border rounded-2xl p-6 relative overflow-hidden shadow-premium">
            <div className="absolute top-0 right-0 h-40 w-40 bg-zinc-800/10 blur-2xl pointer-events-none" />

            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted font-mono">
                Visualizing Intersection Alpha (Simulated)
              </span>
              <div className="flex space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-traffic-green" />
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
              </div>
            </div>

            {/* Sim grid container */}
            <div className="w-full h-80 bg-zinc-950 border border-border rounded-xl relative overflow-hidden flex items-center justify-center">
              {/* Vertical Street */}
              <div className="absolute h-full w-24 bg-zinc-900 border-x border-zinc-800/80 flex flex-col justify-between">
                <div className="h-1/3 w-0.5 border-l border-dashed border-zinc-700 mx-auto" />
                <div className="h-1/3 w-0.5 border-l border-dashed border-zinc-700 mx-auto" />
              </div>

              {/* Horizontal Street */}
              <div className="absolute w-full h-24 bg-zinc-900 border-y border-zinc-800/80 flex justify-between items-center">
                <div className="w-1/3 h-0.5 border-t border-dashed border-zinc-700" />
                <div className="w-1/3 h-0.5 border-t border-dashed border-zinc-700" />
              </div>

              {/* Intersection center light rings */}
              <div className="absolute w-24 h-24 border border-zinc-800/80 rounded" />

              {/* Central Signal light boxes */}
              {/* North signal */}
              <div className="absolute top-[68px] left-[50%] -translate-x-1/2 flex space-x-1 bg-black/80 p-1.5 rounded-full border border-border">
                <div className="h-2 w-2 rounded-full bg-traffic-red" />
                <div className="h-2 w-2 rounded-full bg-zinc-800" />
                <div className="h-2 w-2 rounded-full bg-zinc-800" />
              </div>

              {/* West signal */}
              <div className="absolute top-[50%] -translate-y-1/2 left-[68px] flex space-x-1 bg-black/80 p-1.5 rounded-full border border-border rotate-90">
                <div className="h-2 w-2 rounded-full bg-zinc-800" />
                <div className="h-2 w-2 rounded-full bg-zinc-800" />
                <div className="h-2 w-2 rounded-full bg-traffic-green" />
              </div>

              {/* Vehicles simulation layout */}
              {/* Cars waiting at North Red Light */}
              <motion.div animate={{ y: [0, -10, -5, -8] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-12 left-[calc(50%-18px)] w-4 h-6 bg-red-400 rounded-sm" />
              <motion.div animate={{ y: [0, -4, -1, -3] }} transition={{ repeat: Infinity, duration: 4, delay: 0.5 }} className="absolute top-4 left-[calc(50%-18px)] w-4 h-6 bg-amber-400 rounded-sm" />

              {/* Cars flying through West Green Light */}
              <motion.div animate={{ x: [0, 480] }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }} className="absolute left-0 top-[calc(50%+4px)] w-6 h-4 bg-brand-blue rounded-sm" />
              <motion.div animate={{ x: [0, 480] }} transition={{ repeat: Infinity, duration: 3, ease: 'linear', delay: 1.5 }} className="absolute left-0 top-[calc(50%+4px)] w-6 h-4 bg-primary rounded-sm" />
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5 - ANALYTICS PREVIEW */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-2xl text-left">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-brand-blue">
              METROPOLITAN TELEMETRY
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-primary mt-2">
              Linear-style transit volume charts.
            </h2>
            <p className="text-primary-muted mt-4">
              Observe weekly traffic congestion index changes and speed metrics. Click launch console to view predictive analytics models.
            </p>
          </div>

          <div className="bg-panel border border-border rounded-2xl p-6 shadow-premium">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-semibold text-primary-muted uppercase tracking-wider font-mono">Weekly Average Delay Index</span>
              <span className="text-xs text-traffic-green font-mono">Telemetry synced</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { day: 'Mon', delay: 40 },
                  { day: 'Tue', delay: 58 },
                  { day: 'Wed', delay: 62 },
                  { day: 'Thu', delay: 50 },
                  { day: 'Fri', delay: 78 },
                  { day: 'Sat', delay: 35 },
                  { day: 'Sun', delay: 28 },
                ]}>
                  <defs>
                    <linearGradient id="colorDelay" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="delay" stroke="#3b82f6" strokeWidth={1.5} fillOpacity={1} fill="url(#colorDelay)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 - CITY MAP PREVIEW */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-border bg-panel/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-brand-blue">
              METROPOLITAN COORDINATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-primary">
              Interactive transit mapping.
            </h2>
            <p className="text-primary-muted leading-relaxed">
              Find bottleneck congestion hotspots on our full city map. Pulsing green, orange, and red indicators highlight active signal queue counts.
            </p>
            <div className="pt-2">
              <Link to="/map" className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-muted text-background font-semibold px-6 py-3 rounded-full text-xs transition-colors">
                <span>View Full Screen Map</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 h-80 bg-panel border border-border rounded-2xl overflow-hidden relative shadow-premium flex items-center justify-center">
            {/* Static mock map visual representational grid */}
            <div className="absolute inset-0 grid-bg opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />

            {/* Glowing lines representing roads */}
            <div className="absolute w-[80%] h-0.5 bg-gradient-to-r from-transparent via-brand-blue to-transparent top-1/3 left-10 opacity-30 shadow-subtle-glow" />
            <div className="absolute w-[80%] h-0.5 bg-gradient-to-r from-transparent via-brand-purple to-transparent top-2/3 left-20 opacity-30 shadow-subtle-glow" />
            <div className="absolute h-[80%] w-0.5 bg-gradient-to-b from-transparent via-brand-blue to-transparent left-1/3 top-10 opacity-30 shadow-subtle-glow" />
            <div className="absolute h-[80%] w-0.5 bg-gradient-to-b from-transparent via-brand-purple to-transparent left-2/3 top-10 opacity-30 shadow-subtle-glow" />

            {/* Pulsing Intersections */}
            <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 h-5 w-5 bg-traffic-red rounded-full pulsing-red border border-white/20" />
            <div className="absolute top-1/3 left-2/3 -translate-x-1/2 -translate-y-1/2 h-5 w-5 bg-traffic-green rounded-full pulsing-green border border-white/20" />
            <div className="absolute top-2/3 left-1/3 -translate-x-1/2 -translate-y-1/2 h-5 w-5 bg-traffic-yellow rounded-full pulsing-yellow border border-white/20" />
            <div className="absolute top-2/3 left-2/3 -translate-x-1/2 -translate-y-1/2 h-5 w-5 bg-traffic-green rounded-full pulsing-green border border-white/20" />

            <div className="absolute bottom-6 right-6 bg-surface border border-border p-3 rounded-lg text-xs flex flex-col space-y-1">
              <span className="font-semibold">Grid Hotspots</span>
              <span className="text-[10px] text-primary-muted font-mono">Sector Midtown - 3 Overloads</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 - SYSTEM WORKFLOW TIMELINE */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-2xl text-left">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-brand-blue">
              SYSTEM CYCLE
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-primary mt-2">
              From IoT sensors to operator control.
            </h2>
            <p className="text-primary-muted mt-4">
              Observe how traffic metrics flow in real-time between edge detectors and municipal controllers.
            </p>
          </div>

          {/* Timeline steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative">
            {workflowSteps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveWorkflow(idx)}
                  className={`bg-panel border rounded-xl p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[160px] ${activeWorkflow === idx ? 'border-brand-blue shadow-subtle-glow' : 'border-border hover:border-border-focus'
                    }`}
                >
                  <div>
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-4 ${activeWorkflow === idx ? 'bg-brand-blue/20 text-brand-blue' : 'bg-surface text-primary-muted'
                      }`}>
                      <StepIcon className="h-4.5 w-4.5" />
                    </div>
                    <div className="text-xs font-semibold">{step.title}</div>
                  </div>
                  <div className="text-[11px] text-primary-muted leading-relaxed mt-2.5">
                    {step.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 8 - FOOTER */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-panel/30 border-t border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

          <div className="space-y-4">
            <div className="flex items-center space-x-2 font-display font-bold text-lg">
              <Radio className="h-5 w-5 text-brand-blue" />
              <span>TRANSIT<span className="text-brand-blue">.OS</span></span>
            </div>
            <p className="text-xs text-primary-muted leading-relaxed">
              Advanced transit data routing protocols for next-generation smart cities.
            </p>
            <div className="text-[10px] text-zinc-600 font-mono">
              © 2026 Transit OS. All rights reserved.
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4">Control System</h4>
            <ul className="space-y-2 text-xs text-primary-muted">
              <li><Link to="/dashboard" className="hover:text-primary">Admin Console</Link></li>
              <li><Link to="/intersections" className="hover:text-primary">Grid Manager</Link></li>
              <li><Link to="/map" className="hover:text-primary">City Flow Map</Link></li>
              <li><Link to="/analytics" className="hover:text-primary">Congestion AI</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2 text-xs text-primary-muted">
              <li><Link to="/about" className="hover:text-primary">Technical Specs</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Control Contact</Link></li>
              <li><a href="#" className="hover:text-primary">Edge API Spec</a></li>
              <li><a href="#" className="hover:text-primary">Status Page</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider">Transit Dispatch newsletter</h4>
            <p className="text-xs text-primary-muted leading-relaxed">
              Stay updated on smart city optimization guides.
            </p>
            <form onSubmit={e => e.preventDefault()} className="flex items-stretch bg-zinc-950 p-1 rounded-full border border-border">
              <input
                type="email"
                placeholder="operator@city.gov"
                className="bg-transparent px-3 text-xs w-full focus:outline-none placeholder:text-zinc-600"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-muted text-background text-xs font-semibold px-4 py-2 rounded-full transition-colors"
              >
                Join
              </button>
            </form>
          </div>

        </div>
      </footer>

    </div>
  );
}
