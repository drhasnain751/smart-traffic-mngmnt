import React from 'react';
import { Shield, Zap, Database, Cpu, Radio, Network } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
      
      {/* Intro */}
      <div className="space-y-6 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase font-mono font-bold tracking-wider text-brand-blue">
          TECHNICAL DOCUMENTATION
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight leading-none text-primary">
          Infrastructure Specifications
        </h1>
        <p className="text-base text-primary-muted leading-relaxed">
          Detailed guide to edge sensors, websocket relays, and dynamic scheduling synchronization in the TRANSIT.OS suite.
        </p>
      </div>

      {/* Grid: 3 pillars of tech */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-panel border border-border p-6 rounded-2xl space-y-3.5 shadow-premium">
          <div className="p-2.5 bg-brand-blue/10 text-brand-blue rounded-xl w-fit">
            <Radio className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-sm">Edge Sensor Telemetry</h3>
          <p className="text-xs text-primary-muted leading-relaxed">
            Local optical cameras running lightweight YOLOv8 models count queued vehicles on approaches, sending integer load values.
          </p>
        </div>

        <div className="bg-panel border border-border p-6 rounded-2xl space-y-3.5 shadow-premium">
          <div className="p-2.5 bg-brand-purple/10 text-brand-purple rounded-xl w-fit">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-sm">Sub-second Latency</h3>
          <p className="text-xs text-primary-muted leading-relaxed">
            Telemetries tunnel via persistent Socket.IO connections, achieving ~25ms browser frame refreshes under load spikes.
          </p>
        </div>

        <div className="bg-panel border border-border p-6 rounded-2xl space-y-3.5 shadow-premium">
          <div className="p-2.5 bg-zinc-800 text-primary rounded-xl w-fit">
            <Database className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-sm">Prisma/Relational ORM</h3>
          <p className="text-xs text-primary-muted leading-relaxed">
            Fully typed database schemas mapped via Prisma ORM for quick SQL transaction queries, compatible with Postgres and SQLite.
          </p>
        </div>
      </div>

      {/* Deep Dive Section */}
      <div className="bg-panel border border-border rounded-2xl p-8 space-y-6 shadow-premium">
        <h2 className="text-xl font-bold font-display flex items-center space-x-2">
          <Network className="h-5 w-5 text-brand-blue" />
          <span>System Signal Synchronization Flow</span>
        </h2>
        
        <p className="text-xs text-primary-muted leading-relaxed">
          Under autonomous scheduling mode (`AUTO`), intersections cycle according to configured green/red timers. The system continuously evaluates lane backlogs using live camera telemetry:
        </p>

        <div className="space-y-4 font-mono text-[10px] text-primary-muted pl-4 border-l border-border/80">
          <div>
            <span className="text-brand-purple font-bold">01 // TELEMETRY TICK</span>
            <p className="mt-1">Edge loops upload approach queue integers. Average grid speeds fluctuate.</p>
          </div>
          <div>
            <span className="text-brand-purple font-bold">02 // ALIGNMENT EVALUATION</span>
            <p className="mt-1">AI advisors check if congestion exceeds system thresholds, suggesting timing adjustments.</p>
          </div>
          <div>
            <span className="text-brand-purple font-bold">03 // EMERGENCY OVERRIDE</span>
            <p className="mt-1">Operators lock signals (Force Green Wave/Hold Red) to clear paths for priority dispatching.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
