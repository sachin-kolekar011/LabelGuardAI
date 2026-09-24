import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useApp } from "../context/AppContext";
import { scans as mockScans, products } from "../data/mockData";
import {
  Upload, Camera, Ruler, CheckCircle2, AlertTriangle,
  X, FileImage, Loader2, ToggleLeft, ToggleRight, Info
} from "lucide-react";

export default function ScanUpload() {
  const navigate = useNavigate();
  const { addToast, setActiveScan, setUploadedLabelImage } = useApp();
  const [a4Mode, setA4Mode] = useState(false);
  const [images, setImages] = useState([]);
  const [qualityState, setQualityState] = useState(null); // null | 'ok' | 'blurry'
  const [calibrationState, setCalibrationState] = useState(null); // null | 'ok' | 'none'
  const [analyzing, setAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const simulatedProducts = [
    "Amul Butter (500g)", "Britannia Marie Gold (250g)",
    "Patanjali Dant Kanti (200g)", "Borges Olive Oil (500ml)",
    "Haldiram's Aloo Bhujia (200g)"
  ];

  const handleFiles = (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (!valid.length) return;
    const urls = valid.map(f => URL.createObjectURL(f));
    setImages(prev => [...prev, ...urls]);
    // Store first image as label image for ScanResult viewer
    setUploadedLabelImage(urls[0]);
    // Simulate quality check
    const blurry = Math.random() < 0.25;
    setQualityState(blurry ? "blurry" : "ok");
    if (a4Mode) setCalibrationState(blurry ? "none" : "ok");
  };

  const removeImage = (i) => setImages(prev => prev.filter((_, idx) => idx !== i));

  const handleAnalyze = () => {
    if (!images.length) { addToast("Upload at least one label image first.", "error"); return; }
    setAnalyzing(true);
    // Pick a random scan from mock data to simulate result
    const candidates = mockScans.filter(s => a4Mode ? s.calibration === "A4" : true);
    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    const product = products.find(p => p.id === picked.productId);
    setTimeout(() => {
      setAnalyzing(false);
      setActiveScan({ ...picked, _productName: product?.name, _calibrationUsed: a4Mode ? "A4" : "Relative" });
      navigate(`/result/${picked.id}`);
    }, 2200);
  };

  return (
    <Layout title="Scan & Upload">
      <div className="max-w-2xl space-y-5">
        {/* A4 calibration toggle */}
        <div className="card p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Ruler size={15} className="text-navy-600 dark:text-navy-400" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">A4-Calibrated Capture</span>
                <span className="badge-info text-[10px]">Recommended</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Place the product flat on a standard A4 sheet (fully visible) before capturing. This gives the system a known real-world scale, enabling true mm-based font-size and dimension checks instead of relative pixel ratios.
              </p>
            </div>
            <button onClick={() => { setA4Mode(m => !m); setCalibrationState(null); }} className="flex-shrink-0 mt-0.5">
              {a4Mode
                ? <ToggleRight size={28} className="text-navy-600 dark:text-navy-400" />
                : <ToggleLeft size={28} className="text-slate-300 dark:text-slate-600" />
              }
            </button>
          </div>

          {a4Mode && (
            <div className="mt-4 border-2 border-dashed border-navy-300 dark:border-navy-700 rounded-xl p-4 bg-navy-50 dark:bg-navy-950/30">
              <div className="flex items-center gap-3">
                {/* A4 frame illustration */}
                <div className="flex-shrink-0 w-16 h-[88px] border-2 border-navy-400 dark:border-navy-500 rounded relative bg-white dark:bg-slate-900 flex items-center justify-center">
                  <div className="w-9 h-12 border border-navy-300 dark:border-navy-600 rounded-sm bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
                    <div className="w-5 h-8 bg-navy-200 dark:bg-navy-700 rounded-sm" />
                  </div>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] text-navy-500 font-mono bg-navy-50 dark:bg-slate-900 px-1">A4</div>
                </div>
                <div>
                  <p className="text-xs font-medium text-navy-700 dark:text-navy-300">Placement guide</p>
                  <p className="text-xs text-navy-600/80 dark:text-navy-400/80 mt-0.5 leading-relaxed">
                    Place the product flat on an A4 sheet — all edges of the sheet must be visible in frame. Keep the product within the sheet boundary.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Calibration feedback */}
          {calibrationState === "ok" && (
            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 rounded-lg">
              <CheckCircle2 size={13} />
              A4 reference detected — scale calibrated. Measurements will be shown in true millimetres.
            </div>
          )}
          {(calibrationState === "none" || (!a4Mode && images.length > 0)) && (
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 rounded-lg">
              <Info size={13} />
              No physical reference detected — font-size checks will use relative ratios and low-confidence results will be flagged for review.
            </div>
          )}
        </div>

        {/* Upload zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => fileRef.current?.click()}
          className={`card p-8 border-2 border-dashed cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 text-center
            ${dragOver ? "border-navy-400 bg-navy-50 dark:bg-navy-950/30 scale-[1.01]" : "border-slate-200 dark:border-slate-700 hover:border-navy-300 dark:hover:border-navy-700 hover:bg-slate-50 dark:hover:bg-slate-800/30"}`}
        >
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
          <div className="w-12 h-12 rounded-xl bg-navy-50 dark:bg-navy-950 flex items-center justify-center">
            <Upload size={22} className="text-navy-600 dark:text-navy-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Drop label images here</p>
            <p className="text-xs text-slate-400 mt-1">or click to browse — front + back panel supported</p>
          </div>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
            className="flex items-center gap-1.5 text-xs font-medium text-navy-600 dark:text-navy-400 bg-navy-50 dark:bg-navy-950 px-3 py-1.5 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-900 transition-colors"
          >
            <Camera size={12} /> Use camera / browse files
          </button>
        </div>

        {/* Quality warning */}
        {qualityState === "blurry" && (
          <div className="card p-4 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 flex items-start gap-3">
            <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Recapture recommended</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">Image appears blurry or glare was detected. For accurate OCR results, retake in even lighting with the lens held steady.</p>
            </div>
            <button onClick={() => { setImages([]); setQualityState(null); setCalibrationState(null); }} className="text-amber-500 hover:text-amber-700 flex-shrink-0">
              <X size={15} />
            </button>
          </div>
        )}

        {/* Image previews */}
        {images.length > 0 && (
          <div className="card p-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">{images.length} image{images.length > 1 ? "s" : ""} queued</p>
            <div className="flex flex-wrap gap-3">
              {images.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                  <div className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-white px-1 rounded">
                    {i === 0 ? "Front" : "Back"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Simulate with no upload */}
        {images.length === 0 && (
          <div className="card p-4 bg-slate-50 dark:bg-slate-800/30">
            <p className="text-xs font-medium text-slate-500 mb-2">Or simulate scan for demo:</p>
            <div className="flex flex-wrap gap-2">
              {simulatedProducts.map(name => (
                <button
                  key={name}
                  onClick={() => { setImages(["demo"]); setQualityState("ok"); if (a4Mode) setCalibrationState("ok"); setUploadedLabelImage(null); }}
                  className="text-xs px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-navy-300 dark:hover:border-navy-600 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1.5"
                >
                  <FileImage size={11} /> {name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Analyze button */}
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="btn-primary w-full py-3 justify-center text-sm font-semibold"
        >
          {analyzing ? (
            <><Loader2 size={15} className="animate-spin" /> Analysing label — extracting fields…</>
          ) : "Analyse Label"}
        </button>

        {analyzing && (
          <div className="card p-4">
            <div className="space-y-2">
              {["Running OCR extraction…", "Checking font-size compliance…", "Cross-referencing versioned rules…", "Generating field verdicts…"].map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-navy-400 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
