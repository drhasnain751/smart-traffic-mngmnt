import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTrafficStore } from '../store/useTrafficStore';
import { 
  LayoutDashboard, 
  GitCommit, 
  Video, 
  Map, 
  FileText, 
  AreaChart, 
  AlertTriangle, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const sidebarItems = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Intersections', path: '/intersections', icon: GitCommit },
  { name: 'Live Stream', path: '/monitoring', icon: Video },
  { name: 'City Map', path: '/map', icon: Map },
  { name: 'Reports Log', path: '/reports', icon: FileText },
  { name: 'Analytics', path: '/analytics', icon: AreaChart },
  { name: 'Incident Center', path: '/alerts', icon: AlertTriangle, countKey: 'activeAlertsCount' },
  { name: 'System Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { dashboardMetrics } = useTrafficStore();

  return (
    <aside 
      className={`h-[calc(100vh-110px)] sticky top-[96px] left-0 z-20 flex flex-col bg-panel border border-border rounded-2xl transition-all duration-300 shadow-premium ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 bg-border border border-border hover:bg-border-focus p-1.5 rounded-full text-primary-muted hover:text-primary transition-all duration-200"
      >
        {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>

      {/* Title */}
      <div className={`p-6 border-b border-border flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted">
            Control Console
          </span>
        )}
        <div className={`h-2.5 w-2.5 rounded-full bg-traffic-green pulsing-green ${collapsed ? '' : 'ml-1'}`} />
      </div>

      {/* Navigation list */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const count = item.countKey ? dashboardMetrics[item.countKey] : 0;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center rounded-xl p-3 text-sm font-medium transition-all duration-150 relative group ${
                isActive 
                  ? 'bg-surface text-primary border border-border' 
                  : 'text-primary-muted hover:text-primary hover:bg-surface/50 border border-transparent'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-brand-blue' : ''}`} />
              
              {!collapsed && (
                <span className="ml-3 animate-fade-in truncate">{item.name}</span>
              )}

              {/* Alert Count badge */}
              {count > 0 && (
                <span className={`absolute ${collapsed ? 'top-1 right-1' : 'right-3'} flex h-5 min-w-5 items-center justify-center rounded-full bg-red-950/80 border border-red-500/30 px-1 text-[10px] font-bold text-red-400`}>
                  {count}
                </span>
              )}

              {/* Tooltip for collapsed view */}
              {collapsed && (
                <div className="absolute left-20 bg-panel border border-border px-3 py-1.5 rounded-lg text-xs text-primary font-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-premium z-30">
                  {item.name} {count > 0 ? `(${count})` : ''}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer system connection status */}
      <div className={`p-4 border-t border-border flex items-center justify-center bg-surface/30 rounded-b-2xl`}>
        <div className="flex items-center space-x-2.5">
          <div className="h-1.5 w-1.5 rounded-full bg-brand-blue animate-ping" />
          {!collapsed && (
            <span className="text-[10px] tracking-widest uppercase font-mono text-primary-muted">
              OS.CORE.LIVE
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
