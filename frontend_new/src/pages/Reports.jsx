import React, { useContext, useState } from 'react';
import { ScanContext } from '../context/ScanContext';
import { Search, SlidersHorizontal, Trash2, CheckCircle2, RotateCcw, AlertTriangle, ShieldCheck, HeartPulse, Eye } from 'lucide-react';

export default function Reports() {
  const { scans, deleteScan, toggleScanStatus, healthScore, healthStatus } = useContext(ScanContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const severityBadgeColors = {
    Critical: 'text-rose-400 bg-rose-500/10 border border-rose-500/20',
    High: 'text-orange-400 bg-orange-500/10 border border-orange-500/20',
    Medium: 'text-amber-400 bg-amber-500/10 border border-amber-500/20',
    Low: 'text-sky-400 bg-sky-500/10 border border-sky-500/20',
  };

  // Filter scans
  const filteredScans = scans.filter((scan) => {
    const matchesSearch = 
      scan.damageType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = severityFilter === 'All' || scan.severity === severityFilter;
    const matchesStatus = 
      statusFilter === 'All' || 
      (statusFilter === 'Active' && scan.status === 'Unresolved') ||
      (statusFilter === 'Fixed' && scan.status === 'Resolved');

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div id="reports-page" className="space-y-6 animate-fade-in pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Incident Registry & Reports</h1>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            Review detailed findings logs, filter by classification, and resolve structural defects.
          </p>
        </div>

        {/* Floating Health Score Widget */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-xl">
          <div className="rounded-lg bg-pink-500/10 p-2 border border-pink-500/20">
            <HeartPulse className="h-5 w-5 text-pink-400 animate-pulse" />
          </div>
          <div className="text-left font-sans">
            <p className="text-[10px] text-slate-500">DYNAMIC INDEX</p>
            <p className="text-xs text-white">Health Score: <span className="font-bold font-mono text-emerald-400">{healthScore}</span></p>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar Row */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-12 bg-slate-900/40 border border-slate-900 p-4 rounded-2xl backdrop-blur-md">
        {/* Search */}
        <div className="relative md:col-span-6">
          <Search className="absolute top-2.5 left-3.5 h-4 w-4 text-slate-500" />
          <input
            id="reports-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by category, coordinates or landmarks..."
            className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-4 py-2 text-xs text-slate-200 outline-none focus:border-blue-500 font-sans"
          />
        </div>

        {/* Severity */}
        <div className="relative md:col-span-3">
          <select
            id="severity-filter-select"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-400 outline-none focus:border-blue-500 font-sans appearance-none"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Status */}
        <div className="relative md:col-span-3">
          <select
            id="status-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-400 outline-none focus:border-blue-500 font-sans appearance-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Hazards</option>
            <option value="Fixed">Fixed Areas</option>
          </select>
        </div>
      </div>

      {/* Main Reports Table View */}
      <div className="overflow-hidden rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-md shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-950/60 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 font-semibold">Asset Thumbnail</th>
                <th className="px-6 py-4 font-semibold">Damage Classification</th>
                <th className="px-6 py-4 font-semibold">Zone / Location</th>
                <th className="px-6 py-4 font-semibold">Timestamp</th>
                <th className="px-6 py-4 font-semibold text-center">Confidence</th>
                <th className="px-6 py-4 font-semibold">Severity</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60 bg-slate-900/10">
              {filteredScans.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
                    <p className="text-sm font-medium">No matching logs found</p>
                    <p className="text-xs text-slate-600 mt-1">Adjust query controls or upload custom pavement files.</p>
                  </td>
                </tr>
              ) : (
                filteredScans.map((scan) => {
                  const safeThumb = scan.image || 'https://images.unsplash.com/photo-1594498653385-d5172b532c00?auto=format&fit=crop&q=80&w=400';
                  return (
                    <tr 
                      key={scan.id} 
                      className="group transition-colors hover:bg-slate-950/30"
                    >
                      {/* Image Thumbnail */}
                      <td className="whitespace-nowrap px-6 py-4 font-medium">
                        <div className="h-10 w-14 shrink-0 rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                          <img 
                            src={safeThumb} 
                            alt={scan.damageType} 
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                      </td>

                      {/* Damage Classification */}
                      <td className="whitespace-nowrap px-6 py-4 font-semibold text-white">
                        {scan.damageType}
                      </td>

                      {/* Zone / Location */}
                      <td className="px-6 py-4 max-w-[200px]">
                        <div className="flex flex-col text-left">
                          <span className="text-slate-200 truncate font-sans font-medium" title={scan.locationName}>
                            {scan.locationName}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 mt-0.5">
                            Lat: {parseFloat(scan.lat).toFixed(4)}, Lng: {parseFloat(scan.lng).toFixed(4)}
                          </span>
                        </div>
                      </td>

                      {/* Timestamp */}
                      <td className="whitespace-nowrap px-6 py-4 text-slate-400 font-sans">
                        {scan.timestamp}
                      </td>

                      {/* Confidence */}
                      <td className="whitespace-nowrap px-6 py-4 text-center font-mono font-bold text-white text-sm">
                        {(scan.confidence * 100).toFixed(0)}%
                      </td>

                      {/* Severity */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${severityBadgeColors[scan.severity] || severityBadgeColors.Low}`}>
                          {scan.severity}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-6 py-4">
                        {scan.status === 'Resolved' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 font-mono">
                            <ShieldCheck className="h-3.5 w-3.5" /> RESOLVED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-rose-400 font-mono animate-pulse">
                            <AlertTriangle className="h-3.5 w-3.5" /> ACTIVE
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            id={`report-resolve-${scan.id}`}
                            onClick={() => toggleScanStatus(scan.id)}
                            className={`rounded-lg px-2.5 py-1.5 font-mono text-[10px] font-bold tracking-tight border transition-colors cursor-pointer ${
                              scan.status === 'Resolved'
                                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                            }`}
                          >
                            {scan.status === 'Resolved' ? 'REOPEN' : 'RESOLVE'}
                          </button>

                          <button
                            id={`report-delete-${scan.id}`}
                            onClick={() => deleteScan(scan.id)}
                            className="rounded-lg p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete scan"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
