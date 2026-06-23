import React, { useState, useContext, useRef } from 'react';
import { ScanContext } from '../context/ScanContext';
import { predictRoadDamage } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Upload, Image as ImageIcon, MapPin, Eye, ChevronRight, CheckCircle2, AlertTriangle, AlertOctagon, Info } from 'lucide-react';

export default function LiveDetection() {
  const { addScan, classIdToName, getSeverity } = useContext(ScanContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Form controls for plotting the live scan onto the Map Page
  const [locationName, setLocationName] = useState('Lucknow Sector-B Crossing');
  const [customLat, setCustomLat] = useState('26.8485');
  const [customLng, setCustomLng] = useState('80.9424');

  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setupImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setupImage(e.target.files[0]);
    }
  };

  const setupImage = (file) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    // Reset previous scan output
    setScanResult(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const runPrediction = async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setScanResult(null);

    try {
      const response = await predictRoadDamage(selectedImage);
      
      if (response.success && response.data && response.data.length > 0) {
        // Parse predictions matching class mapping:
        // 0 = Longitudinal Crack, 1 = Transverse Crack, 2 = Alligator Crack, 3 = Pothole
        const detections = response.data.map((det) => {
  const damageType = det.damage_type;
  const confidence = det.confidence || 0;

  return {
    damageType,
    confidence,
    severity: getSeverity(confidence),
  };
});

        // Use first main parsed detection for display summary
        const mainDet = detections[0];

        // Store this new scan into our shared ScansContext
        const newScanRecord = {
          id: `scan-${Date.now()}`,
          timestamp: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
          locationName: locationName || 'Lucknow Municipal Road',
          lat: parseFloat(customLat) || 26.8467,
          lng: parseFloat(customLng) || 80.9462,
          damageType: mainDet.damageType,
          confidence: mainDet.confidence,
          severity: mainDet.severity,
          status: 'Unresolved',
          image: imagePreview, // Save preview string data for visualization
        };

        addScan(newScanRecord);

        setScanResult({
          mainDetection: mainDet,
          allDetections: detections,
          isFallback: response.isFallback,
        });
      } else {
        // Handle no damage detected or layout empty array
        setScanResult({
          noDamage: true,
          isFallback: response.isFallback,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const getSeverityBadge = (severity) => {
    const badgeColors = {
      Critical: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      High: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      Low: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    };
    return (
      <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-semibold ${badgeColors[severity] || badgeColors.Low}`}>
        {severity} Flags
      </span>
    );
  };

  const getSeverityIcon = (severity) => {
    if (severity === 'Critical') return <AlertOctagon className="h-6 w-6 text-rose-400 shrink-0" />;
    return <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0" />;
  };

  return (
    <div id="live-detection-page" className="space-y-8 animate-fade-in pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Live Road Scanner</h1>
        <p className="text-sm text-slate-400 mt-1 font-sans">
          Upload pavement frames to execute instantaneous YOLOv8.0 convolutional damage diagnosis.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Upload and Control Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 backdrop-blur-md shadow-xl">
            <h2 className="text-base font-semibold text-white tracking-tight mb-4">Pavement Frame Input</h2>
            
            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all ${
                dragActive 
                  ? 'border-blue-500 bg-blue-500/5' 
                  : imagePreview 
                  ? 'border-slate-800 bg-slate-950/20 hover:border-slate-700' 
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="w-full space-y-4">
                  <div className="relative rounded-lg overflow-hidden border border-slate-800 h-64 bg-slate-950 flex items-center justify-center">
                    <img 
                      src={imagePreview} 
                      alt="Pavement preview" 
                      className="max-h-full max-w-full object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent pointer-events-none" />
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <ImageIcon className="h-4 w-4 text-blue-400" />
                    <span>Selected File: {selectedImage?.name || 'capture.png'}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Drag and drop or select file</p>
                    <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG, JPEG up to 10MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Target coordinates assignment */}
            <div className="mt-6 space-y-4 border-t border-slate-900 pt-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-blue-400" /> Plot Location Coordinates
              </h3>

              <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500">Location Label</label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-blue-500 font-sans"
                    placeholder="E.g. Hazratganj Market"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500">Latitude (Lucknow)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={customLat}
                    onChange={(e) => setCustomLat(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-blue-500 font-mono"
                    placeholder="E.g. 26.8467"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500">Longitude (Lucknow)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={customLng}
                    onChange={(e) => setCustomLng(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-blue-500 font-mono"
                    placeholder="E.g. 80.9462"
                  />
                </div>
              </div>
            </div>

            {/* Run Button */}
            <div className="mt-6">
              <button
                id="run-prediction-btn"
                onClick={runPrediction}
                disabled={!selectedImage || isScanning}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-semibold text-white transition-all shadow-xl select-none cursor-pointer ${
                  !selectedImage
                    ? 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
                    : isScanning
                    ? 'bg-blue-600/50 cursor-wait'
                    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/10'
                }`}
              >
                {isScanning ? 'YOLOv8 Inferencing Active...' : 'Execute YOLOv8 Diagnosis'}
              </button>
            </div>
          </div>
        </div>

        {/* Diagnosis Results Panels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 backdrop-blur-md shadow-xl h-full flex flex-col justify-between min-h-[300px]">
            <h2 className="text-base font-semibold text-white tracking-tight mb-4 flex items-center justify-between">
              <span>Diagnosis Summary</span>
              {scanResult && scanResult.isFallback && (
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  Demo Mode Active
                </span>
              )}
            </h2>

            {isScanning ? (
              <div className="flex-1 flex items-center justify-center">
                <LoadingSpinner message="Evaluating convolutional pavement layers..." />
              </div>
            ) : scanResult ? (
              <div className="flex-1 space-y-6">
                {scanResult.noDamage ? (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
                    <p className="text-sm font-semibold text-emerald-400">Excellent Structural Status</p>
                    <p className="text-xs text-slate-400 mt-1">YOLOv8 concluded no road cracks or potholes found in the frame.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Primary damage block */}
                    <div className="rounded-xl bg-slate-950 p-4 border border-slate-900 flex items-start gap-4">
                      {getSeverityIcon(scanResult.mainDetection.severity)}
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 font-mono font-medium lowercase">Detected Event</p>
                        <p className="text-base font-bold text-white tracking-tight">{scanResult.mainDetection.damageType}</p>
                        <p className="text-xs text-slate-400 font-sans ">{locationName}</p>
                      </div>
                    </div>

                    {/* Parameters list */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-900/80">
                        <p className="text-[10px] text-slate-500 font-mono">Confidence rating</p>
                        <p className="text-xl font-extrabold text-white font-mono mt-1">
                          {(scanResult.mainDetection.confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-900/80">
                        <p className="text-[10px] text-slate-500 font-mono">Severity class</p>
                        <div className="mt-1">
                          {getSeverityBadge(scanResult.mainDetection.severity)}
                        </div>
                      </div>
                    </div>

                    {/* All detections breakdown if multiple */}
                    {scanResult.allDetections && scanResult.allDetections.length > 1 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-mono text-slate-500 uppercase">Auxiliary Detections</p>
                        <div className="space-y-1">
                          {scanResult.allDetections.slice(1).map((det, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-slate-950/40 p-2.5 rounded border border-slate-900 text-xs">
                              <span className="text-slate-300 font-medium">{det.damageType}</span>
                              <div className="flex items-center gap-2 font-mono">
                                <span className="text-slate-500">{(det.confidence * 100).toFixed(0)}%</span>
                                <span className="text-amber-500">{det.severity}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Integration Info Banner */}
                    <div className="rounded-xl bg-blue-500/5 border border-blue-500/10 p-3 flex  gap-2.5">
                      <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                      <div className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        <span>The prediction record was automatically stored in the frontend index and pinned around coordinates: </span>
                        <span className="text-blue-300 font-mono">{parseFloat(customLat).toFixed(4)}, {parseFloat(customLng).toFixed(4)}</span>.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 border border-dashed border-slate-900 rounded-xl bg-slate-950/35 text-slate-500 text-center">
                <ImageIcon className="h-8 w-8 text-slate-700 mb-2" />
                <p className="text-xs font-semibold text-slate-400">Waiting for payload analysis</p>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed max-w-[200px]">
                  Introduce a pavement frame first, select deployment location coords, then ignite AI predictions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
