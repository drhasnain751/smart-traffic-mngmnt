import React, { useEffect, useState } from 'react';
import { useTrafficStore } from '../store/useTrafficStore';
import { 
  AlertTriangle, CheckCircle, Bell, Clock, RefreshCw, Eye, Sparkles, Plus, AlertOctagon 
} from 'lucide-react';

export default function Alerts() {
  const { alerts, intersections, fetchAlerts, resolveAlert, getHeaders } = useTrafficStore();
  const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, RESOLVED
  
  // Custom Alert Trigger Form Fields
  const [intersectionId, setIntersectionId] = useState('');
  const [type, setType] = useState('ACCIDENT');
  const [severity, setSeverity] = useState('MEDIUM');
  const [message, setMessage] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAlerts();
    if (intersections.length > 0) {
      setIntersectionId(intersections[0].id);
    }
  }, [intersections]);

  const handleTriggerAlert = async (e) => {
    e.preventDefault();
    if (!intersectionId || !message) return;
    setCreating(true);

    try {
      const res = await fetch('http://localhost:5000/api/alerts', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ intersectionId, type, severity, message })
      });
      if (res.ok) {
        setMessage('');
        fetchAlerts();
      }
    } catch (err) {
      console.error('Failed to trigger manual incident:', err);
    } finally {
      setCreating(false);
    }
  };

  const activeAlerts = alerts.filter(x => x.status === 'ACTIVE');
  const resolvedAlerts = alerts.filter(x => x.status === 'RESOLVED');

  const displayedAlerts = alerts.filter(item => {
    if (filter === 'ACTIVE') return item.status === 'ACTIVE';
    if (filter === 'RESOLVED') return item.status === 'RESOLVED';
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">Incident Console</h1>
          <p className="text-sm text-primary-muted mt-1.5">Manage real-time accident delays, signal faults, and emergency overrides.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: List and status selection (2/3 width) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Status selector tabs */}
          <div className="bg-panel border border-border p-1.5 rounded-xl flex space-x-1.5 w-fit">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                filter === 'ALL' ? 'bg-surface text-primary' : 'text-primary-muted hover:text-primary'
              }`}
            >
              All Incidents ({alerts.length})
            </button>
            <button
              onClick={() => setFilter('ACTIVE')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                filter === 'ACTIVE' ? 'bg-red-950/20 text-red-400 border border-red-500/20' : 'text-primary-muted hover:text-primary'
              }`}
            >
              Active Alert Feed ({activeAlerts.length})
            </button>
            <button
              onClick={() => setFilter('RESOLVED')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                filter === 'RESOLVED' ? 'bg-surface text-primary' : 'text-primary-muted hover:text-primary'
              }`}
            >
              Archive Resolved ({resolvedAlerts.length})
            </button>
          </div>

          {/* Incidents feed list */}
          <div className="space-y-4">
            {displayedAlerts.length > 0 ? (
              displayedAlerts.map(item => (
                <div 
                  key={item.id}
                  className={`bg-panel border rounded-2xl p-5 shadow-premium flex flex-col justify-between ${
                    item.status === 'ACTIVE' && item.severity === 'CRITICAL' ? 'border-red-500/30 bg-red-950/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <AlertOctagon className={`h-4.5 w-4.5 ${
                        item.status === 'RESOLVED' ? 'text-zinc-600' :
                        item.severity === 'CRITICAL' ? 'text-red-400 animate-pulse' : 'text-amber-400'
                      }`} />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-primary">{item.type}</span>
                        <span className="text-[10px] font-medium text-primary-muted mt-0.5">{item.intersection?.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                        item.severity === 'CRITICAL' ? 'bg-red-950/40 text-red-400 border border-red-900/50' : 'bg-zinc-950 border border-border text-primary-muted'
                      }`}>
                        {item.severity}
                      </span>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                        item.status === 'ACTIVE' ? 'bg-red-950/20 text-red-400 border border-red-900/20' : 'bg-green-950/20 text-green-400 border border-green-900/20'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-primary-muted leading-relaxed mt-3.5 border-b border-border/30 pb-3">
                    {item.message}
                  </p>

                  <div className="flex justify-between items-center pt-3 text-[10px] text-primary-muted font-mono">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Logged: {new Date(item.createdAt).toLocaleString()}</span>
                      {item.resolvedAt && (
                        <>
                          <span>•</span>
                          <span className="text-traffic-green">Resolved: {new Date(item.resolvedAt).toLocaleTimeString()}</span>
                        </>
                      )}
                    </div>

                    {item.status === 'ACTIVE' && (
                      <button
                        onClick={() => resolveAlert(item.id)}
                        className="bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Resolve Incident
                      </button>
                    )}
                  </div>

                </div>
              ))
            ) : (
              <div className="bg-panel border border-border rounded-2xl p-12 text-center text-primary-muted flex flex-col items-center justify-center space-y-3">
                <CheckCircle className="h-10 w-10 text-traffic-green opacity-40" />
                <span className="text-xs">No alerts compiled under the chosen filter context.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dispatch Simulator Trigger form (1/3 width) */}
        <div className="lg:col-span-4 bg-panel border border-border p-6 rounded-2xl flex flex-col justify-between shadow-premium h-fit">
          <form onSubmit={handleTriggerAlert} className="space-y-5">
            <div className="flex items-center space-x-2 border-b border-border pb-3.5">
              <Plus className="h-4.5 w-4.5 text-brand-blue" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted font-mono">
                Manual Incident Override
              </span>
            </div>

            {/* Target Node */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="alert-intersection-select" className="text-xs font-medium text-primary-muted">Target Grid Node</label>
              <select
                id="alert-intersection-select"
                value={intersectionId}
                onChange={e => setIntersectionId(e.target.value)}
                className="bg-zinc-950 border border-border px-3.5 py-2.5 rounded-lg text-xs w-full focus:outline-none focus:border-brand-blue"
                required
              >
                {intersections.map(x => (
                  <option key={x.id} value={x.id}>{x.name}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="alert-type-select" className="text-xs font-medium text-primary-muted">Incident Type</label>
              <select
                id="alert-type-select"
                value={type}
                onChange={e => setType(e.target.value)}
                className="bg-zinc-950 border border-border px-3.5 py-2.5 rounded-lg text-xs w-full focus:outline-none focus:border-brand-blue"
              >
                <option value="ACCIDENT">Vehicle Collision / Crash</option>
                <option value="CONGESTION">Abnormal Gridlock Volume</option>
                <option value="SIGNAL_FAILURE">Signal Unit Offline</option>
                <option value="EMERGENCY_OVERRIDE">Emergency Dispatch Wave</option>
              </select>
            </div>

            {/* Severity */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="alert-severity-select" className="text-xs font-medium text-primary-muted">Priority Severity</label>
              <select
                id="alert-severity-select"
                value={severity}
                onChange={e => setSeverity(e.target.value)}
                className="bg-zinc-950 border border-border px-3.5 py-2.5 rounded-lg text-xs w-full focus:outline-none focus:border-brand-blue"
              >
                <option value="LOW">Low Warning</option>
                <option value="MEDIUM">Medium Anomaly</option>
                <option value="HIGH">High Obstruction</option>
                <option value="CRITICAL">Critical Grid Failure</option>
              </select>
            </div>

            {/* Message Description */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="alert-message-textarea" className="text-xs font-medium text-primary-muted">Dispatch Warning Message</label>
              <textarea
                id="alert-message-textarea"
                placeholder="Describe lane closures, backup lengths, or device fault details..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="bg-zinc-950 border border-border px-3.5 py-2.5 rounded-lg text-xs w-full h-24 focus:outline-none focus:border-brand-blue resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full bg-red-900/40 hover:bg-red-900/60 border border-red-500/20 text-red-300 text-xs font-bold py-3 rounded-lg flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
            >
              <Plus className={`h-3.5 w-3.5 ${creating ? 'animate-spin' : ''}`} />
              <span>{creating ? 'Broadcasting...' : 'Broadcast Anomaly Dispatch'}</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
