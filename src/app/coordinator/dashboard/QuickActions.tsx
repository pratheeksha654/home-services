"use client";

import {
  AlertTriangle,
  UserPlus,
  CalendarDays,
  ClipboardList,
  UserCheck,
  Heart,
} from "lucide-react";

import QuickActionCard from "./QuickActionCard";

const actions = [
  {
    title: "Assign Technician",
    description:
      "Assign available technicians to pending service requests.",
    href: "/coordinator/assign-technician",
    icon: UserPlus,
    color: "bg-[#6366F1]",
  },
  {
    title: "Emergency Requests",
    description:
      "View high-priority emergency requests requiring immediate attention.",
    href: "/coordinator/emergency-requests",
    icon: AlertTriangle,
    color: "bg-red-500",
  },
  {
    title: "Phone / Elderly Booking",
    description:
      "Create phone-assisted elderly care bookings with special care instructions.",
    href: "/coordinator/elderly-booking",
    icon: Heart,
    color: "bg-rose-500",
  },
  {
    title: "Technician Applications",
    description:
      "Review, approve or reject pending technician registration forms.",
    href: "/coordinator/applications",
    icon: UserCheck,
    color: "bg-purple-600",
  },
];

export default function QuickActions() {
  return (
    <section className="mt-14">

      <h2 className="text-2xl font-bold text-[#ECEDF0]">
        Quick Actions
      </h2>

      <p className="mt-2 text-[#9CA0AE]">
        Quickly navigate to frequently used coordinator tools.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {actions.map((action) => (
          <QuickActionCard
            key={action.title}
            {...action}
          />
        ))}

      </div>

    </section>
  );
}