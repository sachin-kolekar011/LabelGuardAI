import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";

const roles = [
  { id: "Regulator", label: "Regulator", desc: "Legal Metrology inspector — full enforcement access" },
  { id: "Manufacturer", label: "Manufacturer", desc: "Brand / production team — own product scans only" },
  { id: "Marketplace", label: "Marketplace", desc: "E-commerce platform — risk monitoring & reports" },
  { id: "Admin", label: "Admin", desc: "System administrator — rule management & all data" },
];

export default function Login() {
  const { switchRole } = useApp();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("Regulator");
  const [email, setEmail] = useState("inspector@legalmetrology.gov.in");
  const [password, setPassword] = useState("••••••••");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    switchRole(selectedRole);
    setTimeout(() => { setLoading(false); navigate("/dashboard"); }, 900);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="w-full max-w-md relative">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-navy-600 rounded-2xl mb-4 shadow-xl">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">LabelGuard AI</h1>
          <p className="text-navy-300 text-sm mt-1">Legal Metrology Compliance Platform</p>
          <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-navy-800/60 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-navy-300">SIH 2026 · Problem Statement 26034</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-navy-300 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/15 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-navy-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/15 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-navy-400 pr-9"
                />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-2.5 top-2.5 text-white/40 hover:text-white/70">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-xs font-medium text-navy-300 mb-2">Sign in as</label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(r.id)}
                    className={`text-left px-3 py-2.5 rounded-lg border transition-all text-xs ${
                      selectedRole === r.id
                        ? "border-navy-400 bg-navy-600/40 text-white"
                        : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    <div className="font-semibold">{r.label}</div>
                    <div className="text-[10px] opacity-70 mt-0.5 leading-tight">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-navy-600 hover:bg-navy-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</>
              ) : "Sign in to LabelGuard"}
            </button>
          </form>

          <p className="text-center text-[11px] text-white/30 mt-4">
            Prototype build · Grand Theft Code · SIH 2026
          </p>
        </div>
      </div>
    </div>
  );
}
