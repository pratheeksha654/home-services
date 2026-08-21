"use client";

import React from "react";
import { useNotifications, Notification } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Clock, 
  ArrowRight,
  Sparkles,
  Inbox,
  Eye
} from "lucide-react";

function formatRelativeTime(dateString: string) {
  try {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return "just now";
    
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

const getBadgeForNotification = (n: Notification) => {
  const isEmergency = n.type === "unhandled_emergency" || 
                      n.type === "emergency_created" || 
                      n.type === "emergency" || 
                      n.title?.toLowerCase().includes("emergency");
  if (isEmergency) {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 font-inter">
        Emergency
      </span>
    );
  }
  if (n.type === "job_completed" || n.type === "service_completed") {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-inter">
        Completion
      </span>
    );
  }
  return null;
};

export default function NotificationsDashboard() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
  const { user } = useAuth();
  
  const role = user?.role?.toUpperCase() || "";

  const getIconForType = (type: string) => {
    switch (type) {
      case "booking_created":
      case "emergency_created":
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case "job_completed":
      case "application_approved":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case "booking_cancelled":
      case "application_rejected":
        return <Trash2 className="w-5 h-5 text-rose-400" />;
      case "travel_started":
      case "tech_arrived":
      case "tech_assigned":
      case "job_assigned":
        return <Clock className="w-5 h-5 text-blue-400" />;
      default:
        return <Bell className="w-5 h-5 text-[#C8A55E]" />;
    }
  };

  const getDeepLink = (notification: Notification) => {
    const bookingId = notification.bookingId;
    if (!bookingId) return null;

    if (role === "CUSTOMER") {
      if (notification.type?.includes("emergency")) {
        return "/customer/track-booking";
      }
      return `/customer/tracking/${bookingId}`;
    }
    if (role === "COORDINATOR") {
      if (notification.type?.includes("emergency")) {
        return "/coordinator/emergency-requests";
      }
      return "/coordinator/assign-technician";
    }
    if (role === "TECHNICIAN") {
      return "/technician/activejobs";
    }
    if (role === "ADMIN") {
      return "/admin/dashboard";
    }
    return null;
  };

  // Sort notifications: unread first, then latest first
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen bg-[#0A0B10] text-[#ECEDF0] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 bg-[#14161E]/40 p-6 rounded-2xl border border-[rgba(255,255,255,0.06)] backdrop-blur-md">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-outfit text-white flex items-center gap-3">
              Notifications
              {unreadCount > 0 && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-inter">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-sm text-[#9CA0AE] mt-1 font-inter">
              Stay updated on service requests, assignments, and job updates.
            </p>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-[#C8A55E] via-[#E4D5A8] to-[#C8A55E] text-[#08090D] hover:opacity-90 transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 self-start sm:self-center"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#14161E]/20 rounded-2xl border border-[rgba(255,255,255,0.04)]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C8A55E]"></div>
            <p className="text-sm text-[#9CA0AE] mt-4 font-inter">Loading notifications...</p>
          </div>
        ) : sortedNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#14161E]/20 rounded-2xl border border-[rgba(255,255,255,0.04)] text-center p-6">
            <div className="w-16 h-16 rounded-2xl bg-[#14161E]/60 border border-[rgba(255,255,255,0.06)] flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-[#5C6070]" />
            </div>
            <h3 className="text-lg font-semibold text-white font-outfit">All caught up!</h3>
            <p className="text-sm text-[#9CA0AE] max-w-sm mt-1 font-inter">
              You don&apos;t have any notifications at the moment. We&apos;ll alert you when something happens.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedNotifications.map((n) => {
              const deepLink = getDeepLink(n);
              return (
                <div
                  key={n.id}
                  className={`relative flex gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                    n.isRead
                      ? "bg-[#14161E]/20 border-[rgba(255,255,255,0.04)] hover:bg-[#14161E]/30"
                      : "bg-[#14161E]/60 border-[rgba(200,165,94,0.15)] hover:border-[rgba(200,165,94,0.25)] shadow-md shadow-amber-500/[0.02]"
                  }`}
                >
                  {/* Status Indicator Dot */}
                  {!n.isRead && (
                    <span className="absolute top-5 right-5 h-2 w-2 rounded-full bg-red-500" />
                  )}

                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#14161E] border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
                    {getIconForType(n.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-white font-outfit truncate">
                        {n.title}
                      </h4>
                      {getBadgeForNotification(n)}
                      <span className="text-[10px] text-[#5C6070] font-inter">
                        {formatRelativeTime(n.createdAt)}
                      </span>
                    </div>
                    
                    <p className="text-xs text-[#9CA0AE] mt-1 leading-relaxed font-inter">
                      {n.message}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-4">
                      {deepLink && (
                        <Link
                          href={deepLink}
                          className="flex items-center gap-1.5 text-xs text-[#C8A55E] hover:underline font-semibold"
                        >
                          View Details
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      
                      {!n.isRead && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="flex items-center gap-1 text-[11px] text-[#9CA0AE] hover:text-white transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
