import React, { useEffect, useState } from 'react';
import { useTrafficStore } from '../store/useTrafficStore';
import { 
  Sparkles, ShieldAlert, Cpu, AreaChart as ChartIcon, Eye, Zap, TrendingUp, HelpCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Analytics() {
  const { getHeaders, triggerEmergencyOverride } = useTrafficStore();
  const [forecastData, setForecastData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const headers = getHeaders();
        
        const forecastRes = await fetch('http://localhost:5000/api/analytics/forecast', { headers });
        const forecastJson = await forecastRes.json();
        setForecastData(forecastJson);

        const recRes = await fetch('http://localhost:5000/api/analytics/recommendations', { headers });
        const recJson = await recRes.json();
        setRecommendations(recJson);
      } catch (err) {
        console.error('Failed to retrieve analytics databases:', err);
      }
    };
    fetchAnalyticsData();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">Predictive Analytics</h1>
          <p className="text-sm text-primary-muted mt-1.5">Machine learning transit forecasting, scheduling calibration, and AI insights.</p>
        </div>
      </div>

      {/* Grid: 24-Hour Forecast (Left) and AI advisory list (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Forecast chart (2/3 width) */}
        <div className="lg:col-span-2 bg-panel border border-border rounded-2xl p-6 flex flex-col justify-between shadow-premium">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted font-mono flex items-center space-x-1.5">
                <ChartIcon className="h-4.5 w-4.5 text-brand-blue" />
                <span>24-Hour Congestion Index Forecast</span>
              </span>
              <span className="text-xs text-primary-muted">Comparing historical average vs. AI prediction curves</span>
            </div>
          </div>

          <div className="h-80 w-full">
            {forecastData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData}>
                  <defs>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ background: '#121214', border: '1px solid #27272a', borderRadius: '8px' }}
                    labelClassName="text-xs text-primary-muted"
                  />
                  <XAxis dataKey="hour" stroke="#a1a1aa" fontSize={10} tickLine={false} />
                  <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} domain={[0, 1]} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area name="AI Predicted" type="monotone" dataKey="predictedCongestion" stroke="#818cf8" strokeWidth={1.5} fillOpacity={1} fill="url(#colorPredicted)" />
                  <Area name="Historical Baseline" type="monotone" dataKey="historicalCongestion" stroke="#3b82f6" strokeWidth={1} strokeDasharray="3 3" fillOpacity={1} fill="url(#colorHistorical)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-primary-muted">
                Compiling 24-hour neural projections...
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Advisory Recommendations */}
        <div className="bg-panel border border-border rounded-2xl p-6 flex flex-col justify-between shadow-premium">
          <div>
            <div className="flex items-center space-x-2 border-b border-border pb-3.5 mb-4">
              <Sparkles className="h-4.5 w-4.5 text-brand-purple" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted font-mono">
                AI Advisory Center
              </span>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {recommendations.map(rec => (
                <div key={rec.id} className="bg-surface border border-border p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-brand-purple">{rec.title}</span>
                      <span className="text-[10px] text-primary font-bold">{rec.intersectionName}</span>
                    </div>
                    <span className={`text-[8px] font-mono px-2 py-0.5 rounded ${
                      rec.priority === 'CRITICAL' ? 'bg-red-950/40 text-red-400 border border-red-950' : 'bg-zinc-950 text-zinc-400 border border-border'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-primary-muted leading-relaxed">{rec.message}</p>
                  
                  {rec.actionable && (
                    <button
                      onClick={() => triggerEmergencyOverride(rec.intersectionId)}
                      className="w-full bg-brand-purple/20 hover:bg-brand-purple/35 text-brand-purple text-[10px] font-semibold py-2 rounded-lg transition-colors text-center"
                    >
                      Authorize Dynamic Cycle Calibration
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-950 p-4 border border-border rounded-xl mt-4">
            <div className="flex items-center space-x-2">
              <Cpu className="h-4 w-4 text-brand-blue" />
              <span className="text-[11px] font-mono font-bold text-primary-muted uppercase">Neural Processor Specs</span>
            </div>
            <p className="text-[10px] text-primary-muted leading-normal mt-1">
              Optimization weights auto-train daily at 02:00 UTC using historic flow rates.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
