import React, { useContext } from 'react';
import { ScanContext } from '../context/ScanContext';
import { MapPin, Calendar, Percent, ShieldCheck, ShieldAlert, Trash2, CheckCircle2, RotateCcw } from 'lucide-react';

export default function ScanCard({ id = 'scan-card', scan }) {
  const { toggleScanStatus, deleteScan } = useContext(ScanContext);

  if (!scan) return null;

  const severityColors = {
    Critical: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    High: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Low: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  };

  const getStatusBadge = (status) => {
    if (status === 'Resolved') {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" /> Fixed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-xs font-medium text-rose-400 animate-pulse">
        <ShieldAlert className="h-3.5 w-3.5" /> Active
      </span>
    );
  };

  // Safe fallback road image in case provided URL fails
  const safeImage = scan.image || 'https://images.unsplash.com/photo-1594498653385-d5172b532c00?auto=format&fit=crop&q=80&w=400';

  return (
    <div 
      id={id}
      className={`group overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md transition-all duration-300 hover:border-slate-700 hover:translate-y-[-2px] shadow-lg`}
    >
      <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
        <img 
          src={safeImage} 
          alt={scan.damageType} 
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold ${severityColors[scan.severity] || severityColors.Low}`}>
            {scan.severity}
          </span>
          {getStatusBadge(scan.status)}
        </div>
        <div className="absolute bottom-2 right-2 rounded bg-slate-950/80 px-2 py-0.5 text-xs font-mono text-slate-300 backdrop-blur-sm border border-slate-800">
          {(scan.confidence * 100).toFixed(0)}% Confidence
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-white tracking-tight group-hover:text-blue-400 transition-colors">
              {scan.damageType}
            </h3>
            <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-sky-400 shrink-0" />
              <span className="truncate max-w-[200px]" title={scan.locationName}>
                {scan.locationName}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              <span>{scan.timestamp}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-800 pt-4">
          <button
            id={`resolve-btn-${scan.id}`}
            onClick={() => toggleScanStatus(scan.id)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
              scan.status === 'Resolved'
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/45'
            }`}
          >
            {scan.status === 'Resolved' ? (
              <>
                <RotateCcw className="h-3.5 w-3.5" /> Reopen
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" /> Resolve
              </>
            )}
          </button>

          <button
            id={`delete-btn-${scan.id}`}
            onClick={() => deleteScan(scan.id)}
            className="rounded-lg p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Delete Scan Record"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
