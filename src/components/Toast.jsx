import { useApp } from "../context/AppContext";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const icons = {
  success: <CheckCircle2 size={16} className="text-emerald-500" />,
  error: <XCircle size={16} className="text-red-500" />,
  info: <Info size={16} className="text-blue-500" />,
};

export default function ToastContainer() {
  const { toasts } = useApp();
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className="card shadow-lg px-4 py-3 flex items-center gap-3 min-w-64 max-w-80 animate-in slide-in-from-right">
          {icons[t.type] || icons.info}
          <span className="text-sm text-slate-700 dark:text-slate-200 flex-1">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
