import { create } from 'zustand';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

export const useTrafficStore = create((set, get) => ({
  // Authentication State
  token: localStorage.getItem('traffic_token') || null,
  user: JSON.parse(localStorage.getItem('traffic_user')) || null,
  authLoading: false,
  authError: null,

  // Operational States
  intersections: [],
  alerts: [],
  settings: {
    simulationSpeedMultiplier: 1.0,
    congestionAlertThreshold: 0.8,
    autoResolutionMinutes: 5,
    emergencyPriorityProtocol: "GREEN_WAVE",
    notificationChannels: { email: true, sms: false, dashboardPush: true }
  },
  activityLogs: [],
  dashboardMetrics: {
    averageCongestion: 0.45,
    activeAlertsCount: 3,
    operatingSignalsCount: 8,
    activeIntersectionsCount: 8,
  },
  
  // Real-time Socket Connection
  socket: null,
  socketConnected: false,

  // Auth Operations
  login: async (email, password) => {
    set({ authLoading: true, authError: null });
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      localStorage.setItem('traffic_token', data.token);
      localStorage.setItem('traffic_user', JSON.stringify(data.user));
      
      set({ token: data.token, user: data.user, authLoading: false });
      get().initSocket();
      return true;
    } catch (err) {
      set({ authError: err.message, authLoading: false });
      return false;
    }
  },

  signup: async (name, email, password, role = 'OPERATOR') => {
    set({ authLoading: true, authError: null });
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      
      localStorage.setItem('traffic_token', data.token);
      localStorage.setItem('traffic_user', JSON.stringify(data.user));
      
      set({ token: data.token, user: data.user, authLoading: false });
      get().initSocket();
      return true;
    } catch (err) {
      set({ authError: err.message, authLoading: false });
      return false;
    }
  },

  logout: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    localStorage.removeItem('traffic_token');
    localStorage.removeItem('traffic_user');
    set({ token: null, user: null, socket: null, socketConnected: false, intersections: [], alerts: [] });
  },

  // HTTP Operations with Auth Header helper
  getHeaders: () => {
    const { token } = get();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  },

  fetchIntersections: async () => {
    try {
      const res = await fetch(`${API_URL}/api/intersections`, {
        headers: get().getHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        set({ intersections: data });
        get().calculateMetrics(data);
      }
    } catch (err) {
      console.error('Fetch intersections error:', err);
    }
  },

  updateSignalState: async (intersectionId, activeState, mode) => {
    try {
      const res = await fetch(`${API_URL}/api/intersections/${intersectionId}/signal`, {
        method: 'PUT',
        headers: get().getHeaders(),
        body: JSON.stringify({ activeState, mode })
      });
      const data = await res.json();
      if (res.ok) {
        // Local state updates will be synced via socket emit, but let's update immediately for speed
        const updatedIntersections = get().intersections.map(item => 
          item.id === intersectionId ? data.intersection : item
        );
        set({ intersections: updatedIntersections });
        get().calculateMetrics(updatedIntersections);
      }
    } catch (err) {
      console.error('Update signal error:', err);
    }
  },

  triggerEmergencyOverride: async (intersectionId) => {
    try {
      const res = await fetch(`${API_URL}/api/intersections/${intersectionId}/override`, {
        method: 'POST',
        headers: get().getHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        const updatedIntersections = get().intersections.map(item => 
          item.id === intersectionId ? data.intersection : item
        );
        set({ intersections: updatedIntersections });
        get().calculateMetrics(updatedIntersections);
      }
    } catch (err) {
      console.error('Emergency override error:', err);
    }
  },

  resetToAuto: async (intersectionId) => {
    try {
      const res = await fetch(`${API_URL}/api/intersections/${intersectionId}/reset`, {
        method: 'POST',
        headers: get().getHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        const updatedIntersections = get().intersections.map(item => 
          item.id === intersectionId ? data.intersection : item
        );
        set({ intersections: updatedIntersections });
        get().calculateMetrics(updatedIntersections);
      }
    } catch (err) {
      console.error('Reset to auto error:', err);
    }
  },

  fetchAlerts: async () => {
    try {
      const res = await fetch(`${API_URL}/api/alerts`, {
        headers: get().getHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        set({ alerts: data });
      }
    } catch (err) {
      console.error('Fetch alerts error:', err);
    }
  },

  resolveAlert: async (alertId) => {
    try {
      const res = await fetch(`${API_URL}/api/alerts/${alertId}/resolve`, {
        method: 'PUT',
        headers: get().getHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        set(state => ({
          alerts: state.alerts.map(item => item.id === alertId ? { ...item, status: 'RESOLVED', resolvedAt: data.resolvedAt } : item)
        }));
      }
    } catch (err) {
      console.error('Resolve alert error:', err);
    }
  },

  fetchSettings: async () => {
    try {
      const res = await fetch(`${API_URL}/api/settings`, {
        headers: get().getHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        set({ settings: data });
      }
    } catch (err) {
      console.error('Fetch settings error:', err);
    }
  },

  updateSettings: async (newSettings) => {
    try {
      const res = await fetch(`${API_URL}/api/settings`, {
        method: 'PUT',
        headers: get().getHeaders(),
        body: JSON.stringify(newSettings)
      });
      const data = await res.json();
      if (res.ok) {
        set({ settings: data });
      }
    } catch (err) {
      console.error('Update settings error:', err);
    }
  },

  // Socket Connection Management
  initSocket: () => {
    const { token, socket } = get();
    if (!token || socket) return;

    const newSocket = io(API_URL);

    newSocket.on('connect', () => {
      set({ socketConnected: true });
      console.log('[Socket] Connected to backend');
    });

    newSocket.on('system_status', (status) => {
      console.log('[Socket] System status event:', status);
    });

    // Real-time Traffic Update ticks
    newSocket.on('traffic_tick', (updatedIntersections) => {
      set({ intersections: updatedIntersections });
      get().calculateMetrics(updatedIntersections);
    });

    // Alert Handlers
    newSocket.on('alert_new', (newAlert) => {
      set(state => {
        // Avoid duplicate alerts in local state array
        if (state.alerts.find(x => x.id === newAlert.id)) return state;
        return { alerts: [newAlert, ...state.alerts] };
      });
    });

    newSocket.on('alert_resolved', (resolvedAlert) => {
      set(state => ({
        alerts: state.alerts.map(item => item.id === resolvedAlert.id ? { ...item, status: 'RESOLVED', resolvedAt: resolvedAlert.resolvedAt } : item)
      }));
    });

    newSocket.on('alerts_refreshed', () => {
      get().fetchAlerts();
    });

    // Intersection manual controls synchronization
    newSocket.on('intersection_updated', (updatedItem) => {
      set(state => {
        const list = state.intersections.map(x => x.id === updatedItem.id ? updatedItem : x);
        get().calculateMetrics(list);
        return { intersections: list };
      });
    });

    // Activity feeds
    newSocket.on('new_activity', (activity) => {
      set(state => ({
        activityLogs: [activity, ...state.activityLogs].slice(0, 30) // Cap at last 30 activities
      }));
    });

    newSocket.on('settings_updated', (newSettings) => {
      set({ settings: newSettings });
    });

    newSocket.on('disconnect', () => {
      set({ socketConnected: false });
      console.log('[Socket] Disconnected from backend');
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, socketConnected: false });
    }
  },

  calculateMetrics: (intersections) => {
    if (!intersections || intersections.length === 0) return;
    
    const activeCount = intersections.length;
    const onlineIntersections = intersections.filter(x => x.status !== 'OFFLINE');
    const operatingSignals = onlineIntersections.length;
    
    const sumCongestion = onlineIntersections.reduce((acc, curr) => acc + curr.congestionLevel, 0);
    const averageCongestion = onlineIntersections.length > 0 ? (sumCongestion / onlineIntersections.length) : 0;
    
    const activeAlertsCount = get().alerts.filter(x => x.status === 'ACTIVE').length;

    set({
      dashboardMetrics: {
        averageCongestion: parseFloat(averageCongestion.toFixed(2)),
        activeAlertsCount,
        operatingSignalsCount: operatingSignals,
        activeIntersectionsCount: activeCount,
      }
    });
  }
}));
