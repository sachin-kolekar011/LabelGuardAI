import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ScanUpload from "./pages/ScanUpload";
import ScanResult from "./pages/ScanResult";
import ReviewQueue from "./pages/ReviewQueue";
import Repository from "./pages/Repository";
import ReportView from "./pages/ReportView";
import RuleEngine from "./pages/RuleEngine";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scan" element={<ScanUpload />} />
          <Route path="/result/:id" element={<ScanResult />} />
          <Route path="/review" element={<ReviewQueue />} />
          <Route path="/repository" element={<Repository />} />
          <Route path="/reports" element={<ReportView />} />
          <Route path="/rules" element={<RuleEngine />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
