'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Navigation, ArrowRight, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ActiveBooking {
  bookingId: string;
  technicianName: string;
  currentStatus: string;
  statusLabel: string;
  serviceCategory: string;
}

export default function TrackBookingSelectionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeBookings, setActiveBookings] = useState<ActiveBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchActiveTrackings = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
        const token = typeof window !== "undefined"
          ? localStorage.getItem("homefixpro_token") || localStorage.getItem("token")
          : null;

        const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        // 1. Fetch normal bookings and emergency requests in parallel
        const [bookingsRes, emergencyRes] = await Promise.all([
          fetch(`${API_URL}/bookings`, { headers: authHeaders }),
          fetch(`${API_URL}/emergency-requests`, { headers: authHeaders }).catch(() => null)
        ]);

        let normalBookings: any[] = [];
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          if (bookingsData.success && Array.isArray(bookingsData.data?.bookings)) {
            normalBookings = bookingsData.data.bookings;
          }
        }

        let emergencyBookings: any[] = [];
        if (emergencyRes && emergencyRes.ok) {
          const emergencyData = await emergencyRes.json();
          const items = emergencyData.data?.emergencyRequests || emergencyData.data?.items || [];
          if (Array.isArray(items)) {
            emergencyBookings = items.map((e: any) => ({
              booking_id: e.id,
              service_category: e.serviceCategory || "Emergency Service",
              email: e.customerEmail || e.email || "",
              status: e.status,
              assigned_technician: e.assigned_technician
            }));
          }
        }

        const allBookings = [...normalBookings, ...emergencyBookings];

        // 2. Filter bookings: must belong to current customer and status must be active (Assigned, In Progress, or Completed)
        const userEmail = user.email?.trim().toLowerCase();
        const activeStatuses = ['assigned', 'in progress', 'completed'];

        const activeUserBookings = allBookings.filter((b: any) => {
          const emailMatch = !userEmail || (b.email && b.email.trim().toLowerCase() === userEmail);
          const statusLower = (b.status || '').toString().toLowerCase();
          const statusMatch = activeStatuses.includes(statusLower) || Boolean(b.assigned_technician);
          return emailMatch && statusMatch;
        });

        // 3. For each active booking, query or initialize its tracking session
        const trackingList: ActiveBooking[] = [];
        for (const booking of activeUserBookings) {
          const bId = booking.booking_id || booking.id;
          if (!bId) continue;

          try {
            const res = await fetch(`${API_URL}/tracking/${bId}`);
            const data = await res.json();
            if (res.ok && data.success && data.data?.tracking) {
              const t = data.data.tracking;
              trackingList.push({
                bookingId: t.bookingId,
                technicianName: t.technicianName,
                currentStatus: t.currentStatus,
                statusLabel: t.statusLabel,
                serviceCategory: booking.service_category || "Service"
              });
            }
          } catch (err) {
            console.error(`Error fetching tracking for ${bId}:`, err);
          }
        }
        setActiveBookings(trackingList);
      } catch (error) {
        console.error('Error fetching trackings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveTrackings();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#08090D] text-[#ECEDF0] pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <header className="mb-12">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Track Your Active Services
          </h1>
          <p className="text-sm text-[#9CA0AE] mt-2">
            Select an ongoing service request to view live technician location and estimated arrival time.
          </p>
        </header>

        {loading ? (
          <div className="text-center py-12 text-[#9CA0AE]">Loading active trackings...</div>
        ) : activeBookings.length === 0 ? (
          <div className="bg-[#14161E]/40 border border-[rgba(255,255,255,0.06)] rounded-3xl p-12 text-center">
            <MapPin className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white">No active trackable bookings</h3>
            <p className="text-sm text-[#9CA0AE] mt-2">
              Bookings will appear here when a technician is on their way to your location.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {(activeBookings || []).map((booking) => (
              <div
                key={booking.bookingId}
                className="bg-[#14161E]/40 hover:bg-[#14161E]/70 border border-[rgba(255,255,255,0.06)] rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-500/20">
                    <Navigation className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {booking.serviceCategory}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 text-sm text-[#9CA0AE]">
                      <User size={14} className="text-[#C8A55E]" />
                      <span>Technician: {booking.technicianName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase tracking-wider">
                      {booking.statusLabel}
                    </span>
                  </div>
                  <button
                    onClick={() => router.push(`/customer/tracking/${booking.bookingId}`)}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#C8A55E] to-[#E4D5A8] text-[#08090D] px-5 py-3 rounded-2xl text-sm font-bold shadow-md shadow-amber-500/5 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    View Map
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
