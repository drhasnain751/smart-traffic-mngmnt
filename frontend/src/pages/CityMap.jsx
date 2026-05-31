import React, { useEffect, useState } from 'react';
import { useTrafficStore } from '../store/useTrafficStore';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Sliders, Navigation, RotateCcw, AlertTriangle, Zap, CheckCircle, Radio
} from 'lucide-react';

// Custom component to handle centering / map pan controls
function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 15, { animate: true, duration: 1.0 });
    }
  }, [center, map]);
  return null;
}

export default function CityMap() {
  const { intersections, triggerEmergencyOverride, resetToAuto } = useTrafficStore();
  const [mapCenter, setMapCenter] = useState([29.3955, 71.7245]); // Bahawalpur, Punjab, Pakistan centre
  const [selectedIntersection, setSelectedIntersection] = useState(null);

  // Custom pulsing Leaflet marker icons based on density
  const createPulsingIcon = (status, congestionLevel) => {
    let pulseClass = 'pulsing-green';
    let colorClass = 'bg-traffic-green';
    
    if (status === 'OFFLINE') {
      pulseClass = '';
      colorClass = 'bg-zinc-500';
    } else if (congestionLevel > 0.75) {
      pulseClass = 'pulsing-red';
      colorClass = 'bg-traffic-red';
    } else if (congestionLevel > 0.4) {
      pulseClass = 'pulsing-yellow';
      colorClass = 'bg-traffic-yellow';
    }

    return L.divIcon({
      html: `<div class="relative flex items-center justify-center h-5 w-5 rounded-full ${colorClass} ${pulseClass} border-2 border-white/20"></div>`,
      className: 'custom-pulsing-icon-container',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10],
    });
  };

  const focusOnIntersection = (item) => {
    setSelectedIntersection(item);
    setMapCenter([item.latitude, item.longitude]);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-140px)]">
      
      {/* Sidebar List (Left 1/3) */}
      <div className="lg:w-80 flex flex-col bg-panel border border-border rounded-2xl overflow-hidden shadow-premium">
        <div className="p-4 border-b border-border bg-surface/30">
          <div className="flex items-center space-x-2">
            <Radio className="h-4.5 w-4.5 text-brand-blue animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted font-mono">
              Live Map Hotspots
            </span>
          </div>
          <p className="text-[11px] text-primary-muted mt-1 leading-normal">
            Select node coordinate to focus transit lens.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border/60 max-h-[300px] lg:max-h-[500px]">
          {intersections.map(item => {
            const signal = item.Signals[0];
            const isOffline = item.status === 'OFFLINE';

            return (
              <div 
                key={item.id}
                onClick={() => focusOnIntersection(item)}
                className={`p-4 transition-colors hover:bg-surface/20 cursor-pointer flex justify-between items-start ${
                  selectedIntersection?.id === item.id ? 'bg-surface/50 border-l-2 border-brand-blue' : ''
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold truncate text-primary">{item.name}</span>
                  <span className="text-[10px] text-primary-muted font-mono mt-0.5">
                    Congestion: {(item.congestionLevel * 100).toFixed(0)}% // Queue: {item.vehicleCount}
                  </span>
                </div>

                <div className="flex items-center space-x-2 ml-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${
                    isOffline ? 'bg-zinc-500' :
                    item.congestionLevel > 0.75 ? 'bg-traffic-red' :
                    item.congestionLevel > 0.4 ? 'bg-traffic-yellow' :
                    'bg-traffic-green'
                  }`} />
                  <span className="text-[9px] uppercase font-mono bg-zinc-900 border border-border px-1.5 py-0.5 rounded text-primary-muted">
                    {signal?.activeState || 'OFF'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaflet Map Canvas (Right 2/3) */}
      <div className="flex-1 min-h-[400px] lg:min-h-0 bg-panel border border-border rounded-2xl overflow-hidden relative shadow-premium">
        
        <MapContainer
          center={mapCenter}
          zoom={14}
          zoomControl={true}
          style={{ height: '100%', width: '100%' }}
        >
          {/* Custom Map Theme filter from CartoDB Dark Matter */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          <MapController center={mapCenter} />

          {intersections.map(item => {
            const signal = item.Signals[0];
            const lightColor = signal?.activeState;

            return (
              <Marker
                key={item.id}
                position={[item.latitude, item.longitude]}
                icon={createPulsingIcon(item.status, item.congestionLevel)}
              >
                <Popup>
                  <div className="w-56 p-1 text-xs space-y-3 font-sans">
                    <div className="flex items-center justify-between border-b border-border/80 pb-1.5">
                      <span className="font-bold text-primary text-sm truncate">{item.name}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        item.status === 'ACTIVE' ? 'bg-green-950/40 text-green-400 border border-green-900/50' :
                        item.status === 'OVERRIDE' ? 'bg-blue-950/40 text-brand-blue border border-brand-blue/50' :
                        'bg-zinc-900 text-primary-muted border border-border'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-primary-muted">
                      <div>
                        <span>Queue count</span>
                        <span className="block font-bold text-primary">{item.vehicleCount} vehicles</span>
                      </div>
                      <div>
                        <span>Density index</span>
                        <span className="block font-bold text-brand-blue">{(item.congestionLevel * 100).toFixed(0)}%</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 bg-zinc-950/50 border border-border/60 p-2 rounded-lg">
                      <div className={`h-2.5 w-2.5 rounded-full ${
                        lightColor === 'GREEN' ? 'bg-traffic-green' :
                        lightColor === 'YELLOW' ? 'bg-traffic-yellow' :
                        'bg-traffic-red'
                      }`} />
                      <span className="font-mono text-[10px] font-bold text-primary-muted">
                        Light Timer: {signal ? `${signal.timerSeconds}s remaining` : '--'}
                      </span>
                    </div>

                    {/* Operational controls directly in Popup */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40">
                      <button
                        onClick={() => triggerEmergencyOverride(item.id)}
                        className="bg-brand-blue text-background text-[9px] font-bold py-1.5 rounded transition-colors text-center"
                      >
                        Override Wave
                      </button>
                      <button
                        onClick={() => resetToAuto(item.id)}
                        className="bg-surface hover:bg-zinc-800 border border-border text-[9px] font-bold py-1.5 rounded transition-colors text-center text-primary"
                      >
                        Restore Auto
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

      </div>

    </div>
  );
}
