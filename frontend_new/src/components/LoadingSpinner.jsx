import React from 'react';

export default function LoadingSpinner({ message = 'AI is processing the road damage scans...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="relative flex items-center justify-center overflow-visible">
        {/* Radar concentric expanding rings */}
        <div className="absolute h-24 w-24 rounded-full border border-blue-500/10 animate-ping" />
        <div className="absolute h-36 w-36 rounded-full border border-emerald-500/5 animate-ping [animation-delay:0.3s]" />
        
        {/* Custom futuristic glowing scanning disk */}
        <div className="relative h-16 w-16 rounded-full border-2 border-slate-700 bg-slate-900 flex items-center justify-center shadow-2xl">
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-blue-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border border-slate-800 bg-gradient-to-tr from-slate-950 to-slate-800 flex items-center justify-center">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
        </div>
      </div>
      
      <p className="mt-6 text-sm font-medium text-slate-300 font-sans tracking-wide">
        {message}
      </p>
      <p className="mt-1.5 text-xs text-slate-500 font-mono">
        Configuring model weights • Executing YOLOv8 tensor layers...
      </p>
    </div>
  );
}
