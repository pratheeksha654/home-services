import type { RequestStatus, Priority } from "@/app/types/coordinator";

// ── Status Badge ──────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<RequestStatus, string> = {
  Pending:
    "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  Assigned:
    "border-blue-500/20 bg-blue-500/10 text-blue-400",
  "In Progress":
    "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
  Resolved:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
};

const STATUS_DOTS: Record<RequestStatus, string> = {
  Pending: "bg-yellow-400",
  Assigned: "bg-blue-400",
  "In Progress": "bg-indigo-400",
  Resolved: "bg-emerald-400",
};

interface StatusBadgeProps {
  status: RequestStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOTS[status]}`} />
      {status}
    </span>
  );
}

// ── Priority Badge ────────────────────────────────────────────────────────────

const PRIORITY_STYLES: Record<Priority, string> = {
  Critical: "border-red-500/20 bg-red-500/10 text-red-400",
  High: "border-orange-500/20 bg-orange-500/10 text-orange-400",
  Medium: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  Low: "border-green-500/20 bg-green-500/10 text-green-400",
};

const PRIORITY_ICONS: Record<Priority, string> = {
  Critical: "🔴",
  High: "🟠",
  Medium: "🟡",
  Low: "🟢",
};

interface PriorityBadgeProps {
  priority: Priority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${PRIORITY_STYLES[priority]}`}
    >
      <span>{PRIORITY_ICONS[priority]}</span>
      {priority}
    </span>
  );
}
