import { useApp } from "../context/AppContext";
import { Moon, Sun, Bell, Menu, ChevronDown } from "lucide-react";
import { useState } from "react";
import { users } from "../data/mockData";

export default function Topbar({ title }) {
  const { dark, toggleDark, role, switchRole, currentUser, setSidebarOpen, scans } = useApp();
  const [roleOpen, setRoleOpen] = useState(false);

  const pending = scans.filter(s => s.status === "Needs Review" && !s.reviewer).length;

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-3 flex items-center gap-3">
      {/* Mobile hamburger */}
      <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-500 hover:text-slate-700 dark:hover:text-slate-200">
        <Menu size={20} />
      </button>

      <h1 className="flex-1 text-base font-semibold text-slate-900 dark:text-white truncate">{title}</h1>

      {/* Role switcher */}
      <div className="relative">
        <button
          onClick={() => setRoleOpen(o => !o)}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {role}
          <ChevronDown size={12} />
        </button>
        {roleOpen && (
          <div className="absolute right-0 mt-1 w-44 card shadow-lg py-1 z-50">
            {["Regulator", "Manufacturer", "Marketplace", "Admin"].map(r => (
              <button
                key={r}
                onClick={() => { switchRole(r); setRoleOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${r === role ? "text-navy-600 dark:text-navy-400 bg-navy-50 dark:bg-navy-950" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notifications */}
      <button className="relative text-slate-500 hover:text-slate-700 dark:hover:text-slate-200">
        <Bell size={18} />
        {pending > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{pending}</span>
        )}
      </button>

      {/* Dark toggle */}
      <button onClick={toggleDark} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-200">
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* User avatar */}
      <div className="w-7 h-7 rounded-full bg-navy-600 flex items-center justify-center text-white text-xs font-bold">
        {currentUser.name[0]}
      </div>
    </header>
  );
}
