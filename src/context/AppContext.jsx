import { createContext, useContext, useState } from "react";
import { scans as initialScans, reports as initialReports, users } from "../data/mockData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [role, setRole] = useState("Regulator");
  const [currentUser, setCurrentUser] = useState(users[0]);
  const [dark, setDark] = useState(false);
  const [scans, setScans] = useState(initialScans);
  const [reports, setReports] = useState(initialReports);
  const [toasts, setToasts] = useState([]);
  const [activeScan, setActiveScan] = useState(null);
  const [uploadedLabelImage, setUploadedLabelImage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleDark = () => {
    setDark(d => {
      document.documentElement.classList.toggle("dark", !d);
      return !d;
    });
  };

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  const approveReviewScan = (scanId, notes) => {
    setScans(prev => prev.map(s => s.id === scanId ? { ...s, status: "Compliant", severity: "None", reviewer: currentUser.name, notes } : s));
    addToast("Scan approved and marked compliant.", "success");
  };

  const rejectScan = (scanId, notes) => {
    setScans(prev => prev.map(s => s.id === scanId ? { ...s, status: "Non-Compliant", reviewer: currentUser.name, notes } : s));
    addToast("Scan rejected — marked non-compliant.", "error");
  };

  const escalateScan = (scanId) => {
    addToast("Scan escalated to senior reviewer.", "info");
  };

  const generateReport = (scan) => {
    const exists = reports.find(r => r.scanId === scan.id);
    if (exists) { addToast("Report already exists for this scan.", "info"); return; }
    const newReport = {
      id: `RPT${String(reports.length + 10).padStart(3, "0")}`,
      scanId: scan.id,
      productName: scan._productName,
      generatedAt: new Date().toISOString(),
      status: scan.status,
      severity: scan.severity,
      generatedBy: currentUser.name,
    };
    setReports(prev => [newReport, ...prev]);
    addToast("Compliance report generated.", "success");
  };

  const switchRole = (newRole) => {
    const user = users.find(u => u.role === newRole) || users[0];
    setRole(newRole);
    setCurrentUser(user);
    addToast(`Switched to ${newRole} role.`, "info");
  };

  return (
    <AppContext.Provider value={{
      role, currentUser, switchRole,
      dark, toggleDark,
      scans, setScans,
      reports, generateReport,
      toasts, addToast,
      activeScan, setActiveScan,
      uploadedLabelImage, setUploadedLabelImage,
      sidebarOpen, setSidebarOpen,
      approveReviewScan, rejectScan, escalateScan,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
