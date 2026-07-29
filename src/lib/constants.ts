import {
  AlertTriangle,
  BadgeCheck,
  CalendarClock,
  Clock3,
  History,
  MapPin,
  ShieldCheck,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const appName = "FieldFlow";

export interface HeroHighlight {
  title: string;
  icon: LucideIcon;
}

export interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export interface BookingSummary {
  service: string;
  status: string;
  technician: string;
  estimatedArrival: string;
  estimatedCost: string;
  inspectionPending: boolean;
}

export interface RecentBooking {
  id: number;
  service: string;
  date: string;
  status: string;
  estimatedPrice: string;
}

export const heroHighlights: HeroHighlight[] = [
  { title: "Verified Professionals", icon: ShieldCheck },
  { title: "Transparent Pricing", icon: BadgeCheck },
  { title: "Fast Emergency Support", icon: Clock3 },
];

export const quickActions: QuickAction[] = [
  {
    title: "Book Service",
    description: "Schedule a repair, installation, or maintenance visit",
    href: "/booking",
    icon: Sparkles,
  },
  {
    title: "Emergency Booking",
    description: "Get urgent help when the issue needs immediate attention",
    href: "/emergency-booking",
    icon: AlertTriangle,
  },
  {
    title: "Track Booking",
    description: "Watch your technician’s live arrival and service progress",
    href: "/track-booking",
    icon: MapPin,
  },
  {
    title: "Booking History",
    description: "Review past appointments and service outcomes",
    href: "/booking-history",
    icon: History,
  },
];

export const timelineSteps = [
  "Choose Service",
  "Book Service",
  "Technician Assigned",
  "Technician Arrives",
  "Service Completed",
];

export const currentBooking: BookingSummary = {
  service: "AC Installation",
  status: "In Progress",
  technician: "Ravi Sharma",
  estimatedArrival: "Today • 3:30 PM",
  estimatedCost: "₹4,850",
  inspectionPending: false,
};

export const recentBookings: RecentBooking[] = [
  {
    id: 1,
    service: "Plumbing Repair",
    date: "Jul 24, 2026",
    status: "Completed",
    estimatedPrice: "₹1,240",
  },
  {
    id: 2,
    service: "Electrician Visit",
    date: "Jul 18, 2026",
    status: "Scheduled",
    estimatedPrice: "₹980",
  },
  {
    id: 3,
    service: "Deep Cleaning",
    date: "Jul 11, 2026",
    status: "Pending",
    estimatedPrice: "₹1,600",
  },
];

export const pricingNotice = {
  title: "Transparent pricing",
  text: "Some services have fixed pricing while others require inspection. Final quotations are shared after review.",
};

export const supportPillars = [
  { title: "Flexible Scheduling", icon: CalendarClock },
  { title: "On-time Techs", icon: Wrench },
];
