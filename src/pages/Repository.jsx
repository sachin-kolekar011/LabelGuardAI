import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import { useApp } from "../context/AppContext";
import { products } from "../data/mockData";
import { Search, Filter, Database, ChevronRight } from "lucide-react";

export default function Repository() {
  const { scans, setActiveScan } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [severity, setSeverity] = useState("All");

  const categories = ["All", ...new Set(products.map(p => p.category))];

  const filtered = scans.filter(scan => {
    const product = products.find(p => p.id === scan.productId);
    const matchQ = !query || product?.name.toLowerCase().includes(query.toLowerCase()) || product?.brand.toLowerCase().includes(query.toLowerCase()) || scan.id.toLowerCase().includes(query.toLowerCase());
    const matchS = status === "All" || scan.status === status;
    const matchC = category === "All" || product?.category === category;
    const matchSev = severity === "All" || scan.severity === severity;
    return matchQ && matchS && matchC && matchSev;
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const handleRowClick = (scan) => {
    const product = products.find(p => p.id === scan.productId);
    setActiveScan({ ...scan, _productName: product?.name });
    navigate(`/result/${scan.id}`);
  };

  return (
    <Layout title="Repository">
      <div className="max-w-6xl">
        {/* Filters */}
        <div className="card p-4 mb-5">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-48 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search product, brand, scan ID…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="input-field pl-8 text-xs"
              />
            </div>
            <select value={status} onChange={e => setStatus(e.target.value)} className="input-field w-auto text-xs">
              {["All", "Compliant", "Non-Compliant", "Needs Review"].map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={category} onChange={e => setCategory(e.target.value)} className="input-field w-auto text-xs">
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={severity} onChange={e => setSeverity(e.target.value)} className="input-field w-auto text-xs">
              {["All", "High", "Medium", "Low", "None"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <p className="text-xs text-slate-400 mt-2">{filtered.length} record{filtered.length !== 1 ? "s" : ""} found</p>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <Database size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No records match your filters</p>
            <button onClick={() => { setQuery(""); setStatus("All"); setCategory("All"); setSeverity("All"); }} className="text-xs text-navy-600 dark:text-navy-400 hover:underline mt-2">Clear all filters</button>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="card overflow-hidden hidden md:block">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    {["", "Scan ID", "Product", "Category", "Date", "Calibration", "Status", "Severity", "Reviewer", ""].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(scan => {
                    const product = products.find(p => p.id === scan.productId);
                    return (
                      <tr
                        key={scan.id}
                        onClick={() => handleRowClick(scan)}
                        className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3">
                          {product?.labelImage ? (
                            <img src={product.labelImage} alt="" className="w-8 h-11 object-cover rounded border border-slate-200 dark:border-slate-700" />
                          ) : (
                            <div className="w-8 h-11 rounded bg-slate-100 dark:bg-slate-800" />
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-400">{scan.id}</td>
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 max-w-40 truncate">{product?.name}</td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{product?.category}</td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{new Date(scan.timestamp).toLocaleDateString("en-IN")}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-medium ${scan.calibration === "A4" ? "text-navy-600 dark:text-navy-400" : "text-amber-600 dark:text-amber-400"}`}>
                            {scan.calibration}
                          </span>
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={scan.status} /></td>
                        <td className="px-4 py-3"><StatusBadge status={scan.severity === "None" ? "Pass" : scan.severity} /></td>
                        <td className="px-4 py-3 text-slate-400">{scan.reviewer || "—"}</td>
                        <td className="px-4 py-3"><ChevronRight size={14} className="text-slate-300 dark:text-slate-600" /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {filtered.map(scan => {
                const product = products.find(p => p.id === scan.productId);
                return (
                  <div key={scan.id} onClick={() => handleRowClick(scan)} className="card p-4 cursor-pointer hover:border-navy-200 dark:hover:border-navy-800 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{product?.name}</p>
                        <p className="text-[10px] font-mono text-slate-400">{scan.id}</p>
                      </div>
                      <StatusBadge status={scan.status} />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-slate-400">{new Date(scan.timestamp).toLocaleDateString("en-IN")}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <StatusBadge status={scan.severity === "None" ? "Pass" : scan.severity} />
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-400">{scan.calibration}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
