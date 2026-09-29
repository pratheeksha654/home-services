"use client";

import React, { useEffect } from "react";
import { Notification } from "@/context/notification-context";
import { AlertTriangle, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface EmergencyModalProps {
  notification: Notification;
  onClose: () => void;
  onAcknowledge: (id: string) => Promise<void>;
  role?: string | null;
}

export default function EmergencyModal({
  notification,
  onClose,
  onAcknowledge,
  role,
}: EmergencyModalProps) {
  const router = useRouter();

  useEffect(() => {
    // Play alert sound pattern
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playBeep = (freq: number, duration: number, delay: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + delay + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + duration);
      };
      playBeep(880, 0.25, 0);
      playBeep(880, 0.25, 0.35);
    } catch (e) {
      console.warn("AudioContext failed to play alert sound:", e);
    }
  }, []);

  const handleAcknowledge = async () => {
    await onAcknowledge(notification.id);
    onClose();
    
    // Redirect to active emergency page
    if (role === "COORDINATOR") {
      router.push("/coordinator/emergency-requests");
    } else if (role === "TECHNICIAN") {
      router.push("/technician/activejobs");
    } else {
      router.push("/customer/track-booking");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg transition-opacity duration-300">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-red-500/30 bg-[#0B0D13] shadow-[0_0_50px_rgba(239,68,68,0.25)] transition-all duration-300">
        {/* Flashing Red Top Bar */}
        <div className="h-2 w-full bg-red-500 animate-pulse" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors duration-200"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center">
          {/* Pulsing Icon */}
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-4 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <AlertTriangle className="w-8 h-8 animate-bounce" />
          </div>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl font-bold font-outfit text-white tracking-wide">
            URGENT EMERGENCY ALERT
          </h2>
          <p className="text-sm text-red-400 font-semibold font-inter mt-1">
            New Emergency Request Received
          </p>

          <div className="w-full h-px bg-white/5 my-5" />

          {/* Notification Details */}
          <div className="w-full text-left space-y-4">
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider font-inter">
                Alert Title
              </h3>
              <p className="text-sm font-semibold text-[#ECEDF0] font-outfit mt-0.5">
                {notification.title}
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider font-inter">
                Message Detail
              </h3>
              <p className="text-xs text-[#9CA0AE] font-inter mt-1 leading-relaxed">
                {notification.message}
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-white/5 my-5" />

          {/* Action Buttons */}
          <div className="w-full flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-semibold font-inter transition-all duration-200"
            >
              Dismiss
            </button>
            <button
              onClick={handleAcknowledge}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white hover:opacity-90 text-xs font-semibold font-inter shadow-lg shadow-red-500/20 transition-all duration-200"
            >
              Acknowledge & View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
