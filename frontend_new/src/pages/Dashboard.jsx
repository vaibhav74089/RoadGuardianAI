import React, { useContext } from 'react';
import { ScanContext } from '../context/ScanContext';
import StatsCard from '../components/StatsCard';
import ScanCard from '../components/ScanCard';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend } from 'recharts';
import { Eye, ShieldAlert, FileDigit, HeartPulse, Sparkles, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { scans, healthScore, healthStatus } = useContext(ScanContext);

  // Derive stats
  const totalScansArray = scans || [];
  const totalScans = totalScansArray.length;
  
  // Total Potholes
  const totalPotholes = totalScansArray.filter(s => s.damageType === 'Pothole').length;
  
  // Total Cracks
  const totalCracks = totalScansArray.filter(s => s.damageType !== 'Pothole').length;
  
  // Critical Defects
  const criticalDefects = totalScansArray.filter(s => s.severity === 'Critical' && s.status === 'Unresolved').length;

  // Recent scans (limit 3)
  const recentScans = totalScansArray.slice(0, 3);

  // Generate chart data for damage distribution
  const damageDistribution = [
    { name: 'Longitudinal', count: totalScansArray.filter(s => s.damageType === 'Longitudinal Crack').length, color: '#f59e0b' },
    { name: 'Transverse', count: totalScansArray.filter(s => s.damageType === 'Transverse Crack').length, color: '#fb923c' },
    { name: 'Alligator', count: totalScansArray.filter(s => s.damageType === 'Alligator Crack').length, color: '#22d3ee' },
    { name: 'Pothole', count: totalPotholes, color: '#f43f5e' },
  ];

  // Defect detection trend over the last 5 days
  const detectionTrendData = [
    { date: 'Jun 17', Cracks: 2, Potholes: 1 },
    { date: 'Jun 18', Cracks: 3, Potholes: 2 },
    { date: 'Jun 19', Cracks: 4, Potholes: 1 },
    { date: 'Jun 20', Cracks: 5, Potholes: 3 },
    { date: 'Jun 21', Cracks: totalCracks, Potholes: totalPotholes },
  ];

  return (
    <div id="dashboard-page" className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-blue-900/30 via-slate-900 to-slate-900 border border-blue-500/10 p-6 shadow-2xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Infrastructure Workspace <Sparkles className="h-5 w-5 text-blue-400" />
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            AI-powered Lucknow road audit. Scan video feeds or static images using the high-accuracy YOLOv8 model.
          </p>
        </div>
        <Link
          to="/detect"
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-lg shadow-blue-500/10 transition-all text-center"
        >
          Initiate New Live Scan
        </Link>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          id="stat-total-scans"
          title="Total Audited Scans"
          value={totalScans}
          icon={FileDigit}
          trend="+18% growth"
          trendDirection="up"
          color="blue"
          description="Total computed image frames analyzed."
        />
        <StatsCard
          id="stat-potholes"
          title="Potholes Detected"
          value={totalPotholes}
          icon={Eye}
          trend={`${totalPotholes > 0 ? 'Urgent care' : 'Clear'}`}
          trendDirection={`${totalPotholes > 0 ? 'up' : 'none'}`}
          color="rose"
          description="Pothole count in hazardous sections."
        />
        <StatsCard
          id="stat-cracks"
          title="Total Cracks Found"
          value={totalCracks}
          icon={Activity}
          trend="Structural deterioration"
          color="amber"
          description="Longitudinal, Transverse, and Alligator cracks."
        />
        <StatsCard
          id="stat-critical"
          title="Critical Unresolved"
          value={criticalDefects}
          icon={ShieldAlert}
          trend={criticalDefects > 0 ? 'Immediate Action' : 'Safe State'}
          trendDirection={criticalDefects > 0 ? 'up' : 'none'}
          color="rose"
          description="Critical risk unresolved instances."
        />
        <StatsCard
          id="stat-health"
          title="Avg Health Score"
          value={`${healthScore}%`}
          icon={HeartPulse}
          trend={healthStatus.label}
          trendDirection={healthScore > 50 ? 'down' : 'up'}
          color="emerald"
          description="Standard dynamic road structural quotient."
        />
      </div>

      {/* Charts Panel */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Detection Trend */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-900 bg-slate-900/30 p-6 flex flex-col backdrop-blur-md shadow-xl justify-between">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">AI Audit Trend (Last 5 Days)</h2>
            <p className="text-xs text-slate-500 mt-1 font-sans">Accumulated hazardous points identified across scanning epochs.</p>
          </div>
          
          <div className="h-64 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={detectionTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCracks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPotholes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Area type="monotone" dataKey="Cracks" stroke="#f59e0b" fillOpacity={1} fill="url(#colorCracks)" strokeWidth={2} />
                <Area type="monotone" dataKey="Potholes" stroke="#f43f5e" fillOpacity={1} fill="url(#colorPotholes)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Damage Type Distribution */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-6 flex flex-col backdrop-blur-md shadow-xl">
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">Damage Classification</h2>
            <p className="text-xs text-slate-500 mt-1 font-sans">Incidents parsed globally by damage type categories.</p>
          </div>

          <div className="mt-6 flex-1 flex flex-col justify-center h-64 lg:h-auto">
            {totalScans === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <p className="text-sm">No scans to display distribution</p>
              </div>
            ) : (
              <>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={damageDistribution} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {damageDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {damageDistribution.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 rounded bg-slate-950/40 border border-slate-900 p-2">
                      <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <div className="text-left">
                        <p className="text-[10px] text-slate-400 font-medium truncate">{item.name}</p>
                        <p className="text-xs font-bold text-white font-mono">{item.count}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Scans */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Scan Feeds</h2>
            <p className="text-xs text-slate-400 mt-0.5">Most recent image parsing updates uploaded for model inspection.</p>
          </div>
          <Link
            to="/reports"
            className="text-xs text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors cursor-pointer"
          >
            View Full Report Registry →
          </Link>
        </div>

        {recentScans.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-400 bg-slate-900/10">
            <p className="text-sm">No scans processed yet</p>
            <p className="text-xs text-slate-500 mt-1">Upload on Live Detection page to populate indices.</p>
          </div>
        ) : (
          <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
            {recentScans.map((scan) => (
              <ScanCard key={scan.id} scan={scan} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
