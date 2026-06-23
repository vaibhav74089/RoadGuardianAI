import React, { useContext, useState } from 'react';
import { ScanContext } from '../context/ScanContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Calendar, Percent, ShieldAlert, CheckCircle2, Navigation2, Info } from 'lucide-react';
import ScanCard from '../components/ScanCard';

export default function MapPage() {
  const { scans } = useContext(ScanContext);
  const [selectedScan, setSelectedScan] = useState(null);

  const LUCKNOW_COORDS = [26.8467, 80.9462];

  // Helper to create stunning glowing custom markers matching severity
  const createCustomIcon = (severity) => {
    const colorMap = {
      Critical: '#f43f5e', // Rose
      High: '#fb923c',    // Orange
      Medium: '#f59e0b',  // Amber
      Low: '#38bdf8',     // Sky
    };
    const color = colorMap[severity] || '#38bdf8';
    return L.divIcon({
      html: `
        <div class="relative flex items-center justify-center">
          <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full opacity-60" style="background-color: ${color}40"></span>
          <div class="h-4.5 w-4.5 rounded-full border-2 border-slate-950 shadow-lg" style="background-color: ${color}"></div>
        </div>
      `,
      className: 'custom-div-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  // Severity labels for custom markers legend
  const legendItems = [
    { label: 'Critical Severity', color: '#f43f5e' },
    { label: 'High Severity', color: '#fb923c' },
    { label: 'Medium Severity', color: '#f59e0b' },
    { label: 'Low Severity', color: '#38bdf8' },
  ];

  return (
    <div id="map-page" className="space-y-6 animate-fade-in pb-12">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Geographic Hazard plotting
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            Real-time pothole and pavement fatigue layout mapped in Lucknow metropolitan regions.
          </p>
        </div>

        {/* Legend Panel */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs">
          {legendItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border border-slate-950" style={{ backgroundColor: item.color }} />
              <span className="text-slate-300 font-medium font-sans">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Leaflet Map Stage */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-900 bg-slate-950 overflow-hidden shadow-2xl h-[550px] relative">
          <MapContainer 
            center={LUCKNOW_COORDS} 
            zoom={13} 
            style={{ height: '100%', width: '100%', zIndex: 1 }}
          >
            {/* Elegant dark map tiles from CartoDB */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Render pins for all scans in context */}
            {scans.map((scan) => {
              const lat = parseFloat(scan.lat) || 26.8467;
              const lng = parseFloat(scan.lng) || 80.9462;
              
              return (
                <Marker
                  key={scan.id}
                  position={[lat, lng]}
                  icon={createCustomIcon(scan.severity)}
                  eventHandlers={{
                    click: () => {
                      setSelectedScan(scan);
                    },
                  }}
                >
                  <Popup className="custom-popup">
                    <div className="text-slate-950 p-1 space-y-1 my-0.5">
                      <p className="font-extrabold text-sm tracking-tight">{scan.damageType}</p>
                      <p className="text-xs text-slate-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3 inline shrink-0" /> {scan.locationName}
                      </p>
                      <p className="text-[10px] text-slate-500">{scan.timestamp}</p>
                      <button 
                        onClick={() => setSelectedScan(scan)}
                        className="mt-1 text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        Inspect Findings &rarr;
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Quick navigation to main Lucknow cluster overlay */}
          <div className="absolute bottom-5 left-5 z-[500] rounded-xl bg-slate-900/90 border border-slate-800 p-2.5 backdrop-blur-sm shadow-xl flex items-center gap-2">
            <Navigation2 className="h-4 w-4 text-blue-400 rotate-45 shrink-0" />
            <div className="text-[10px] font-mono text-slate-300">
              <p className="font-semibold text-white">Lucknow Center</p>
              <p className="text-slate-400">26.8467° N, 80.9462° E</p>
            </div>
          </div>
        </div>

        {/* Selected Scan Details / Sidebar Panel */}
        <div className="lg:col-span-4 flex flex-col">
          {selectedScan ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Selected Hazard</h2>
                <button 
                  onClick={() => setSelectedScan(null)}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  Clear Selection
                </button>
              </div>
              <ScanCard scan={selectedScan} />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-900 bg-slate-900/10 p-12 text-center text-slate-500 h-full flex flex-col items-center justify-center min-h-[300px]">
              <MapPin className="h-8 w-8 text-slate-700 mb-2 animate-bounce" />
              <h3 className="text-xs font-semibold text-slate-400">Interact with the map</h3>
              <p className="text-[11px] mt-2 text-slate-500 max-w-[200px] leading-relaxed mx-auto font-sans">
                Click on any of the pulsing points or use the map popups to display the corresponding detection card.
              </p>
              <div className="mt-6 flex items-center gap-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-900 text-[10px] text-slate-500 text-left">
                <Info className="h-3 w-3 text-sky-400 shrink-0" />
                <span>Default center is initialized near Gomti zone.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
