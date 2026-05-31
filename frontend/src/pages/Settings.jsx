import React, { useEffect, useState } from 'react';
import { useTrafficStore } from '../store/useTrafficStore';
import { 
  Settings as SettingsIcon, Sliders, Shield, Bell, Key, RefreshCw, CheckCircle, Info, Copy, Check 
} from 'lucide-react';

export default function Settings() {
  const { settings, user, token, fetchSettings, updateSettings } = useTrafficStore();
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);
  const [alertThreshold, setAlertThreshold] = useState(0.8);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      setSpeedMultiplier(settings.simulationSpeedMultiplier);
      setAlertThreshold(settings.congestionAlertThreshold);
      setEmailAlerts(settings.notificationChannels?.email);
      setPushAlerts(settings.notificationChannels?.dashboardPush);
      setSmsAlerts(settings.notificationChannels?.sms);
    }
  }, [settings]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await updateSettings({
        simulationSpeedMultiplier: Number(speedMultiplier),
        congestionAlertThreshold: Number(alertThreshold),
        notificationChannels: {
          email: emailAlerts,
          dashboardPush: pushAlerts,
          sms: smsAlerts
        }
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">System Settings</h1>
          <p className="text-sm text-primary-muted mt-1.5">Configure virtual city simulator speeds, notification channels, and active profile details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Settings Form (Left 2/3) */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* Simulation controls card */}
            <div className="bg-panel border border-border p-6 rounded-2xl space-y-5 shadow-premium">
              <div className="flex items-center space-x-2 border-b border-border pb-3.5">
                <Sliders className="h-4.5 w-4.5 text-brand-blue" />
                <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted font-mono">
                  Transit Simulator Speeds
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Speed Multiplier */}
                <div className="space-y-2">
                  <label htmlFor="speed-range" className="text-xs font-semibold text-primary">Simulation Speed Multiplier ({speedMultiplier}x)</label>
                  <p className="text-[10px] text-primary-muted leading-relaxed">
                    Speeds up signal changes and congestion increments. Higher numbers cycle signals faster.
                  </p>
                  <input
                    id="speed-range"
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.5"
                    value={speedMultiplier}
                    onChange={e => setSpeedMultiplier(e.target.value)}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-primary-muted">
                    <span>0.5x Slow</span>
                    <span>1.0x Realtime</span>
                    <span>5.0x Fast</span>
                  </div>
                </div>

                {/* Congestion Threshold */}
                <div className="space-y-2">
                  <label htmlFor="threshold-range" className="text-xs font-semibold text-primary">Congestion Warning Threshold ({(alertThreshold * 100).toFixed(0)}%)</label>
                  <p className="text-[10px] text-primary-muted leading-relaxed">
                    The occupancy level above which the system automatically creates overload alerts.
                  </p>
                  <input
                    id="threshold-range"
                    type="range"
                    min="0.5"
                    max="0.95"
                    step="0.05"
                    value={alertThreshold}
                    onChange={e => setAlertThreshold(e.target.value)}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-primary-muted">
                    <span>50% Low</span>
                    <span>80% Default</span>
                    <span>95% High</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification channels card */}
            <div className="bg-panel border border-border p-6 rounded-2xl space-y-5 shadow-premium">
              <div className="flex items-center space-x-2 border-b border-border pb-3.5">
                <Bell className="h-4.5 w-4.5 text-brand-blue" />
                <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted font-mono">
                  Emergency Notification Channels
                </span>
              </div>

              <div className="space-y-3.5">
                {/* Email warning */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-0.5">
                    <label htmlFor="email-checkbox" className="text-xs font-semibold text-primary">Email Dispatch Logs</label>
                    <span className="text-[10px] text-primary-muted">Email warning reports on critical anomalies to municipal desks.</span>
                  </div>
                  <input 
                    id="email-checkbox"
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={e => setEmailAlerts(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-border text-brand-blue bg-zinc-950 focus:ring-0 cursor-pointer"
                  />
                </div>

                {/* Dashboard Push */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-0.5">
                    <label htmlFor="push-checkbox" className="text-xs font-semibold text-primary">Control Push Notifications</label>
                    <span className="text-[10px] text-primary-muted">Display floating window banners in real-time when issues trigger.</span>
                  </div>
                  <input 
                    id="push-checkbox"
                    type="checkbox"
                    checked={pushAlerts}
                    onChange={e => setPushAlerts(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-border text-brand-blue bg-zinc-950 focus:ring-0 cursor-pointer"
                  />
                </div>

                {/* SMS warnings */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-0.5">
                    <label htmlFor="sms-checkbox" className="text-xs font-semibold text-primary">SMS Dispatch Alerts</label>
                    <span className="text-[10px] text-primary-muted">Send immediate SMS warnings to operators. (SMS gateway setup required).</span>
                  </div>
                  <input 
                    id="sms-checkbox"
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={e => setSmsAlerts(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-border text-brand-blue bg-zinc-950 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Actions button */}
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary hover:bg-primary-muted text-background text-xs font-bold px-8 py-3 rounded-lg flex items-center space-x-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${saving ? 'animate-spin' : ''}`} />
                <span>{saving ? 'Updating settings...' : 'Commit Settings changes'}</span>
              </button>

              {success && (
                <div className="flex items-center space-x-1.5 text-xs text-traffic-green font-semibold">
                  <CheckCircle className="h-4 w-4" />
                  <span>Parameters successfully verified & updated.</span>
                </div>
              )}
            </div>

          </form>
        </div>

        {/* API keys & Account info (Right 1/3) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Account profile card */}
          <div className="bg-panel border border-border p-6 rounded-2xl shadow-premium space-y-4">
            <div className="flex items-center space-x-2 border-b border-border pb-3.5">
              <Shield className="h-4.5 w-4.5 text-brand-blue" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted font-mono">
                Operator Profile
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-[10px] uppercase font-mono text-primary-muted">Full Name</span>
                <span className="block font-bold mt-0.5">{user?.name}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-primary-muted">Email Identity</span>
                <span className="block font-bold mt-0.5">{user?.email}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-primary-muted">Credentials Role</span>
                <span className="block font-bold text-brand-purple mt-0.5">{user?.role}</span>
              </div>
            </div>
          </div>

          {/* Client access token card */}
          <div className="bg-panel border border-border p-6 rounded-2xl shadow-premium space-y-4">
            <div className="flex items-center space-x-2 border-b border-border pb-3.5">
              <Key className="h-4.5 w-4.5 text-brand-purple" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted font-mono">
                JWT API Token
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] text-primary-muted leading-relaxed">
                Use this token to authorize edge camera devices and IoT sensors to send data.
              </p>
              
              <div className="flex items-center bg-zinc-950 p-2.5 rounded-lg border border-border">
                <span className="text-[9px] font-mono text-primary-muted truncate mr-2 flex-1">
                  {token}
                </span>
                <button
                  onClick={copyToken}
                  className="p-1 hover:bg-surface border border-border rounded text-primary-muted hover:text-primary transition-colors"
                  title="Copy Token"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-traffic-green" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
