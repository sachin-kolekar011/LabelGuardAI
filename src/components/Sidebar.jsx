import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  LayoutDashboard, Upload, ClipboardList, Inbox,
  FileText, BookOpen, Settings, ShieldCheck, X, LogOut
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Regulator", "Manufacturer", "Marketplace", "Admin"] },
  { to: "/scan", label: "Scan & Upload", icon: Upload, roles: ["Regulator", "Manufacturer", "Marketplace", "Admin"] },
  { to: "/review", label: "Review Queue", icon: Inbox, roles: ["Regulator", "Admin"] },
  { to: "/repository", label: "Repository", icon: ClipboardList, roles: ["Regulator", "Manufacturer", "Admin"] },
  { to: "/reports", label: "Reports", icon: FileText, roles: ["Regulator", "Manufacturer", "Marketplace", "Admin"] },
  { to: "/rules", label: "Rule Engine", icon: BookOpen, roles: ["Admin", "Regulator"] },
  { to: "/settings", label: "Settings", icon: Settings, roles: ["Regulator", "Manufacturer", "Marketplace", "Admin"] },
];

export default function Sidebar() {
  const { role, sidebarOpen, setSidebarOpen } = useApp();
  const navigate = useNavigate();

  const visible = navItems.filter(n => n.roles.includes(role));

  return (
    <>
      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        z-40 flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:h-auto md:flex
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-navy-600 rounded-lg flex items-center justify-center">
              <ShieldCheck size={16} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white leading-none">LabelGuard</div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wide">AI · SIH 2026</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {visible.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "sidebar-item-active" : "sidebar-item-inactive"}`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Role pill */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-50 dark:bg-navy-950">
            <div className="w-6 h-6 rounded-full bg-navy-600 flex items-center justify-center text-white text-[10px] font-bold">{role[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-navy-700 dark:text-navy-300 truncate">{role}</div>
              <div className="text-[10px] text-slate-400 truncate">Active role</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
