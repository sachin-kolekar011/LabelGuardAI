import { useState } from "react";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import { useApp } from "../context/AppContext";
import { scans as allScans, products } from "../data/mockData";
import {
  FileText, Download, Eye, X, CheckCircle2,
  XCircle, AlertTriangle, FileSpreadsheet, Printer, Shield
} from "lucide-react";

// ── Shared HTML report builder ────────────────────────────────────────────────
function buildReportHTML(report, scan, product) {
  if (!scan || !product) return "";
  const fails   = scan.verdicts.filter(v => v.status === "Fail");
  const reviews = scan.verdicts.filter(v => v.status === "Review");
  const passes  = scan.verdicts.filter(v => v.status === "Pass");
  const isCalibrated = scan.calibration === "A4";
  const col = report.status === "Compliant" ? "#16a34a"
            : report.status === "Non-Compliant" ? "#dc2626" : "#d97706";
  const now = new Date(report.generatedAt).toLocaleString("en-IN");

  const verdictRows = scan.verdicts.map(v => {
    const bc = v.status === "Pass" ? "#16a34a" : v.status === "Fail" ? "#dc2626" : "#d97706";
    const bg = v.status === "Pass" ? "#f0fdf4" : v.status === "Fail" ? "#fef2f2" : "#fffbeb";
    return `
      <tr style="background:${bg}">
        <td style="padding:8px 10px;font-size:12px;font-weight:600;border-bottom:1px solid #e5e7eb;color:#111">${v.field}</td>
        <td style="padding:8px 10px;font-size:11px;border-bottom:1px solid #e5e7eb;color:#374151">${v.extracted}</td>
        <td style="padding:8px 10px;font-size:11px;border-bottom:1px solid #e5e7eb;color:#374151">${v.reason}</td>
        <td style="padding:8px 10px;text-align:center;border-bottom:1px solid #e5e7eb">
          <span style="background:${bc};color:#fff;border-radius:20px;padding:2px 10px;font-size:10px;font-weight:700">${v.status.toUpperCase()}</span>
        </td>
        <td style="padding:8px 10px;font-size:10px;font-family:monospace;color:#6b7280;border-bottom:1px solid #e5e7eb">${v.citation}</td>
      </tr>`;
  }).join("");

  const violationSection = fails.length > 0 ? `
    <div style="margin:18px 0;padding:14px;background:#fef2f2;border:1px solid #fecaca;border-radius:10px">
      <div style="font-weight:700;color:#dc2626;margin-bottom:10px;font-size:13px">⚠ Violations Detected (${fails.length})</div>
      ${fails.map(v => `
        <div style="margin:6px 0;padding:9px 12px;background:white;border-radius:7px;border-left:4px solid #dc2626">
          <div style="font-weight:700;font-size:12px;color:#111">${v.field}</div>
          <div style="font-size:11px;color:#555;margin-top:3px">${v.reason}</div>
          <div style="font-size:10px;color:#9ca3af;font-family:monospace;margin-top:4px">${v.citation}</div>
        </div>`).join("")}
    </div>` : "";

  const reviewSection = reviews.length > 0 ? `
    <div style="margin:18px 0;padding:14px;background:#fffbeb;border:1px solid #fde68a;border-radius:10px">
      <div style="font-weight:700;color:#d97706;margin-bottom:10px;font-size:13px">⚑ Fields Requiring Review (${reviews.length})</div>
      ${reviews.map(v => `
        <div style="margin:6px 0;padding:9px 12px;background:white;border-radius:7px;border-left:4px solid #f59e0b">
          <div style="font-weight:700;font-size:12px;color:#111">${v.field}</div>
          <div style="font-size:11px;color:#555;margin-top:3px">${v.reason}</div>
          <div style="font-size:10px;color:#9ca3af;font-family:monospace;margin-top:4px">${v.citation}</div>
        </div>`).join("")}
    </div>` : "";

  const labelImgSection = product.labelImage ? `
    <div style="text-align:center;margin:20px 0">
      <img src="${window.location.origin}${product.labelImage}"
           alt="Scanned label"
           style="max-width:220px;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,0.10)"/>
      <div style="font-size:10px;color:#9ca3af;margin-top:6px">Scanned product label — ${product.name}</div>
    </div>` : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>LabelGuard AI — ${report.id}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Inter,Arial,sans-serif;background:#f8fafc;color:#111827}
    table{border-collapse:collapse;width:100%}
    @media print{
      body{print-color-adjust:exact;-webkit-print-color-adjust:exact;background:white}
      .no-print{display:none!important}
    }
  </style>
</head>
<body>
<div style="max-width:820px;margin:0 auto;background:white;min-height:100vh">

  <!-- HEADER -->
  <div style="background:linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 100%);padding:30px 36px 24px;color:white">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:14px">
      <div>
        <div style="font-size:24px;font-weight:800;letter-spacing:0.5px">🛡 LabelGuard AI</div>
        <div style="font-size:11px;opacity:0.7;margin-top:3px;letter-spacing:0.5px">
          Legal Metrology Packaged Commodities Compliance Report
        </div>
        <div style="font-size:10px;opacity:0.55;margin-top:2px">
          Smart India Hackathon 2026 · Problem Statement 26034 · Team: Grand Theft Code
        </div>
      </div>
      <div style="text-align:right">
        <div style="font-size:10px;opacity:0.6;text-transform:uppercase;letter-spacing:1px">Report ID</div>
        <div style="font-size:20px;font-weight:800;font-family:monospace;margin-top:2px">${report.id}</div>
        <div style="font-size:10px;opacity:0.55;margin-top:4px">Generated: ${now}</div>
        <div style="font-size:10px;opacity:0.55">By: ${report.generatedBy}</div>
      </div>
    </div>

    <!-- Verdict pill -->
    <div style="margin-top:20px;display:inline-flex;align-items:center;gap:12px;
                background:rgba(255,255,255,0.15);backdrop-filter:blur(8px);
                padding:12px 22px;border-radius:50px;border:1px solid rgba(255,255,255,0.2)">
      <div style="width:12px;height:12px;border-radius:50%;background:${col};box-shadow:0 0 0 3px ${col}40"></div>
      <span style="font-size:17px;font-weight:800">${report.status}</span>
      ${report.severity && report.severity !== "None"
        ? `<span style="font-size:12px;opacity:0.75;background:rgba(255,255,255,0.1);padding:3px 10px;border-radius:20px">
             Severity: ${report.severity}
           </span>` : ""}
    </div>
  </div>

  <div style="padding:30px 36px">

    <!-- PRODUCT INFO -->
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:22px">
      <div style="font-size:11px;font-weight:700;color:#1e3a8a;margin-bottom:14px;
                  text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #e2e8f0;padding-bottom:8px">
        Product Information
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">
        <div>
          <div style="font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px">Product Name</div>
          <div style="font-size:13px;font-weight:700;margin-top:3px;color:#111">${product.name}</div>
        </div>
        <div>
          <div style="font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px">Brand</div>
          <div style="font-size:13px;font-weight:700;margin-top:3px;color:#111">${product.brand}</div>
        </div>
        <div>
          <div style="font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px">Category</div>
          <div style="font-size:13px;font-weight:700;margin-top:3px;color:#111">${product.category}</div>
        </div>
        <div>
          <div style="font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px">Scan ID</div>
          <div style="font-size:12px;font-weight:600;font-family:monospace;margin-top:3px;color:#3b4a6b">${scan.id}</div>
        </div>
        <div>
          <div style="font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px">Scan Date</div>
          <div style="font-size:12px;font-weight:600;margin-top:3px;color:#111">${new Date(scan.timestamp).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</div>
        </div>
        <div>
          <div style="font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px">Calibration</div>
          <div style="font-size:12px;font-weight:600;margin-top:3px;color:${isCalibrated?"#16a34a":"#d97706"}">
            ${isCalibrated ? "✓ A4-calibrated (mm)" : "⚠ Relative ratios"}
          </div>
        </div>
      </div>
    </div>

    <!-- LABEL IMAGE + SUMMARY -->
    <div style="display:flex;gap:20px;margin-bottom:22px;flex-wrap:wrap">
      ${labelImgSection}
      <div style="flex:1;min-width:200px">
        <div style="font-size:11px;font-weight:700;color:#1e3a8a;margin-bottom:12px;text-transform:uppercase;letter-spacing:1px">
          Compliance Summary
        </div>
        <div style="display:flex;gap:10px">
          <div style="flex:1;text-align:center;background:#f0fdf4;border:1.5px solid #86efac;border-radius:10px;padding:16px 10px">
            <div style="font-size:28px;font-weight:900;color:#16a34a">${passes.length}</div>
            <div style="font-size:10px;color:#15803d;font-weight:700;margin-top:2px">PASS</div>
          </div>
          <div style="flex:1;text-align:center;background:#fef2f2;border:1.5px solid #fca5a5;border-radius:10px;padding:16px 10px">
            <div style="font-size:28px;font-weight:900;color:#dc2626">${fails.length}</div>
            <div style="font-size:10px;color:#b91c1c;font-weight:700;margin-top:2px">FAIL</div>
          </div>
          <div style="flex:1;text-align:center;background:#fffbeb;border:1.5px solid #fcd34d;border-radius:10px;padding:16px 10px">
            <div style="font-size:28px;font-weight:900;color:#d97706">${reviews.length}</div>
            <div style="font-size:10px;color:#b45309;font-weight:700;margin-top:2px">REVIEW</div>
          </div>
        </div>
        ${fails.length === 0 && reviews.length === 0 ? `
          <div style="margin-top:14px;padding:12px;background:#f0fdf4;border:1px solid #86efac;border-radius:8px;
                      color:#16a34a;font-size:12px;font-weight:600;display:flex;align-items:center;gap:8px">
            ✅ All mandatory declarations verified — fully LMPC compliant.
          </div>` : ""}
      </div>
    </div>

    <!-- VIOLATIONS -->
    ${violationSection}
    ${reviewSection}

    <!-- FIELD VERDICTS TABLE -->
    <div style="font-size:11px;font-weight:700;color:#1e3a8a;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px">
      Field-Level Verdicts
    </div>
    <table>
      <thead>
        <tr style="background:#1e3a8a;color:white">
          <th style="padding:10px 10px;text-align:left;font-size:11px;font-weight:600;border-radius:6px 0 0 0">Field</th>
          <th style="padding:10px 10px;text-align:left;font-size:11px;font-weight:600">Extracted Value</th>
          <th style="padding:10px 10px;text-align:left;font-size:11px;font-weight:600">Reason / Finding</th>
          <th style="padding:10px 10px;text-align:center;font-size:11px;font-weight:600">Status</th>
          <th style="padding:10px 10px;text-align:left;font-size:11px;font-weight:600;border-radius:0 6px 0 0">Rule Citation</th>
        </tr>
      </thead>
      <tbody>${verdictRows}</tbody>
    </table>

    <!-- FOOTER -->
    <div style="margin-top:30px;padding:16px 20px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;
                display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
      <div>
        <div style="font-size:11px;font-weight:700;color:#1e3a8a">LabelGuard AI · Grand Theft Code</div>
        <div style="font-size:10px;color:#9ca3af;margin-top:2px">SIH 2026 · Problem Statement 26034</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:10px;color:#9ca3af">Regulatory basis: LMPC Rules 2011</div>
        <div style="font-size:10px;color:#9ca3af">Amendments: 2017 · 2022 · 2025</div>
      </div>
    </div>

    <div class="no-print" style="margin-top:20px;text-align:center">
      <button onclick="window.print()" 
              style="background:#1e3a8a;color:white;border:none;padding:10px 28px;border-radius:8px;
                     font-size:13px;font-weight:600;cursor:pointer;font-family:Inter,Arial,sans-serif">
        🖨 Print / Save as PDF
      </button>
    </div>

  </div>
</div>
</body>
</html>`;
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function ReportModal({ report, scan, product, onClose }) {
  if (!scan || !product) return null;
  const fails   = scan.verdicts.filter(v => v.status === "Fail");
  const reviews = scan.verdicts.filter(v => v.status === "Review");
  const passes  = scan.verdicts.filter(v => v.status === "Pass");
  const isCalibrated = scan.calibration === "A4";
  const statusStyle = {
    "Compliant":     "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
    "Non-Compliant": "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
    "Needs Review":  "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
  };

  const handlePrint = () => {
    const html = buildReportHTML(report, scan, product);
    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 500);
  };

  const handleDOC = () => {
    const html = buildReportHTML(report, scan, product);
    const blob = new Blob(['\ufeff' + html], { type: "application/msword" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `LabelGuard_${report.id}_${product.name.replace(/[\s()]/g, "_")}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
         onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
           onClick={e => e.stopPropagation()}>

        {/* Modal header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800
                        px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-navy-600 rounded-lg flex items-center justify-center">
              <Shield size={14} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Compliance Report</h2>
              <p className="text-[10px] text-slate-400 font-mono">{report.id} · {new Date(report.generatedAt).toLocaleString("en-IN")}</p>
            </div>
          </div>
          <button onClick={onClose}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          {/* Verdict banner */}
          <div className={`rounded-xl border p-4 ${statusStyle[report.status]}`}>
            <div className="flex items-center gap-3 flex-wrap">
              {report.status === "Compliant"     && <CheckCircle2 size={20} className="text-emerald-600" />}
              {report.status === "Non-Compliant" && <XCircle      size={20} className="text-red-600" />}
              {report.status === "Needs Review"  && <AlertTriangle size={20} className="text-amber-600" />}
              <span className="font-bold text-base text-slate-800 dark:text-slate-100">{report.status}</span>
              <StatusBadge status={report.severity === "None" ? "Pass" : report.severity} />
            </div>
          </div>

          {/* Product info + label image side by side */}
          <div className="flex gap-4 flex-wrap">
            {product.labelImage && (
              <div className="flex-shrink-0">
                <img
                  src={product.labelImage}
                  alt="Product label"
                  className="w-28 rounded-xl border border-slate-200 dark:border-slate-700 shadow"
                />
                <p className="text-[10px] text-slate-400 text-center mt-1">Label image</p>
              </div>
            )}
            <div className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
                {[
                  ["Product", product.name],
                  ["Brand", product.brand],
                  ["Category", product.category],
                  ["SKU", product.sku],
                  ["Scan ID", scan.id],
                  ["Calibration", isCalibrated ? "✓ A4-calibrated" : "⚠ Relative ratios"],
                ].map(([label, val]) => (
                  <div key={label}>
                    <span className="text-slate-400 block">{label}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5 truncate">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary counts */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Pass", count: passes.length, cls: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400" },
              { label: "Fail", count: fails.length,  cls: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400" },
              { label: "Review", count: reviews.length, cls: "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400" },
            ].map(s => (
              <div key={s.label} className={`border rounded-xl p-3 text-center ${s.cls}`}>
                <div className="text-2xl font-black">{s.count}</div>
                <div className="text-[11px] font-bold mt-0.5">{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>

          {/* Violations */}
          {fails.length > 0 && (
            <div>
              <p className="text-xs font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-1.5">
                <XCircle size={13}/> Violations Found ({fails.length})
              </p>
              {fails.map(v => (
                <div key={v.field}
                     className="flex items-start gap-2 text-xs mb-2 bg-red-50 dark:bg-red-950/20
                                border border-red-100 dark:border-red-900/40 rounded-lg p-3">
                  <XCircle size={12} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{v.field}</div>
                    <div className="text-slate-500 dark:text-slate-400 mt-0.5">{v.reason}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1 bg-white dark:bg-slate-900
                                    px-1.5 py-0.5 rounded inline-block">{v.citation}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <div>
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                <AlertTriangle size={13}/> Needs Review ({reviews.length})
              </p>
              {reviews.map(v => (
                <div key={v.field}
                     className="flex items-start gap-2 text-xs mb-2 bg-amber-50 dark:bg-amber-950/20
                                border border-amber-100 dark:border-amber-900/40 rounded-lg p-3">
                  <AlertTriangle size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{v.field}</div>
                    <div className="text-slate-500 dark:text-slate-400 mt-0.5">{v.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {fails.length === 0 && reviews.length === 0 && (
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400
                            bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 size={14} /> All mandatory declarations verified — product is compliant with LMPC Rules 2011.
            </div>
          )}

          {/* Field verdict table */}
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">All Field Verdicts</p>
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
              <table className="w-full text-[11px]">
                <thead className="bg-navy-600 text-white">
                  <tr>
                    {["Field", "Status", "Extracted", "Rule"].map(h => (
                      <th key={h} className="text-left px-3 py-2 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scan.verdicts.map(v => (
                    <tr key={v.field}
                        className={`border-b border-slate-100 dark:border-slate-800
                          ${v.status==="Pass"   ? "bg-emerald-50/50 dark:bg-emerald-950/10"
                          : v.status==="Fail"   ? "bg-red-50/50 dark:bg-red-950/10"
                          :                       "bg-amber-50/50 dark:bg-amber-950/10"}`}>
                      <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-300">{v.field}</td>
                      <td className="px-3 py-2"><StatusBadge status={v.status} /></td>
                      <td className="px-3 py-2 text-slate-500 dark:text-slate-400 max-w-40 truncate">{v.extracted}</td>
                      <td className="px-3 py-2 font-mono text-slate-400 text-[10px]">{v.citation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer meta */}
          <div className="flex justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Generated by: {report.generatedBy}</span>
            <span>LabelGuard AI · SIH 2026</span>
          </div>
        </div>

        {/* Sticky action footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 flex flex-wrap gap-2 bg-white dark:bg-slate-900 rounded-b-2xl">
          <button onClick={handlePrint} className="btn-primary flex-1 justify-center">
            <Printer size={13}/> Print / Save PDF
          </button>
          <button onClick={handleDOC} className="btn-secondary flex-1 justify-center">
            <Download size={13}/> Download .DOC
          </button>
          <button onClick={onClose} className="btn-secondary justify-center">
            <X size={13}/> Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ReportView() {
  const { reports, addToast } = useApp();
  const [preview, setPreview] = useState(null);

  const enriched = reports.map(r => {
    const scan    = allScans.find(s => s.id === r.scanId);
    const product = scan ? products.find(p => p.id === scan.productId) : null;
    return { ...r, scan, product };
  });

  const previewScan    = preview ? allScans.find(s => s.id === preview.scanId) : null;
  const previewProduct = previewScan ? products.find(p => p.id === previewScan.productId) : null;

  const handlePrint = (r) => {
    const scan    = allScans.find(s => s.id === r.scanId);
    const product = scan ? products.find(p => p.id === scan.productId) : null;
    if (!scan || !product) return;
    const html = buildReportHTML(r, scan, product);
    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 500);
    addToast(`${r.id} opened for print / PDF save.`, "success");
  };

  const handleDOC = (r) => {
    const scan    = allScans.find(s => s.id === r.scanId);
    const product = scan ? products.find(p => p.id === scan.productId) : null;
    if (!scan || !product) return;
    const html = buildReportHTML(r, scan, product);
    const blob = new Blob(['\ufeff' + html], { type: "application/msword" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `LabelGuard_${r.id}_${(product.name || "Report").replace(/[\s()]/g,"_")}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    addToast(`${r.id} exported as .doc`, "success");
  };

  return (
    <Layout title="Reports">
      <div className="max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-800 dark:text-slate-200">{reports.length}</span>{" "}
            compliance report{reports.length !== 1 ? "s" : ""} · PDF print &amp; DOC export available
          </p>
        </div>

        {reports.length === 0 ? (
          <div className="card p-16 text-center">
            <FileText size={36} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No reports yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Go to a scan result and click <strong>Generate Report</strong>.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="card overflow-hidden hidden md:block">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    {["Label", "Report ID", "Product", "Verdict", "Severity", "Date", "By", "Actions"].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {enriched.map(r => (
                    <tr key={r.id}
                        className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                      {/* Thumbnail */}
                      <td className="px-4 py-3">
                        {r.product?.labelImage ? (
                          <img src={r.product.labelImage} alt=""
                               className="w-10 h-14 object-cover rounded-md border border-slate-200 dark:border-slate-700 shadow-sm" />
                        ) : (
                          <div className="w-10 h-14 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <FileText size={14} className="text-slate-300" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-400">{r.id}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200 max-w-44 truncate">{r.productName}</td>
                      <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                      <td className="px-4 py-3"><StatusBadge status={r.severity === "None" ? "Pass" : r.severity} /></td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                        {new Date(r.generatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3 text-slate-500 max-w-28 truncate">{r.generatedBy}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => setPreview(r)}
                            className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg
                                       bg-navy-50 dark:bg-navy-950 text-navy-600 dark:text-navy-400
                                       hover:bg-navy-100 dark:hover:bg-navy-900 transition-colors font-medium">
                            <Eye size={10} /> Preview
                          </button>
                          <button
                            onClick={() => handlePrint(r)}
                            className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg
                                       bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300
                                       hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium">
                            <Printer size={10} /> PDF
                          </button>
                          <button
                            onClick={() => handleDOC(r)}
                            className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg
                                       bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300
                                       hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium">
                            <FileSpreadsheet size={10} /> DOC
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {enriched.map(r => (
                <div key={r.id} className="card p-4">
                  <div className="flex items-start gap-3 mb-3">
                    {r.product?.labelImage ? (
                      <img src={r.product.labelImage} alt=""
                           className="w-12 h-16 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0" />
                    ) : null}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{r.productName}</p>
                        <StatusBadge status={r.status} />
                      </div>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">{r.id}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(r.generatedAt).toLocaleDateString("en-IN")} · {r.generatedBy}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setPreview(r)} className="btn-secondary py-1.5 text-xs flex-1 justify-center">
                      <Eye size={11}/> Preview
                    </button>
                    <button onClick={() => handlePrint(r)} className="btn-secondary py-1.5 text-xs flex-1 justify-center">
                      <Printer size={11}/> PDF
                    </button>
                    <button onClick={() => handleDOC(r)} className="btn-secondary py-1.5 text-xs flex-1 justify-center">
                      <FileSpreadsheet size={11}/> DOC
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {preview && (
        <ReportModal
          report={preview}
          scan={previewScan}
          product={previewProduct}
          onClose={() => setPreview(null)}
        />
      )}
    </Layout>
  );
}
