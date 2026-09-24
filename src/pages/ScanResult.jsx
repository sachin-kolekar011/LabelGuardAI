import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import { useApp } from "../context/AppContext";
import { products } from "../data/mockData";
import {
  CheckCircle2, XCircle, AlertTriangle, Download, FileText,
  Send, Check, ChevronDown, ChevronUp, Loader2, Info, Ruler,
  ZoomIn, ZoomOut, Maximize2
} from "lucide-react";

// Bounding boxes calibrated to match SVG label regions (percent-based)
const fieldBoxes = {
  "Manufacturer Name & Address": { x: "5%", y: "4.5%", w: "68%", h: "9%" },
  "Net Quantity":                  { x: "73%", y: "25%", w: "24%", h: "9%" },
  "MRP & Unit Sale Price":         { x: "2%", y: "78%", w: "96%", h: "9%" },
  "Mfg / Best Before Date":        { x: "2%", y: "88%", w: "96%", h: "4.5%" },
  "Consumer Care Contact":         { x: "2%", y: "92.5%", w: "96%", h: "5%" },
  "Font Size":                     { x: "2%", y: "52%", w: "96%", h: "3.5%" },
  "Barcode / QR Code":             { x: "53%", y: "59%", w: "44%", h: "12%" },
  "Country of Origin":             { x: "2%", y: "59%", w: "44%", h: "7%" },
};

const statusBorderColor = { Pass: "#10b981", Fail: "#ef4444", Review: "#f59e0b" };
const statusBgColor     = { Pass: "#10b98120", Fail: "#ef444420", Review: "#f59e0b20" };

function FieldRow({ v, active, onClick }) {
  const [expanded, setExpanded] = useState(false);
  const icon = {
    Pass:   <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />,
    Fail:   <XCircle      size={14} className="text-red-500 flex-shrink-0" />,
    Review: <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />,
  };
  return (
    <div
      className={`border rounded-lg mb-2 transition-all cursor-pointer select-none
        ${active ? "border-navy-400 dark:border-navy-500 shadow-md bg-navy-50/50 dark:bg-navy-950/20"
                 : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"}`}
      onClick={() => { onClick(); setExpanded(e => !e); }}
    >
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        {icon[v.status]}
        <span className="flex-1 text-xs font-medium text-slate-700 dark:text-slate-200 truncate">{v.field}</span>
        <StatusBadge status={v.status} />
        {expanded ? <ChevronUp size={12} className="text-slate-400 flex-shrink-0" />
                  : <ChevronDown size={12} className="text-slate-400 flex-shrink-0" />}
      </div>
      {expanded && (
        <div className="px-3 pb-3 space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-2">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            <span className="font-semibold">Extracted:</span> {v.extracted}
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5 leading-snug">
            {v.status !== "Pass"
              ? <AlertTriangle size={10} className="mt-0.5 flex-shrink-0 text-amber-500" />
              : <CheckCircle2  size={10} className="mt-0.5 flex-shrink-0 text-emerald-500" />}
            {v.reason}
          </p>
          <p className="text-[10px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">{v.citation}</p>
        </div>
      )}
    </div>
  );
}

