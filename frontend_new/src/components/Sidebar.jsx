import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Flame, Map, ClipboardList, ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
      desc: 'Analytical overview'
    },
    {
      name: 'Live Detection',
      path: '/detect',
      icon: Flame,
      desc: 'YOLOv8 image scan'
    },
    {
      name: 'Map View',
      path: '/map',
      icon: Map,
      desc: 'Lucknow hazard plotting'
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: ClipboardList,
      desc: 'Scan logs & resolution'
    }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-900 bg-slate-950 shrink-0 select-none">
        {/* Brand Container */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-900 bg-slate-950">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 top-slate-900 p-2 shadow-lg shadow-blue-500/10 border border-blue-500/20">
            <ShieldCheck className="h-full w-full text-blue-400 stroke-[2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-sm font-bold tracking-tight text-white">
              RoadGuardian
            </span>
            <span className="text-[10px] text-blue-400 font-mono tracking-wider font-bold uppercase">
              AI MONITOR
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600/15 border border-blue-500/20 text-white shadow-gradient shadow-blue-500/5'
                    : 'text-slate-400 border border-transparent hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <item.icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'
                }`} />
                <div className="flex flex-col text-left">
                  <span>{item.name}</span>
                  <span className={`text-[10px] font-normal transition-colors ${
                    isActive ? 'text-blue-400/80' : 'text-slate-500 group-hover:text-slate-400'
                  }`}>
                    {item.desc}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Brand Footer */}
        <div className="p-4 border-t border-slate-900">
          <div className="flex items-center gap-3 rounded-lg bg-slate-900/40 border border-slate-800 p-3">
            <div className="rounded bg-sky-500/10 p-1.5">
              <AlertTriangle className="h-4 w-4 text-sky-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-300">YOLOv8 Weights</p>
              <p className="text-[10px] font-mono text-slate-500">v8.0.24-road_india</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sticky Navigation Bar (Bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-slate-950/95 backdrop-blur-md border-t border-slate-900 flex items-center justify-around px-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                isActive ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium mt-1 font-sans">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
