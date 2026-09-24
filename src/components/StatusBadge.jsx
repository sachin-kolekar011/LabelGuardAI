import { CheckCircle2, XCircle, AlertTriangle, Clock } from "lucide-react";

export default function StatusBadge({ status, size = "sm" }) {
  const map = {
    "Pass": { cls: "badge-pass", icon: <CheckCircle2 size={10} />, label: "Pass" },
    "Compliant": { cls: "badge-pass", icon: <CheckCircle2 size={10} />, label: "Compliant" },
    "Fail": { cls: "badge-fail", icon: <XCircle size={10} />, label: "Fail" },
    "Non-Compliant": { cls: "badge-fail", icon: <XCircle size={10} />, label: "Non-Compliant" },
    "Review": { cls: "badge-review", icon: <AlertTriangle size={10} />, label: "Review" },
    "Needs Review": { cls: "badge-review", icon: <AlertTriangle size={10} />, label: "Needs Review" },
    "None": { cls: "badge-info", icon: null, label: "—" },
    "High": { cls: "badge-fail", icon: null, label: "High" },
    "Medium": { cls: "badge-review", icon: null, label: "Medium" },
    "Low": { cls: "badge-info", icon: null, label: "Low" },
  };
  const cfg = map[status] || { cls: "badge-info", icon: null, label: status };
  return <span className={cfg.cls}>{cfg.icon}{cfg.label}</span>;
}

export function SeverityBadge({ severity }) {
  return <StatusBadge status={severity} />;
}
