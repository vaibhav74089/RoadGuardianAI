import React, { createContext, useState, useEffect } from 'react';

export const ScanContext = createContext();
const initialScans = [];

// Initial seed data around Lucknow, India
// const initialScans = [
//   {
//     id: 'scan-1',
//     timestamp: '2026-06-20 09:15 AM',
//     locationName: 'Hazratganj Crossing, Lucknow',
//     lat: 26.8490,
//     lng: 80.9410,
//     damageType: 'Alligator Crack',
//     confidence: 0.85,
//     severity: 'Critical',
//     status: 'Unresolved',
//     image: 'https://images.unsplash.com/photo-1621259182978-f09e5aa67a3f?auto=format&fit=crop&q=80&w=400',
//   },
//   {
//     id: 'scan-2',
//     timestamp: '2026-06-20 11:45 AM',
//     locationName: 'Gomti Nagar bypass, Lucknow',
//     lat: 26.8320,
//     lng: 80.9580,
//     damageType: 'Pothole',
//     confidence: 0.92,
//     severity: 'Critical',
//     status: 'Unresolved',
//     image: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=400',
//   },
//   {
//     id: 'scan-3',
//     timestamp: '2026-06-19 04:30 PM',
//     locationName: 'Aliganj Sector Q, Lucknow',
//     lat: 26.8580,
//     lng: 80.9250,
//     damageType: 'Longitudinal Crack',
//     confidence: 0.58,
//     severity: 'Medium',
//     status: 'Resolved',
//     image: 'https://images.unsplash.com/photo-1594498653385-d5172b532c00?auto=format&fit=crop&q=80&w=400',
//   },
//   {
//     id: 'scan-4',
//     timestamp: '2026-06-18 10:20 AM',
//     locationName: 'Munshipulia Metro Stn, Lucknow',
//     lat: 26.8710,
//     lng: 80.9620,
//     damageType: 'Transverse Crack',
//     confidence: 0.71,
//     severity: 'High',
//     status: 'Unresolved',
//     image: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&q=80&w=400',
//   },
//   {
//     id: 'scan-5',
//     timestamp: '2026-06-18 02:10 PM',
//     locationName: 'Charbagh Station Rd, Lucknow',
//     lat: 26.8250,
//     lng: 80.9150,
//     damageType: 'Pothole',
//     confidence: 0.78,
//     severity: 'High',
//     status: 'Unresolved',
//     image: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=400',
//   }
// ];

export const ScanProvider = ({ children }) => {
  const [scans, setScans] = useState(() => {
    const saved = localStorage.getItem('roadguardian_scans');
    return saved ? JSON.parse(saved) : initialScans;
  });

  useEffect(() => {
    localStorage.setItem('roadguardian_scans', JSON.stringify(scans));
  }, [scans]);

  const addScan = (newScan) => {
  console.log("Context Received:", newScan);

  setScans((prev) => {
    const updated = [newScan, ...prev];

    console.log("Updated Scans:", updated);

    return updated;
  });
};

  const deleteScan = (id) => {
    setScans((prev) => prev.filter((scan) => scan.id !== id));
  };

  const toggleScanStatus = (id) => {
    setScans((prev) =>
      prev.map((scan) =>
        scan.id === id
          ? { ...scan, status: scan.status === 'Resolved' ? 'Unresolved' : 'Resolved' }
          : scan
      )
    );
  };

  const clearScans = () => {
    setScans(initialScans);
  };

  // Helper mapping for class codes
  const classIdToName = {
    0: 'Longitudinal Crack',
    1: 'Transverse Crack',
    2: 'Alligator Crack',
    3: 'Pothole',
  };

  // Severity Logic
  // confidence > 0.8 => Critical
  // confidence > 0.6 => High
  // confidence > 0.4 => Medium
  // otherwise Low
  const getSeverity = (confidence) => {
    if (confidence > 0.8) return 'Critical';
    if (confidence > 0.6) return 'High';
    if (confidence > 0.4) return 'Medium';
    return 'Low';
  };

  // Active / unresolved detection count
  const activeDetectionsCount = scans.filter(s => s.status === 'Unresolved').length;

  // Health Score Logic: healthScore = 100 - (detectionsCount * 15)
  const healthScore = Math.max(0, 100 - (activeDetectionsCount * 15));

  // Rating scale status text and colors
  // 90+ Excellent
  // 75+ Good
  // 50+ Fair
  // 25+ Poor
  // Below 25 Critical
  const getHealthStatus = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    if (score >= 75) return { label: 'Good', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' };
    if (score >= 50) return { label: 'Fair', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' };
    if (score >= 25) return { label: 'Poor', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };
    return { label: 'Critical', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
  };

  const healthStatus = getHealthStatus(healthScore);

  return (
    <ScanContext.Provider
      value={{
        scans,
        addScan,
        deleteScan,
        toggleScanStatus,
        clearScans,
        activeDetectionsCount,
        healthScore,
        healthStatus,
        classIdToName,
        getSeverity,
        getHealthStatus,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
};
