import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function StatsCard({ 
  id = 'stats-card',
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendDirection = 'none', 
  color = 'blue', 
  description 
}) {
  const colorMap = {
    blue: 'from-blue-600/20 to-blue-500/5 hover:border-blue-500/30 text-blue-400 border-blue-500/10',
    rose: 'from-rose-600/20 to-rose-500/5 hover:border-rose-500/30 text-rose-400 border-rose-500/10',
    amber: 'from-amber-600/20 to-amber-500/5 hover:border-amber-500/30 text-amber-400 border-amber-500/10',
    emerald: 'from-emerald-600/20 to-emerald-500/5 hover:border-emerald-500/30 text-emerald-400 border-emerald-500/10',
    purple: 'from-purple-600/20 to-purple-500/5 hover:border-purple-500/30 text-purple-400 border-purple-500/10',
    cyan: 'from-cyan-600/20 to-cyan-500/5 hover:border-cyan-500/30 text-cyan-400 border-cyan-500/10',
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <div 
      id={id}
      className={`relative overflow-hidden rounded-xl border bg-gradient-to-br p-6 transition-all duration-300 shadow-xl ${selectedColor}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-400">{title}</span>
        {Icon && (
          <div className="rounded-lg bg-slate-900/80 p-2 border border-slate-800 shadow-inner">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-white font-sans">{value}</span>
        {trend && (
          <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${
            trendDirection === 'up' 
              ? 'bg-rose-500/10 text-rose-400' 
              : trendDirection === 'down' 
              ? 'bg-emerald-500/10 text-emerald-400' 
              : 'bg-slate-500/10 text-slate-400'
          }`}>
            {trendDirection === 'up' && <ArrowUp className="h-3 w-3" />}
            {trendDirection === 'down' && <ArrowDown className="h-3 w-3" />}
            {trend}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-2 text-xs text-slate-500 font-sans leading-relaxed">{description}</p>
      )}
      
      {/* Decorative background grid element */}
      <div className="absolute -right-6 -bottom-6 h-12 w-12 rounded-full bg-current opacity-[0.02] filter blur-xl" />
    </div>
  );
}
