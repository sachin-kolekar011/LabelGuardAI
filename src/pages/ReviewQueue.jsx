import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import { useApp } from "../context/AppContext";
import { products } from "../data/mockData";
import {
  Inbox, Filter, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, ArrowUpRight, MessageSquare, Eye
} from "lucide-react";

function ReviewRow({ scan, product, onApprove, onReject, onEscalate, onView }) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState("");
  const reviews = scan.verdicts.filter(v => v.status === "Review");
  const fails = scan.verdicts.filter(v => v.status === "Fail");

  return (
    <div className="card mb-3 overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 p-4 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{product?.name}</span>
            <StatusBadge status={scan.status} />
            <StatusBadge status={scan.severity} />
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            {scan.id} · {new Date(scan.timestamp).toLocaleString("en-IN")} · {scan.calibration === "A4" ? "A4-calibrated" : "Relative ratios"}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {reviews.length > 0 && <span className="badge-review">{reviews.length} fields to review</span>}
          {fails.length > 0 && <span className="badge-fail">{fails.length} fail{fails.length > 1 ? "s" : ""}</span>}
          <button onClick={e => { e.stopPropagation(); onView(); }} className="btn-secondary py-1 px-2">
            <Eye size={12} /> View
          </button>
          {expanded ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-800/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field summary */}
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Fields requiring attention</p>
              <div className="space-y-1.5">
                {scan.verdicts.filter(v => v.status !== "Pass").map(v => (
                  <div key={v.field} className="flex items-start gap-2 text-xs">
                    {v.status === "Fail" ? <XCircle size={12} className="text-red-500 mt-0.5 flex-shrink-0" /> : <ArrowUpRight size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />}
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-200">{v.field}</span>
                      <div className="text-slate-500 dark:text-slate-400">{v.reason}</div>
                      <div className="text-[10px] font-mono text-slate-400">{v.citation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review actions */}
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Reviewer notes</p>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add notes for audit trail…"
                rows={3}
                className="input-field text-xs resize-none mb-3"
              />
              <div className="flex flex-wrap gap-2">
                <button onClick={() => onApprove(scan.id, notes)} className="btn-primary py-1.5 text-xs">
                  <CheckCircle2 size={12} /> Approve
                </button>
                <button onClick={() => onReject(scan.id, notes)} className="btn-danger py-1.5 text-xs">
                  <XCircle size={12} /> Reject
                </button>
                <button onClick={() => onEscalate(scan.id)} className="btn-secondary py-1.5 text-xs">
                  <ArrowUpRight size={12} /> Escalate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReviewQueue() {
  const { scans, approveReviewScan, rejectScan, escalateScan, setActiveScan } = useApp();
  const navigate = useNavigate();
  const [severity, setSeverity] = useState("All");
  const [sortBy, setSortBy] = useState("date");

  const queue = scans.filter(s => s.status === "Needs Review" || (s.status === "Non-Compliant" && !s.reviewer));

  const filtered = queue
    .filter(s => severity === "All" || s.severity === severity)
    .sort((a, b) => {
      if (sortBy === "severity") {
        const order = { High: 0, Medium: 1, Low: 2, None: 3 };
        return (order[a.severity] || 3) - (order[b.severity] || 3);
      }
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

  const handleView = (scan) => {
    const product = products.find(p => p.id === scan.productId);
    setActiveScan({ ...scan, _productName: product?.name });
    navigate(`/result/${scan.id}`);
  };

  return (
    <Layout title="Review Queue">
      <div className="max-w-4xl">
        {/* Header controls */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white">{filtered.length}</span> scan{filtered.length !== 1 ? "s" : ""} awaiting review
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <select
              value={severity}
              onChange={e => setSeverity(e.target.value)}
              className="input-field w-auto py-1.5 text-xs"
            >
              {["All", "High", "Medium", "Low"].map(s => <option key={s}>{s}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="input-field w-auto py-1.5 text-xs"
            >
              <option value="date">Sort: Date</option>
              <option value="severity">Sort: Severity</option>
            </select>
          </div>
        </div>

        {/* Queue */}
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <Inbox size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No scans in queue</p>
            <p className="text-xs text-slate-400 mt-1">
              {severity !== "All" ? `No ${severity.toLowerCase()}-severity scans pending.` : "All scans have been reviewed."}
            </p>
          </div>
        ) : (
          filtered.map(scan => {
            const product = products.find(p => p.id === scan.productId);
            return (
              <ReviewRow
                key={scan.id}
                scan={scan}
                product={product}
                onApprove={approveReviewScan}
                onReject={rejectScan}
                onEscalate={escalateScan}
                onView={() => handleView(scan)}
              />
            );
          })
        )}
      </div>
    </Layout>
  );
}
