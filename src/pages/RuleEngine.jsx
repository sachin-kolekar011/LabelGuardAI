import { useState } from "react";
import Layout from "../components/Layout";
import { rules } from "../data/mockData";
import { BookOpen, ChevronDown, ChevronUp, CheckCircle2, Clock, Shield } from "lucide-react";

function RuleCard({ rule }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="card mb-3 overflow-hidden">
      <div
        className="flex items-start gap-4 p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="w-9 h-9 rounded-lg bg-navy-50 dark:bg-navy-950 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Shield size={16} className="text-navy-600 dark:text-navy-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{rule.name}</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${rule.status === "Active" ? "badge-pass" : "badge-info"}`}>
              {rule.status === "Active" ? <CheckCircle2 size={9} /> : <Clock size={9} />} {rule.status}
            </span>
          </div>
          <p className="text-xs font-mono text-navy-600 dark:text-navy-400">{rule.citation}</p>
          <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400">
            <span>Effective: {new Date(rule.effectiveDate).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</span>
            {rule.amendedDate && <span>Last amended: {new Date(rule.amendedDate).toLocaleDateString("en-IN", { year: "numeric", month: "short" })}</span>}
          </div>
        </div>
        {expanded ? <ChevronUp size={15} className="text-slate-400 flex-shrink-0 mt-1" /> : <ChevronDown size={15} className="text-slate-400 flex-shrink-0 mt-1" />}
      </div>

      {expanded && (
        <div className="border-t border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-800/30">
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{rule.description}</p>
          <div>
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Version History</p>
            <div className="space-y-2">
              {rule.versions.map((v, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs">
                  <div className="relative flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full mt-1 ${i === 0 ? "bg-navy-500" : "bg-slate-300 dark:bg-slate-600"}`} />
                    {i < rule.versions.length - 1 && <div className="absolute left-[3px] top-3 w-px h-5 bg-slate-200 dark:bg-slate-700" />}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-snug pb-1">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RuleEngine() {
  const [filter, setFilter] = useState("All");
  const filtered = rules.filter(r => filter === "All" || r.status === filter);

  return (
    <Layout title="Rule Engine">
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {rules.filter(r => r.status === "Active").length} active rules · LMPC 2011 and amendments
            </p>
          </div>
          <div className="flex items-center gap-2">
            {["All", "Active"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${filter === f ? "bg-navy-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.map(rule => <RuleCard key={rule.id} rule={rule} />)}

        <div className="card p-4 mt-4 bg-navy-50 dark:bg-navy-950/30 border-navy-100 dark:border-navy-900">
          <div className="flex items-start gap-3">
            <BookOpen size={15} className="text-navy-600 dark:text-navy-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-navy-800 dark:text-navy-200 mb-0.5">Rule management — read-only in prototype</p>
              <p className="text-xs text-navy-700 dark:text-navy-400">In production, the Admin role can add new rule versions, set effective dates, and retire superseded rules. All historical verdicts remain linked to the rule version active at scan time.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
