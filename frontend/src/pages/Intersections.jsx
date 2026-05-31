import React, { useState } from 'react';
import { useTrafficStore } from '../store/useTrafficStore';
import { 
  GitCommit, Sliders, ChevronDown, ChevronUp, Zap, HelpCircle, Activity, RefreshCcw, Eye, Play, ShieldAlert
} from 'lucide-react';

export default function Intersections() {
  const { intersections, triggerEmergencyOverride, resetToAuto, updateSignalState } = useTrafficStore();
  const [expandedId, setExpandedId] = useState(null);

  const toggleRow = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">Intersections Manager</h1>
          <p className="text-sm text-primary-muted mt-1.5">Granular signal synchronization, approach metrics, and manual overrides.</p>
        </div>
      </div>

      {/* Main intersections container */}
      <div className="bg-panel border border-border rounded-2xl overflow-hidden shadow-premium">
        
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-surface/50 border-b border-border text-[10px] font-mono uppercase tracking-wider text-primary-muted font-bold">
          <div className="col-span-4">Intersection Name</div>
          <div className="col-span-2">Coordinates</div>
          <div className="col-span-2">Operational Status</div>
          <div className="col-span-2">Queue / Capacity</div>
          <div className="col-span-1">Timer</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {intersections.length > 0 ? (
            intersections.map((item) => {
              const signal = item.Signals[0];
              const isExpanded = expandedId === item.id;
              const lightColor = signal?.activeState;

              return (
                <div key={item.id} className="transition-colors hover:bg-surface/10">
                  {/* Table Row Content */}
                  <div 
                    onClick={() => toggleRow(item.id)}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 items-center cursor-pointer text-sm"
                  >
                    {/* Name */}
                    <div className="col-span-4 flex items-center space-x-3">
                      <div className="p-2 bg-zinc-950 border border-border rounded-lg text-primary-muted">
                        <GitCommit className="h-4.5 w-4.5 text-brand-blue" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-primary truncate">{item.name}</span>
                        <span className="text-[10px] text-primary-muted mt-0.5">IoT Node: {item.id.slice(0, 8)}...</span>
                      </div>
                    </div>

                    {/* Lat / Lng */}
                    <div className="col-span-2 text-xs font-mono text-primary-muted">
                      {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <span className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        item.status === 'ACTIVE' ? 'bg-green-950/20 text-green-400 border-green-500/20' :
                        item.status === 'OVERRIDE' ? 'bg-blue-950/20 text-brand-blue border-brand-blue/20' :
                        'bg-zinc-950 text-zinc-400 border-border'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          item.status === 'ACTIVE' ? 'bg-traffic-green pulsing-green' :
                          item.status === 'OVERRIDE' ? 'bg-brand-blue pulsing-green' :
                          'bg-zinc-700'
                        }`} />
                        <span>{item.status}</span>
                      </span>
                    </div>

                    {/* Congestion Level Progress Bar */}
                    <div className="col-span-2 space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-primary-muted">{(item.congestionLevel * 100).toFixed(0)}% Delay</span>
                        <span className="font-semibold text-primary">{item.vehicleCount} vehicles</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-border/30">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            item.congestionLevel > 0.75 ? 'bg-traffic-red' :
                            item.congestionLevel > 0.4 ? 'bg-traffic-yellow' :
                            'bg-traffic-green'
                          }`}
                          style={{ width: `${item.congestionLevel * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Timer Countdown */}
                    <div className="col-span-1 flex items-center space-x-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${
                        lightColor === 'GREEN' ? 'bg-traffic-green' : 
                        lightColor === 'YELLOW' ? 'bg-traffic-yellow' : 
                        'bg-traffic-red'
                      }`} />
                      <span className="font-mono text-xs font-semibold">
                        {signal ? `${signal.timerSeconds}s` : '--'}
                      </span>
                    </div>

                    {/* Arrow toggle */}
                    <div className="col-span-1 text-right flex justify-end">
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-primary-muted" /> : <ChevronDown className="h-4 w-4 text-primary-muted" />}
                    </div>
                  </div>

                  {/* Expandable Details Drawer */}
                  {isExpanded && (
                    <div className="px-6 py-6 bg-surface/20 border-t border-border grid grid-cols-1 lg:grid-cols-12 gap-8">
                      
                      {/* Roads lane detail (Left Column) */}
                      <div className="lg:col-span-7 space-y-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-primary-muted font-mono flex items-center space-x-1.5">
                          <Activity className="h-3.5 w-3.5" />
                          <span>Connected Approach Roadways</span>
                        </h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {item.Roads?.map((road) => (
                            <div key={road.id} className="bg-zinc-950 border border-border p-3.5 rounded-xl">
                              <div className="flex justify-between text-xs">
                                <span className="font-bold">{road.direction} Lane approach</span>
                                <span className="text-primary-muted">{road.name}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 mt-3 text-[10px] font-mono text-primary-muted">
                                <div>
                                  <span className="block text-[8px] uppercase tracking-wider">Capacity</span>
                                  <span className="font-bold text-primary">{road.capacity} vph</span>
                                </div>
                                <div>
                                  <span className="block text-[8px] uppercase tracking-wider">Lanes</span>
                                  <span className="font-bold text-primary">{road.laneCount} channels</span>
                                </div>
                                <div>
                                  <span className="block text-[8px] uppercase tracking-wider">Speed</span>
                                  <span className="font-bold text-brand-blue">{road.currentSpeed} km/h</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Manual Signal Override Console (Right Column) */}
                      <div className="lg:col-span-5 bg-zinc-950 border border-border p-5 rounded-2xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted font-mono flex items-center space-x-1.5">
                              <Sliders className="h-3.5 w-3.5 text-brand-purple" />
                              <span>Signal Control Override</span>
                            </span>
                            <span className="text-[9px] uppercase font-mono bg-surface border border-border px-2 py-0.5 rounded text-primary-muted">
                              Active Mode: {signal?.mode || 'AUTO'}
                            </span>
                          </div>
                          
                          <p className="text-[11px] text-primary-muted leading-relaxed mb-4">
                            Selecting manual modes suspends edge scheduling. Lock lights to override queues for emergency passage.
                          </p>
                        </div>

                        {/* Control buttons group */}
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => updateSignalState(item.id, 'GREEN', 'MANUAL')}
                              className="bg-emerald-950/45 hover:bg-emerald-900/50 border border-emerald-500/20 text-emerald-400 text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center space-x-1.5 transition-colors"
                            >
                              <Play className="h-3.5 w-3.5" />
                              <span>Force Green Wave</span>
                            </button>
                            
                            <button
                              onClick={() => updateSignalState(item.id, 'RED', 'MANUAL')}
                              className="bg-red-950/45 hover:bg-red-900/50 border border-red-500/20 text-red-400 text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center space-x-1.5 transition-colors"
                            >
                              <Pause className="h-3.5 w-3.5" />
                              <span>Hold Grid Red</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => triggerEmergencyOverride(item.id)}
                              className="bg-brand-blue hover:bg-brand-blue/90 text-background text-xs font-bold py-2.5 rounded-lg flex items-center justify-center space-x-1.5 transition-colors"
                            >
                              <ShieldAlert className="h-3.5 w-3.5" />
                              <span>Emergency Wave</span>
                            </button>
                            
                            <button
                              onClick={() => resetToAuto(item.id)}
                              className="bg-surface hover:bg-zinc-800 border border-border text-primary text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center space-x-1.5 transition-colors"
                            >
                              <RefreshCcw className="h-3.5 w-3.5" />
                              <span>Restore Auto</span>
                            </button>
                          </div>
                        </div>

                      </div>

                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-primary-muted text-xs">
              Initializing intersections map grid telemetry...
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
