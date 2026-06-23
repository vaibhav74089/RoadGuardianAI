import React, { useContext } from 'react';
import { ScanContext } from '../context/ScanContext';
import { ShieldCheck, RefreshCw, Radio, HardDrive, Cpu } from 'lucide-react';

export default function Navbar({ onReset }) {
  const { healthScore, healthStatus } = useContext(ScanContext);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-900 bg-slate-950/80 px-6 backdrop-blur-md">
      {/* Brand Title for Mobile (since sidebar will fold or on top) */}
      <div className="flex items-center gap-3 md:hidden">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-sky-400 p-1.5 shadow-lg shadow-blue-500/10">
          <ShieldCheck className="h-full w-full text-slate-950 stroke-[2.5]" />
        </div>
        <span className="font-sans text-lg font-bold tracking-tight text-white bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
          RoadGuardian AI
        </span>
      </div>

      <div className="hidden md:flex items-center gap-6">
        {/* Status indicator pill */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs text-slate-400 font-sans">
          <Cpu className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
          <span>YOLOv8-p6 Model</span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs text-slate-400 font-sans">
          <HardDrive className="h-3.5 w-3.5 text-emerald-400" />
          <span>Local Storage Enabled</span>
        </div>
      </div>

      {/* Control Right Bar */}
      <div className="flex items-center gap-4">
        {/* Live health state badge */}
        <div className="flex items-center gap-2 items-center bg-slate-900/60 border border-slate-800 rounded-lg p-1.5 px-3">
          <span className="text-xs text-slate-400 font-medium">Road Health:</span>
          <span className={`text-xs px-2 py-0.5 rounded font-bold border ${healthStatus.color}`}>
            {healthScore}% - {healthStatus.label}
          </span>
        </div>

        {/* Restore seed defaults button */}
        <button
          onClick={onReset}
          className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all cursor-pointer"
          title="Reset to default mock scans"
        >
          <RefreshCw className="h-4 w-4" />
        </button>

        {/* User email badge */}
        <div className="hidden sm:flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5">
          <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-xs text-slate-300 font-mono">rk1521457@gmail.com</span>
        </div>
      </div>
    </header>
  );
}
