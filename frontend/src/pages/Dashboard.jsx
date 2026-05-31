import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTrafficStore } from '../store/useTrafficStore';
import { 
  Zap, AlertTriangle, Play, Pause, RefreshCw, BarChart2, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { 
    intersections, 
    alerts, 
    settings, 
    dashboardMetrics, 
    activityLogs, 
    fetchIntersections, 
    fetchAlerts, 
    fetchSettings,
    resolveAlert,
    triggerEmergencyOverride,
    resetToAuto
  } = useTrafficStore();

  const [aiRecs, setAiRecs] = useState([]);
  const [trendData, setTrendData] = useState([]);

  // Fetch data on load
  useEffect(() => {
    fetchIntersections();
    fetchAlerts();
    fetchSettings();

    // Fetch recommendations and trends
    const fetchAnalytics = async () => {
      try {
        const headers = useTrafficStore.getState().getHeaders();
        const trendRes = await fetch('http://localhost:5000/api/analytics/trends', { headers });
        const trendJson = await trendRes.json();
        setTrendData(trendJson);

        const recRes = await fetch('http://localhost:5000/api/analytics/recommendations', { headers });
        const recJson = await recRes.json();
        setAiRecs(recJson);
      } catch (err) {
        console.error('Failed to load dashboard analytics data:', err);
      }
    };
    fetchAnalytics();
  }, []);

  const activeAlerts = alerts.filter(x => x.status === 'ACTIVE');
  const criticalAlerts = activeAlerts.filter(x => x.severity === 'CRITICAL' || x.severity === 'HIGH');
  const overloads = intersections.filter(x => x.congestionLevel > 0.75);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">Mission Control</h1>
          <p className="text-sm text-primary-muted mt-1.5">Real-time metropolitan transit optimization & anomaly tracking.</p>
        </div>
        
        {/* Connection status indicator */}
        <div className="flex items-center space-x-2 mt-4 md:mt-0 bg-surface border border-border px-4 py-2 rounded-xl text-xs font-mono">
          <span className="h-2 w-2 rounded-full bg-traffic-green pulsing-green" />
          <span className="text-primary-muted">WebSocket Tunnel:</span>
          <span className="font-semibold text-primary">SYNCED</span>
        </div>
      </div>

      {/* Grid Row 1: Metrics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="bg-panel border border-border p-5 rounded-xl shadow-inset-card flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono tracking-wider text-primary-muted">Average Congestion</span>
          <div className="flex items-baseline space-x-2 mt-3">
            <span className="text-3xl font-bold font-display">{(dashboardMetrics.averageCongestion * 100).toFixed(0)}%</span>
            <span className={`text-xs font-semibold ${dashboardMetrics.averageCongestion > 0.6 ? 'text-red-400' : 'text-green-400'}`}>
              {dashboardMetrics.averageCongestion > 0.6 ? 'High Load' : 'Flowing'}
            </span>
          </div>
          <div className="mt-2 text-xs text-primary-muted">Across all online sensors</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-panel border border-border p-5 rounded-xl shadow-inset-card flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono tracking-wider text-primary-muted">Active Incidents</span>
          <div className="flex items-baseline space-x-2 mt-3">
            <span className="text-3xl font-bold font-display text-traffic-red">{activeAlerts.length}</span>
            {criticalAlerts.length > 0 && (
              <span className="text-xs bg-red-950/50 border border-red-500/20 text-red-400 px-2 py-0.5 rounded font-mono font-medium animate-pulse">
                {criticalAlerts.length} Critical
              </span>
            )}
          </div>
          <div className="mt-2 text-xs text-primary-muted">Unresolved safety warnings</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-panel border border-border p-5 rounded-xl shadow-inset-card flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono tracking-wider text-primary-muted">Signals Active</span>
          <div className="flex items-baseline space-x-2 mt-3">
            <span className="text-3xl font-bold font-display text-traffic-green">{dashboardMetrics.operatingSignalsCount}</span>
            <span className="text-xs text-primary-muted">/ {dashboardMetrics.activeIntersectionsCount} Nodes</span>
          </div>
          <div className="mt-2 text-xs text-primary-muted">Autonomous routing enabled</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-panel border border-border p-5 rounded-xl shadow-inset-card flex flex-col justify-between">
          <span className="text-[10px] uppercase font-mono tracking-wider text-primary-muted">Priority Wave Mode</span>
          <div className="flex items-baseline space-x-2 mt-3">
            <span className="text-3xl font-bold font-display text-brand-blue">
              {intersections.filter(x => x.status === 'OVERRIDE').length}
            </span>
            <span className="text-xs text-primary-muted">Nodes overridden</span>
          </div>
          <div className="mt-2 text-xs text-primary-muted">Manual green light routes active</div>
        </div>
      </div>

      {/* Grid Row 2: Analytics Trend & Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2/3 - Real-time transit volume chart */}
        <div className="lg:col-span-2 bg-panel border border-border rounded-xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted font-mono">Grid Congestion Trend</span>
              <span className="text-xs text-primary-muted">Historical flow profiles</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
              <span>Delay index</span>
            </div>
          </div>

          <div className="h-64 w-full">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorDelayDash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ background: '#121214', border: '1px solid #27272a', borderRadius: '8px' }}
                    labelClassName="text-xs text-primary-muted"
                  />
                  <XAxis dataKey="day" stroke="#a1a1aa" fontSize={10} tickLine={false} />
                  <Area type="monotone" dataKey="congestionIdx" stroke="#3b82f6" strokeWidth={1.5} fillOpacity={1} fill="url(#colorDelayDash)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-primary-muted">
                Compiling analytics trends...
              </div>
            )}
          </div>
        </div>

        {/* Right 1/3 - Hotspot intersections & Congestion overload */}
        <div className="bg-panel border border-border rounded-xl p-6 flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted font-mono mb-4">
            Congestion Hotspots
          </span>
          <div className="flex-1 overflow-y-auto space-y-4 max-h-[250px]">
            {overloads.length > 0 ? (
              overloads.map(item => (
                <div key={item.id} className="bg-surface/50 border border-border/80 p-3 rounded-lg flex items-center justify-between">
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold truncate">{item.name}</span>
                    <span className="text-[10px] text-primary-muted font-mono mt-0.5">{item.vehicleCount} vehicles queued</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-traffic-red">{(item.congestionLevel * 100).toFixed(0)}%</span>
                    <button 
                      onClick={() => triggerEmergencyOverride(item.id)}
                      className="bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue text-[10px] font-semibold px-2 py-1 rounded transition-colors"
                    >
                      Override
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 py-8 text-primary-muted">
                <CheckCircle2 className="h-8 w-8 text-traffic-green opacity-40" />
                <span className="text-xs">All intersections below alert thresholds. Grid operating optimally.</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Grid Row 3: Signal status & Dynamic incident logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Real-time signals overview */}
        <div className="bg-panel border border-border rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted font-mono">
              Signal Grid Matrix
            </span>
            <Link to="/intersections" className="text-xs text-brand-blue hover:text-brand-purple transition-colors">
              Manage grid
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto max-h-[300px]">
            {intersections.map(item => {
              const signal = item.Signals[0];
              const lightColor = signal?.activeState;

              return (
                <div key={item.id} className="bg-surface/50 border border-border p-3 rounded-lg flex flex-col justify-between">
                  <span className="text-xs font-semibold truncate leading-tight">{item.name}</span>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-1">
                      <div className={`h-2.5 w-2.5 rounded-full ${
                        lightColor === 'GREEN' ? 'bg-traffic-green shadow-[0_0_8px_#10b981]' : 
                        lightColor === 'YELLOW' ? 'bg-traffic-yellow shadow-[0_0_8px_#f59e0b]' : 
                        'bg-traffic-red shadow-[0_0_8px_#ef4444]'
                      }`} />
                      <span className="text-[10px] font-mono uppercase font-bold text-primary-muted">
                        {lightColor || 'RED'} ({signal?.timerSeconds}s)
                      </span>
                    </div>
                    <span className="text-[9px] uppercase font-mono bg-zinc-900 border border-border px-1.5 py-0.5 rounded text-primary-muted">
                      {signal?.mode || 'AUTO'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle Column: Live Alerts Emergency logs */}
        <div className="bg-panel border border-border rounded-xl p-6 flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted font-mono mb-4">
            Alert console feed
          </span>

          <div className="flex-1 overflow-y-auto space-y-3 max-h-[300px]">
            {activeAlerts.length > 0 ? (
              activeAlerts.map(item => (
                <div 
                  key={item.id} 
                  className={`border p-3 rounded-lg flex flex-col justify-between ${
                    item.severity === 'CRITICAL' ? 'bg-red-950/20 border-red-500/30' : 'bg-surface/60 border-border'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className={`h-3.5 w-3.5 ${item.severity === 'CRITICAL' ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
                      <span className="text-xs font-semibold text-primary">{item.type}</span>
                    </div>
                    <span className="text-[8px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-950 border border-border text-primary-muted">
                      {item.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-primary-muted mt-2 leading-relaxed">{item.message}</p>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/40">
                    <span className="text-[9px] text-primary-muted font-mono">
                      {new Date(item.createdAt).toLocaleTimeString()}
                    </span>
                    <button 
                      onClick={() => resolveAlert(item.id)}
                      className="text-traffic-green hover:underline text-[10px] font-semibold"
                    >
                      Resolve incident
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 py-12 text-primary-muted">
                <CheckCircle2 className="h-8 w-8 text-traffic-green opacity-40" />
                <span className="text-xs">No active alerts. Grid status clear.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI recommendations */}
        <div className="bg-panel border border-border rounded-xl p-6 flex flex-col">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="h-4.5 w-4.5 text-brand-purple" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted font-mono">
              AI Scheduling Recommendations
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 max-h-[300px]">
            {aiRecs.map(rec => (
              <div key={rec.id} className="bg-surface/50 border border-border p-3.5 rounded-lg flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-purple">{rec.title}</span>
                  <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
                    rec.priority === 'CRITICAL' ? 'bg-red-950/40 text-red-400 border border-red-900/50' : 'bg-zinc-950 border border-border text-primary-muted'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-primary mt-1">{rec.intersectionName}</span>
                <p className="text-[10px] text-primary-muted leading-relaxed mt-1">{rec.message}</p>
                {rec.actionable && (
                  <button 
                    onClick={() => triggerEmergencyOverride(rec.intersectionId)}
                    className="mt-3 bg-brand-purple/20 hover:bg-brand-purple/35 text-brand-purple text-[10px] font-semibold py-1.5 rounded-md transition-colors"
                  >
                    Authorize calibration adjustment
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Activity Logs row */}
      <div className="bg-panel border border-border rounded-xl p-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted font-mono block mb-4">
          Command Center Audit Activity Logs
        </span>
        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2">
          {activityLogs.length > 0 ? (
            activityLogs.map((log, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs border-b border-border/40 py-2">
                <div className="flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                  <span className="text-primary">{log.message}</span>
                </div>
                <span className="text-[10px] font-mono text-primary-muted">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          ) : (
            <div className="text-xs text-primary-muted py-2">
              Waiting for operational events...
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
