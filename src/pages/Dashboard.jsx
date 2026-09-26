import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { products } from "../data/mockData";

import { violationsByCategory, complianceTimeline, severityDistribution, alerts } from "../data/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";
import { ScanLine, ShieldX, Clock, TrendingUp, AlertCircle, Zap, RefreshCw } from "lucide-react";

const COLORS = { High: "#ef4444", Medium: "#f59e0b", "Low (Review)": "#3b82f6", Compliant: "#10b981" };

function StatCard({ icon: Icon, label, value, sub, color = "navy" }) {
  const clr = { navy: "bg-navy-50 dark:bg-navy-950 text-navy-600 dark:text-navy-400", emerald: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400", red: "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400", amber: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400" };
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</div>
          {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
        </div>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${clr[color]}`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function AlertRow({ alert }) {
  const iconMap = { violation: <ShieldX size={14} className="text-red-500" />, amendment: <Zap size={14} className="text-blue-500" />, review: <Clock size={14} className="text-amber-500" /> };
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="mt-0.5 flex-shrink-0">{iconMap[alert.type] || <AlertCircle size={14} />}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">{alert.message}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">{alert.time}</p>
      </div>
      <StatusBadge status={alert.severity} />
    </div>
  );
}

export default function Dashboard() {
  const { scans, role, setActiveScan } = useApp();
  const navigate = useNavigate();

  const handleScanClick = (scan) => {
    const product = products.find(p => p.id === scan.productId);
    setActiveScan({ ...scan, _productName: product?.name });
    navigate(`/result/${scan.id}`);
  };

  const total = scans.length;
  const compliant = scans.filter(s => s.status === "Compliant").length;
  const pending = scans.filter(s => s.status === "Needs Review" && !s.reviewer).length;
  const high = scans.filter(s => s.severity === "High").length;
  const passRate = Math.round((compliant / total) * 100);

  const recent = [...scans].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 6);

  return (
    <Layout title="Dashboard with jenkins and automated the versions">
      <div className="space-y-5 max-w-7xl">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={ScanLine} label="Total Scans" value={total} sub="last 30 days" color="navy" />
          <StatCard icon={TrendingUp} label="Pass Rate" value={`${passRate}%`} sub={`${compliant} compliant`} color="emerald" />
          <StatCard icon={Clock} label="Pending Review" value={pending} sub="awaiting human review" color="amber" />
          <StatCard icon={ShieldX} label="High-Severity" value={high} sub="violations found" color="red" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Bar chart */}
          <div className="card p-5 lg:col-span-1">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">Violations by Field</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={violationsByCategory} layout="vertical" margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={90} stroke="#94a3b8" />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Bar dataKey="count" fill="#2541e8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line chart */}
          <div className="card p-5 lg:col-span-1">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">Compliance Rate Trend</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={complianceTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis domain={[60, 100]} tick={{ fontSize: 10 }} stroke="#94a3b8" unit="%" />
                <Tooltip formatter={v => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: "#10b981" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div className="card p-5 lg:col-span-1">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">Severity Distribution</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={severityDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {severityDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent scans */}
          <div className="card p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Recent Scans</div>
              <button onClick={() => navigate("/repository")} className="text-xs text-navy-600 dark:text-navy-400 hover:underline font-medium">View all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="text-left pb-2 font-medium text-slate-400">Product</th>
                    <th className="text-left pb-2 font-medium text-slate-400">Date</th>
                    <th className="text-left pb-2 font-medium text-slate-400">Status</th>
                    <th className="text-left pb-2 font-medium text-slate-400">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map(scan => {
                    const product = products.find(p => p.id === scan.productId);
                    return (
                      <tr
                        key={scan.id}
                        className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer"
                        onClick={() => handleScanClick(scan)}
                      >
                        <td className="py-2 pr-3 font-medium text-slate-700 dark:text-slate-200">{product?.name}</td>
                        <td className="py-2 pr-3 text-slate-400">{new Date(scan.timestamp).toLocaleDateString("en-IN")}</td>
                        <td className="py-2 pr-3"><StatusBadge status={scan.status} /></td>
                        <td className="py-2"><StatusBadge status={scan.severity === "None" ? "Pass" : scan.severity} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alerts */}
          <div className="card p-5">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">Recent Alerts</div>
            <div>{alerts.map(a => <AlertRow key={a.id} alert={a} />)}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
