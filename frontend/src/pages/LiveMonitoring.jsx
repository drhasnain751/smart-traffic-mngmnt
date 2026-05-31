import React, { useState, useEffect } from 'react';
import { useTrafficStore } from '../store/useTrafficStore';
import { Video, Maximize2, Radio, Camera, Film, AlertTriangle, EyeOff, Sliders } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveMonitoring() {
  const { intersections } = useTrafficStore();
  const [timeStr, setTimeStr] = useState('');
  const [activeCam, setActiveCam] = useState(null);

  // Sync clock timecode
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setTimeStr(date.toISOString().replace('T', ' ').slice(0, 19));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter first 4 intersections for streaming grids
  const streams = intersections.slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">Live CCTV Monitoring</h1>
          <p className="text-sm text-primary-muted mt-1.5">Edge computer vision video analytics feeds & camera stream networks.</p>
        </div>
      </div>

      {/* Grid of Monitors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {streams.map((item, idx) => {
          const signal = item.Signals[0];
          const color = signal?.activeState;

          return (
            <div 
              key={item.id} 
              className="bg-panel border border-border rounded-2xl overflow-hidden flex flex-col justify-between shadow-premium relative group"
            >
              {/* CCTV Camera Stream Frame */}
              <div className="relative aspect-video bg-zinc-950 flex flex-col items-center justify-center overflow-hidden border-b border-border">
                {/* Visual grid lines */}
                <div className="absolute inset-0 grid-bg opacity-15" />
                
                {/* Glitch noise overlay line */}
                <motion.div 
                  animate={{ y: [-100, 300] }} 
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="absolute left-0 right-0 h-0.5 bg-white/5 shadow-subtle-glow pointer-events-none" 
                />

                {/* CCTV text overlay */}
                <div className="absolute top-4 left-4 font-mono text-[10px] text-zinc-400 space-y-0.5 tracking-wider bg-black/60 px-2.5 py-1.5 rounded border border-border/40 backdrop-blur-sm z-10">
                  <div className="flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping" />
                    <span className="font-bold text-red-500">LIVE FEED</span>
                  </div>
                  <div>CAM_SEC_{idx + 1} // {item.name.replace(' & ', '_')}</div>
                  <div>FPS: 30.00 // CODEC: H.264</div>
                  <div>LATENCY: 12ms</div>
                </div>

                <div className="absolute top-4 right-4 font-mono text-[10px] text-zinc-400 bg-black/60 px-2.5 py-1.5 rounded border border-border/40 backdrop-blur-sm z-10">
                  {timeStr}
                </div>

                {/* Center SVG Simulating edge detection overlays */}
                <div className="relative w-full h-full flex items-center justify-center">
                  
                  {/* Intersection representation */}
                  <div className="absolute h-full w-12 bg-zinc-900 border-x border-zinc-800 flex flex-col justify-between" />
                  <div className="absolute w-full h-12 bg-zinc-900 border-y border-zinc-800 flex justify-between items-center" />

                  {/* Draw simulated green/red bounding boxes around moving vehicle nodes */}
                  {/* Vehicle box 1 */}
                  <motion.div
                    animate={{ x: [-80, 80] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                    className="absolute h-5 w-7 border border-brand-blue bg-brand-blue/10 rounded flex items-center justify-center z-10"
                    style={{ top: 'calc(50% + 2px)' }}
                  >
                    <span className="text-[6px] font-mono text-brand-blue font-bold">CAR_82</span>
                  </motion.div>

                  {/* Vehicle box 2 */}
                  {color === 'GREEN' && (
                    <motion.div
                      animate={{ x: [80, -80] }}
                      transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                      className="absolute h-5 w-7 border border-brand-purple bg-brand-purple/10 rounded flex items-center justify-center z-10"
                      style={{ top: 'calc(50% - 20px)' }}
                    >
                      <span className="text-[6px] font-mono text-brand-purple font-bold">CAR_19</span>
                    </motion.div>
                  )}

                  {/* Red light indicator box */}
                  <div className="absolute p-1 bg-black/80 rounded border border-border z-10 flex flex-col items-center space-y-1 scale-75">
                    <div className={`h-2.5 w-2.5 rounded-full ${color === 'RED' ? 'bg-traffic-red pulsing-red' : 'bg-zinc-800'}`} />
                    <div className={`h-2.5 w-2.5 rounded-full ${color === 'YELLOW' ? 'bg-traffic-yellow pulsing-yellow' : 'bg-zinc-800'}`} />
                    <div className={`h-2.5 w-2.5 rounded-full ${color === 'GREEN' ? 'bg-traffic-green pulsing-green' : 'bg-zinc-800'}`} />
                  </div>
                </div>

                {/* CCTV Vignette */}
                <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.85)] pointer-events-none" />
              </div>

              {/* Monitor Footer Controls */}
              <div className="p-4 bg-surface/30 flex justify-between items-center text-xs">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-zinc-950 border border-border rounded-lg text-primary-muted">
                    <Camera className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-[10px] text-primary-muted font-mono uppercase tracking-wider">
                      Congestion: {(item.congestionLevel * 100).toFixed(0)}% // {item.vehicleCount} queued
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`h-2 w-2 rounded-full ${color === 'GREEN' ? 'bg-traffic-green' : color === 'YELLOW' ? 'bg-traffic-yellow' : 'bg-traffic-red'}`} />
                  <span className="font-mono font-bold uppercase text-[10px] text-primary-muted mr-2">
                    {color} ({signal?.timerSeconds}s)
                  </span>
                  <button className="p-1.5 hover:bg-surface border border-border rounded-lg text-primary-muted hover:text-primary transition-colors">
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