export default function ScanResult() {
  const { id } = useParams();
  const { scans, activeScan, generateReport, addToast, uploadedLabelImage } = useApp();
  const navigate = useNavigate();
  const [activeField, setActiveField] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [sentReview, setSentReview] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [uploadedPreview, setUploadedPreview] = useState(null);
  const fileRef = useRef();

  const scan    = activeScan?.id === id ? activeScan : scans.find(s => s.id === id);
  const product = products.find(p => p.id === scan?.productId);

  useEffect(() => { if (!scan) navigate("/repository"); }, [scan]);
  if (!scan) return null;

  const isCalibrated = scan.calibration === "A4";
  const fails   = scan.verdicts.filter(v => v.status === "Fail");
  const reviews = scan.verdicts.filter(v => v.status === "Review");

  // Priority: local re-upload > context uploaded from scan flow > product default
  const labelSrc = uploadedPreview || uploadedLabelImage || product?.labelImage || null;

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      generateReport({ ...scan, _productName: product?.name });
      addToast("Report generated — view in Reports page.", "success");
    }, 1600);
  };

  const handleDownloadPDF = () => {
    const html = buildReportHTML(scan, product, isCalibrated);
    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 400);
  };

  const handleDownloadDOCX = () => {
    const html = buildReportHTML(scan, product, isCalibrated, true);
    const blob = new Blob(
      ['\ufeff' + html],
      { type: "application/msword" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LabelGuard_${scan.id}_${(product?.name || "Report").replace(/\s+/g,"_")}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    addToast("Editable report downloaded (.doc).", "success");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedPreview(url);
    addToast("Label image updated — bounding boxes overlaid.", "info");
  };

  const verdictStyle = {
    "Compliant":     "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
    "Non-Compliant": "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
    "Needs Review":  "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
  };
  const verdictTextCls = {
    "Compliant":     "text-emerald-700 dark:text-emerald-300",
    "Non-Compliant": "text-red-700 dark:text-red-300",
    "Needs Review":  "text-amber-700 dark:text-amber-300",
  };
  const verdictIcon = {
    "Compliant":     <CheckCircle2 size={18} />,
    "Non-Compliant": <XCircle size={18} />,
    "Needs Review":  <AlertTriangle size={18} />,
  };

  return (
    <Layout title="Scan Result — Evidence Viewer">
      <div className="max-w-7xl space-y-4">

        {/* ── Verdict banner ── */}
        <div className={`card p-4 border ${verdictStyle[scan.status]}`}>
          <div className="flex flex-wrap items-center gap-4">
            <div className={`flex items-center gap-2 font-bold text-base ${verdictTextCls[scan.status]}`}>
              {verdictIcon[scan.status]} {scan.status}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{product?.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {scan.id} · {new Date(scan.timestamp).toLocaleString("en-IN")} · {product?.brand} · {product?.category}
              </p>
            </div>
            {isCalibrated
              ? <span className="badge-info flex items-center gap-1"><Ruler size={10}/> A4-calibrated · mm</span>
              : <span className="badge-review flex items-center gap-1"><Info size={10}/> Relative ratios</span>}
            {fails.length   > 0 && <span className="badge-fail">{fails.length} fail{fails.length>1?"s":""}</span>}
            {reviews.length > 0 && <span className="badge-review">{reviews.length} review</span>}
          </div>
        </div>

        {/* ── Main layout: image + verdicts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* ── Label Image Panel ── */}
          <div className="card p-4 lg:col-span-2 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Label Image — click field to highlight
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
                  className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500">
                  <ZoomIn size={12}/>
                </button>
                <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}
                  className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500">
                  <ZoomOut size={12}/>
                </button>
                <button onClick={() => setZoom(1)}
                  className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500">
                  <Maximize2 size={11}/>
                </button>
              </div>
            </div>

            {/* Image + overlay container */}
            <div className="overflow-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex-1">
              <div
                className="relative inline-block"
                style={{ transform: `scale(${zoom})`, transformOrigin: "top left", transition: "transform 0.2s" }}
              >
                {labelSrc ? (
                  <img
                    src={labelSrc}
                    alt="Product label"
                    className="block"
                    style={{ width: "100%", minWidth: 260, maxWidth: 380, display: "block" }}
                    onError={e => { e.target.style.display = "none"; }}
                  />
                ) : (
                  /* Fallback placeholder */
                  <div className="w-72 bg-gradient-to-b from-blue-50 to-white dark:from-navy-950 dark:to-slate-900 flex flex-col items-center justify-start p-4" style={{minHeight:400}}>
                    <div className="text-center mb-3">
                      <div className="text-lg font-black text-navy-800 dark:text-navy-200">{product?.brand}</div>
                      <div className="text-xs text-slate-500">{product?.name}</div>
                    </div>
                    <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-xl mb-3 flex items-center justify-center text-slate-400 text-xs">IMG</div>
                  </div>
                )}

                {/* Bounding boxes overlaid */}
                <div className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%" }}>
                  {scan.verdicts.map(v => {
                    const pos = fieldBoxes[v.field];
                    if (!pos) return null;
                    const isActive = activeField === v.field;
                    return (
                      <div
                        key={v.field}
                        className="absolute pointer-events-auto cursor-pointer transition-all duration-200"
                        style={{
                          left: pos.x, top: pos.y, width: pos.w, height: pos.h,
                          border: `2px solid ${statusBorderColor[v.status]}`,
                          background: isActive ? statusBgColor[v.status] : "transparent",
                          opacity: activeField && !isActive ? 0.35 : 1,
                          boxShadow: isActive ? `0 0 0 3px ${statusBorderColor[v.status]}40` : "none",
                        }}
                        onClick={() => setActiveField(activeField === v.field ? null : v.field)}
                        title={v.field}
                      >
                        {/* Label tag */}
                        <div
                          className="absolute -top-5 left-0 text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap leading-tight"
                          style={{ background: statusBorderColor[v.status], color: "#fff", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis" }}
                        >
                          {v.field.length > 14 ? v.field.split(" ")[0] : v.field}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Upload your own label */}
            <div className="mt-3 flex items-center gap-2">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              <button onClick={() => fileRef.current?.click()}
                className="btn-secondary py-1.5 text-xs flex-1 justify-center">
                📷 Upload your label image
              </button>
              {uploadedPreview && (
                <button onClick={() => setUploadedPreview(null)}
                  className="text-xs text-slate-400 hover:text-red-500 transition-colors">Reset</button>
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 text-center">
              Coloured rectangles = detected field regions · click to highlight
            </p>
          </div>

          {/* ── Field verdicts panel ── */}
          <div className="card p-4 lg:col-span-3 flex flex-col">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
              Field-Level Verdicts — {scan.verdicts.length} fields checked
            </p>
            <div className="overflow-y-auto flex-1 pr-1" style={{ maxHeight: 420 }}>
              {scan.verdicts.map(v => (
                <FieldRow
                  key={v.field}
                  v={v}
                  active={activeField === v.field}
                  onClick={() => setActiveField(activeField === v.field ? null : v.field)}
                />
              ))}
            </div>

            {/* Active field detail card */}
            {activeField && (() => {
              const v = scan.verdicts.find(x => x.field === activeField);
              return v ? (
                <div className={`mt-3 rounded-xl p-3 border text-xs
                  ${v.status === "Pass"   ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
                  : v.status === "Fail"   ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                  :                         "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"}`}>
                  <div className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{v.field}</div>
                  <div className="text-slate-600 dark:text-slate-400 mb-1"><span className="font-medium">Extracted:</span> {v.extracted}</div>
                  <div className="text-slate-600 dark:text-slate-400 mb-1">{v.reason}</div>
                  <div className="font-mono text-[10px] text-slate-400">{v.citation}</div>
                </div>
              ) : null;
            })()}

            {/* Action buttons */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
              <button onClick={handleGenerate} disabled={generating} className="btn-primary">
                {generating
                  ? <><Loader2 size={13} className="animate-spin"/> Generating…</>
                  : <><FileText size={13}/> Generate Report</>}
              </button>
              <button onClick={handleDownloadPDF} className="btn-secondary">
                <Download size={13}/> Download PDF
              </button>
              <button onClick={handleDownloadDOCX} className="btn-secondary">
                <Download size={13}/> Export DOC
              </button>
              {(reviews.length > 0 || fails.length > 0) && !sentReview && (
                <button onClick={() => { setSentReview(true); addToast("Scan sent to review queue.", "info"); }} className="btn-secondary">
                  <Send size={13}/> Send to Queue
                </button>
              )}
              {scan.status === "Compliant" && (
                <button onClick={() => { addToast("Scan approved and closed.", "success"); navigate("/repository"); }} className="btn-primary">
                  <Check size={13}/> Approve & Close
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Violations summary ── */}
        {fails.length > 0 && (
          <div className="card p-4 border border-red-100 dark:border-red-900/30">
            <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-3">
              Violations Detected — Rule Citations
            </p>
            <div className="space-y-2">
              {fails.map(v => (
                <div key={v.field} className="flex items-start gap-3 text-xs bg-red-50 dark:bg-red-950/20 p-2.5 rounded-lg">
                  <XCircle size={13} className="text-red-500 mt-0.5 flex-shrink-0"/>
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{v.field}: </span>
                    <span className="text-slate-600 dark:text-slate-400">{v.reason}</span>
                    <div className="font-mono text-[10px] text-slate-400 mt-0.5 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded inline-block mt-1">{v.citation}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

// ── Report HTML generator (used for both PDF print + DOC download) ────────────
function buildReportHTML(scan, product, isCalibrated, forDoc = false) {
  const fails   = scan.verdicts.filter(v => v.status === "Fail");
  const reviews = scan.verdicts.filter(v => v.status === "Review");
  const passes  = scan.verdicts.filter(v => v.status === "Pass");
  const statusColor = { Compliant: "#16a34a", "Non-Compliant": "#dc2626", "Needs Review": "#d97706" };
  const col = statusColor[scan.status] || "#1e40af";
  const now = new Date().toLocaleString("en-IN");

  const verdictRows = scan.verdicts.map(v => {
    const bc = v.status === "Pass" ? "#16a34a" : v.status === "Fail" ? "#dc2626" : "#d97706";
    const bg = v.status === "Pass" ? "#f0fdf4" : v.status === "Fail" ? "#fef2f2" : "#fffbeb";
    return `
      <tr style="background:${bg}">
        <td style="padding:8px 10px;font-size:12px;font-weight:600;border-bottom:1px solid #e5e7eb">${v.field}</td>
        <td style="padding:8px 10px;font-size:11px;border-bottom:1px solid #e5e7eb;color:#374151">${v.extracted}</td>
        <td style="padding:8px 10px;font-size:11px;border-bottom:1px solid #e5e7eb;color:#374151">${v.reason}</td>
        <td style="padding:8px 10px;text-align:center;border-bottom:1px solid #e5e7eb">
          <span style="background:${bc};color:#fff;border-radius:20px;padding:2px 10px;font-size:10px;font-weight:700">${v.status}</span>
        </td>
        <td style="padding:8px 10px;font-size:10px;font-family:monospace;color:#6b7280;border-bottom:1px solid #e5e7eb">${v.citation}</td>
      </tr>`;
  }).join("");

  const violationsList = fails.length > 0 ? `
    <div style="margin:18px 0;padding:14px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px">
      <div style="font-weight:700;color:#dc2626;margin-bottom:8px;font-size:13px">⚠ Violations Found (${fails.length})</div>
      ${fails.map(v => `
        <div style="margin:6px 0;padding:8px;background:white;border-radius:6px;border-left:3px solid #dc2626">
          <div style="font-weight:600;font-size:12px;color:#111">${v.field}</div>
          <div style="font-size:11px;color:#555;margin-top:2px">${v.reason}</div>
          <div style="font-size:10px;color:#9ca3af;font-family:monospace;margin-top:3px">${v.citation}</div>
        </div>`).join("")}
    </div>` : "";

  const labelImgTag = product?.labelImage
    ? `<div style="text-align:center;margin:16px 0">
         <img src="${window.location.origin}${product.labelImage}" alt="Label" style="max-width:240px;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.12)"/>
         <div style="font-size:10px;color:#9ca3af;margin-top:6px">Scanned label image</div>
       </div>` : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>LabelGuard AI — Compliance Report ${scan.id}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Inter, Arial, sans-serif; background: #fff; color: #111827; }
    table { border-collapse: collapse; width: 100%; }
    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .no-print { display: none; }
    }
  </style>
</head>
<body style="padding:0;background:#f9fafb">
<div style="max-width:800px;margin:0 auto;background:white;min-height:100vh">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#1e3a8a,#1d4ed8);padding:28px 32px;color:white">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
      <div>
        <div style="font-size:22px;font-weight:800;letter-spacing:1px">🛡 LabelGuard AI</div>
        <div style="font-size:12px;opacity:0.75;margin-top:2px">Legal Metrology Compliance Report · SIH 2026 · PS 26034</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:11px;opacity:0.7">Report ID</div>
        <div style="font-size:18px;font-weight:700;font-family:monospace">${scan.id}</div>
        <div style="font-size:10px;opacity:0.6;margin-top:2px">Generated: ${now}</div>
      </div>
    </div>
    <!-- Verdict pill -->
    <div style="margin-top:18px;display:inline-flex;align-items:center;gap:10px;background:rgba(255,255,255,0.15);padding:10px 20px;border-radius:50px">
      <div style="width:10px;height:10px;border-radius:50%;background:${col}"></div>
      <span style="font-size:16px;font-weight:700">${scan.status}</span>
      ${scan.severity !== "None" ? `<span style="font-size:12px;opacity:0.8">· Severity: ${scan.severity}</span>` : ""}
    </div>
  </div>

  <div style="padding:28px 32px">

    <!-- Product info grid -->
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px;margin-bottom:20px">
      <div style="font-size:13px;font-weight:700;color:#1e3a8a;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px">Product Information</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div><div style="font-size:10px;color:#94a3b8;text-transform:uppercase">Product Name</div><div style="font-size:13px;font-weight:600;margin-top:2px">${product?.name || "—"}</div></div>
        <div><div style="font-size:10px;color:#94a3b8;text-transform:uppercase">Brand</div><div style="font-size:13px;font-weight:600;margin-top:2px">${product?.brand || "—"}</div></div>
        <div><div style="font-size:10px;color:#94a3b8;text-transform:uppercase">Category</div><div style="font-size:13px;font-weight:600;margin-top:2px">${product?.category || "—"}</div></div>
        <div><div style="font-size:10px;color:#94a3b8;text-transform:uppercase">SKU</div><div style="font-size:13px;font-weight:600;font-family:monospace;margin-top:2px">${product?.sku || "—"}</div></div>
        <div><div style="font-size:10px;color:#94a3b8;text-transform:uppercase">Scan Date</div><div style="font-size:13px;font-weight:600;margin-top:2px">${new Date(scan.timestamp).toLocaleString("en-IN")}</div></div>
        <div><div style="font-size:10px;color:#94a3b8;text-transform:uppercase">Calibration</div><div style="font-size:13px;font-weight:600;margin-top:2px">${isCalibrated ? "✅ A4-calibrated (mm)" : "⚠ Relative ratios (no scale ref)"}</div></div>
      </div>
    </div>

    <!-- Label image -->
    ${labelImgTag}

    <!-- Summary stats -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px">
      <div style="text-align:center;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px">
        <div style="font-size:24px;font-weight:800;color:#16a34a">${passes.length}</div>
        <div style="font-size:11px;color:#15803d;font-weight:600">PASS</div>
      </div>
      <div style="text-align:center;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:14px">
        <div style="font-size:24px;font-weight:800;color:#dc2626">${fails.length}</div>
        <div style="font-size:11px;color:#b91c1c;font-weight:600">FAIL</div>
      </div>
      <div style="text-align:center;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px">
        <div style="font-size:24px;font-weight:800;color:#d97706">${reviews.length}</div>
        <div style="font-size:11px;color:#b45309;font-weight:600">REVIEW</div>
      </div>
    </div>

    <!-- Violations -->
    ${violationsList}

    <!-- Field verdicts table -->
    <div style="font-size:13px;font-weight:700;color:#1e3a8a;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px">Field-Level Verdicts</div>
    <table style="font-size:12px">
      <thead>
        <tr style="background:#1e3a8a;color:white">
          <th style="padding:9px 10px;text-align:left;font-size:11px;font-weight:600">Field</th>
          <th style="padding:9px 10px;text-align:left;font-size:11px;font-weight:600">Extracted Value</th>
          <th style="padding:9px 10px;text-align:left;font-size:11px;font-weight:600">Reason</th>
          <th style="padding:9px 10px;text-align:center;font-size:11px;font-weight:600">Status</th>
          <th style="padding:9px 10px;text-align:left;font-size:11px;font-weight:600">Rule Citation</th>
        </tr>
      </thead>
      <tbody>${verdictRows}</tbody>
    </table>

    <!-- Footer -->
    <div style="margin-top:28px;padding-top:16px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
      <div style="font-size:10px;color:#9ca3af">LabelGuard AI · Grand Theft Code · SIH 2026 · Problem Statement 26034</div>
      <div style="font-size:10px;color:#9ca3af">LMPC Rules 2011 (amended 2017, 2022, 2025)</div>
    </div>

  </div>
</div>
</body>
</html>`;
}
