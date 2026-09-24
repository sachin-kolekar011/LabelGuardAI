import Layout from "../components/Layout";
import { useApp } from "../context/AppContext";
import { users } from "../data/mockData";
import { Moon, Sun, Shield, User, Building2, ToggleLeft, ToggleRight } from "lucide-react";

export default function Settings() {
  const { dark, toggleDark, currentUser, role, switchRole, addToast } = useApp();

  return (
    <Layout title="Settings">
      <div className="max-w-xl space-y-5">
        {/* Profile */}
        <div className="card p-5">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">Account</p>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-navy-600 flex items-center justify-center text-white text-lg font-bold">
              {currentUser.name[0]}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{currentUser.name}</p>
              <p className="text-xs text-slate-500">{currentUser.designation}</p>
              <p className="text-xs text-slate-400">{currentUser.dept}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={13} className="text-navy-500" />
            <span className="text-xs font-medium text-navy-600 dark:text-navy-400">Active role: {role}</span>
          </div>
        </div>

        {/* Role switcher */}
        <div className="card p-5">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">Switch Role</p>
          <div className="grid grid-cols-2 gap-2">
            {users.map(u => (
              <button
                key={u.id}
                onClick={() => switchRole(u.role)}
                className={`text-left p-3 rounded-xl border transition-all ${u.role === role ? "border-navy-300 dark:border-navy-600 bg-navy-50 dark:bg-navy-950/40" : "border-slate-200 dark:border-slate-700 hover:border-navy-200 dark:hover:border-navy-800 hover:bg-slate-50 dark:hover:bg-slate-800/30"}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${u.role === role ? "bg-navy-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                    {u.role[0]}
                  </div>
                  <span className={`text-xs font-semibold ${u.role === role ? "text-navy-700 dark:text-navy-300" : "text-slate-700 dark:text-slate-300"}`}>{u.role}</span>
                </div>
                <p className="text-[10px] text-slate-400 ml-8 leading-tight">{u.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div className="card p-5">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">Appearance</p>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              {dark ? <Moon size={16} className="text-navy-500" /> : <Sun size={16} className="text-amber-500" />}
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{dark ? "Dark mode" : "Light mode"}</p>
                <p className="text-xs text-slate-400">Toggle interface theme</p>
              </div>
            </div>
            <button onClick={toggleDark}>
              {dark
                ? <ToggleRight size={28} className="text-navy-600 dark:text-navy-400" />
                : <ToggleLeft size={28} className="text-slate-300 dark:text-slate-600" />
              }
            </button>
          </div>
        </div>

        {/* About */}
        <div className="card p-5 bg-slate-50 dark:bg-slate-800/30">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">About</p>
          <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex justify-between"><span>Product</span><span className="font-medium text-slate-700 dark:text-slate-300">LabelGuard AI</span></div>
            <div className="flex justify-between"><span>Build</span><span className="font-medium text-slate-700 dark:text-slate-300">Prototype v1.0</span></div>
            <div className="flex justify-between"><span>Hackathon</span><span className="font-medium text-slate-700 dark:text-slate-300">SIH 2026</span></div>
            <div className="flex justify-between"><span>Problem Statement</span><span className="font-medium text-slate-700 dark:text-slate-300">26034</span></div>
            <div className="flex justify-between"><span>Team</span><span className="font-medium text-slate-700 dark:text-slate-300">Grand Theft Code</span></div>
            <div className="flex justify-between"><span>Regulatory basis</span><span className="font-medium text-slate-700 dark:text-slate-300">LMPC Rules 2011</span></div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
