"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./auth-context";
import EmergencyModal from "@/components/emergency-modal";

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  bookingId?: string;
  createdAt: string;
  updatedAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  activeEmergencyModal: Notification | null;
  setActiveEmergencyModal: (notification: Notification | null) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user, getToken } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeEmergencyModal, setActiveEmergencyModal] = useState<Notification | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  
  // Track seen emergency notifications in memory during the session to avoid prompting repeatedly
  const seenEmergenciesRef = useRef<Set<string>>(new Set());

  const fetchNotifications = useCallback(async (showLoading = false) => {
    const token = getToken();
    if (!token || !user) {
      setNotifications([]);
      return;
    }

    if (showLoading) setLoading(true);
    try {
      const res = await fetch(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const result = await res.json();
        const newNotifications = result.data?.notifications || [];
        setNotifications(newNotifications);

        // Check for new unread emergency notifications
        const unreadEmergencies = newNotifications.filter(
          (n: Notification) =>
            !n.isRead &&
            (n.type === "emergency_created" || n.type === "emergency" || n.title?.toLowerCase().includes("emergency"))
        );

        if (unreadEmergencies.length > 0) {
          // Find the first emergency we haven't seen in this session yet
          const unseenEmergency = unreadEmergencies.find((n: Notification) => !seenEmergenciesRef.current.has(n.id));
          if (unseenEmergency) {
            seenEmergenciesRef.current.add(unseenEmergency.id);
            setActiveEmergencyModal(unseenEmergency);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [API_URL, getToken, user]);

  // Initial fetch on mount or user change
  useEffect(() => {
    if (user) {
      fetchNotifications(true);
      
      // Set up polling every 10 seconds
      const interval = setInterval(() => {
        fetchNotifications(false);
      }, 10000);

      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setActiveEmergencyModal(null);
      seenEmergenciesRef.current.clear();
    }
  }, [user, fetchNotifications]);

  const markAsRead = async (id: string) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        // Optimistic update
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        // If this is the active emergency modal, close it
        if (activeEmergencyModal?.id === id) {
          setActiveEmergencyModal(null);
        }
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/notifications/read-all`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setActiveEmergencyModal(null);
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const userRole = user?.role?.toUpperCase();
  const showEmergencyPopup = activeEmergencyModal && (userRole === "COORDINATOR" || userRole === "TECHNICIAN");

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        activeEmergencyModal,
        setActiveEmergencyModal,
      }}
    >
      {children}
      {showEmergencyPopup && (
        <EmergencyModal
          notification={activeEmergencyModal}
          onClose={() => setActiveEmergencyModal(null)}
          onAcknowledge={markAsRead}
          role={userRole}
        />
      )}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
