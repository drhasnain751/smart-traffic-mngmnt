import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useTrafficStore } from './store/useTrafficStore';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PageTransition from './components/PageTransition';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Intersections from './pages/Intersections';
import LiveMonitoring from './pages/LiveMonitoring';
import CityMap from './pages/CityMap';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';

// Layout for Public Pages (Home, About, Contact)
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col pt-24">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <div className="noise-overlay" />
    </div>
  );
}

// Layout for Auth Pages (Login, Signup - No Navbar needed or custom Navbar)
function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <div className="noise-overlay" />
    </div>
  );
}

// Layout for Internal Dashboard Panel (Sidebar + Navbar + Content Panel)
function DashboardLayout() {
  const { token } = useTrafficStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 flex-1 flex gap-8">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 bg-background overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <div className="noise-overlay" />
    </div>
  );
}

export default function App() {
  const { token, initSocket, disconnectSocket, fetchIntersections, fetchAlerts, fetchSettings } = useTrafficStore();

  useEffect(() => {
    if (token) {
      initSocket();
      fetchIntersections();
      fetchAlerts();
      fetchSettings();
    }
    return () => {
      disconnectSocket();
    };
  }, [token]);

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          </Route>

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
          </Route>

          {/* Protected Operator/Admin Control Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
            <Route path="/intersections" element={<PageTransition><Intersections /></PageTransition>} />
            <Route path="/monitoring" element={<PageTransition><LiveMonitoring /></PageTransition>} />
            <Route path="/map" element={<PageTransition><CityMap /></PageTransition>} />
            <Route path="/reports" element={<PageTransition><Reports /></PageTransition>} />
            <Route path="/analytics" element={<PageTransition><Analytics /></PageTransition>} />
            <Route path="/alerts" element={<PageTransition><Alerts /></PageTransition>} />
            <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}
