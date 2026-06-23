import React, { useContext } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LiveDetection from './pages/LiveDetection';
import MapPage from './pages/MapPage';
import Reports from './pages/Reports';
import { ScanProvider, ScanContext } from './context/ScanContext';

function AppContent() {
  const { clearScans } = useContext(ScanContext);

  return (
    <div id="roadguardian-app" className="flex h-screen w-full overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Structural Sidebar Navigation */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar onReset={clearScans} />

        {/* Content viewport area */}
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-8 pb-20 md:pb-8">
          <div className="mx-auto w-full max-w-7xl">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/detect" element={<LiveDetection />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ScanProvider>
      <Router>
        <AppContent />
      </Router>
    </ScanProvider>
  );
}
