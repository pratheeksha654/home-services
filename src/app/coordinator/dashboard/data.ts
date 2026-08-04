import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  BriefcaseBusiness,
  ClipboardList,
} from "lucide-react";

export const dashboardStats = [
  {
    title: "Total Bookings",
    value: 126,
    icon: ClipboardList,
    color: "text-[#C8A55E]",
  },
  {
    title: "Pending Requests",
    value: 14,
    icon: Clock3,
    color: "text-orange-400",
  },
  {
    title: "Emergency",
    value: 8,
    icon: AlertTriangle,
    color: "text-red-400",
  },
  {
    title: "Active Services",
    value: 32,
    icon: BriefcaseBusiness,
    color: "text-indigo-400",
  },
  {
    title: "Completed",
    value: 72,
    icon: CheckCircle2,
    color: "text-green-400",
  },
  {
    title: "Today's Services",
    value: 18,
    icon: CalendarDays,
    color: "text-sky-400",
  },
];