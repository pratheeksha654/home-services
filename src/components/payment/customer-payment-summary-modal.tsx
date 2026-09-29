"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Clock, ShieldCheck, Receipt, Download } from "lucide-react";

type CustomerPaymentSummaryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
};

export default function CustomerPaymentSummaryModal({
  isOpen,
  onClose,
  booking,
}: CustomerPaymentSummaryModalProps) {
  if (!isOpen || !booking) return null;

  const isPaid = booking.payment_status === "Paid";
  const basePrice = booking.amount || 1299;
  const taxes = Math.round(basePrice * 0.18);
  const totalBill = basePrice + taxes;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg bg-[#12141E] border border-white/10 rounded-3xl p-6 shadow-2xl text-[#ECEDF0] relative overflow-hidden"
        >
          {/* Top Gradient Bar */}
          <div className={`absolute top-0 left-0 right-0 h-1.5 ${isPaid ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
                <Receipt size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Payment & Billing Summary</h3>
                <p className="text-xs text-gray-400">Booking ID: #{String(booking.booking_id || booking.id || "1024").slice(-6)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Service Info */}
          <div className="p-4 rounded-2xl bg-[#1A1D2A] border border-white/5 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-white">{booking.service_name || booking.service_category || "Home Repair Service"}</span>
              <span className="text-xs text-cyan-400 font-mono font-medium">{booking.preferred_date || "Today"}</span>
            </div>
            <p className="text-xs text-gray-400 line-clamp-2">{booking.problem_description || "Professional home maintenance and repair service."}</p>
          </div>

          {/* Bill Breakdown */}
          <div className="space-y-3 p-4 rounded-2xl bg-[#0D0E14] border border-white/5 mb-6 text-sm">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Itemized Invoice</h4>

            <div className="flex justify-between text-gray-300">
              <span>Base Service & Labor Fee</span>
              <span>₹{basePrice}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>GST & Service Taxes (18%)</span>
              <span>₹{taxes}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Safety & Inspection Cover</span>
              <span className="text-emerald-400 font-semibold">FREE</span>
            </div>

            <div className="border-t border-white/10 pt-3 flex justify-between items-center">
              <span className="font-bold text-white text-base">Total Amount Payable</span>
              <span className="font-black text-emerald-400 text-xl">₹{totalBill}</span>
            </div>
          </div>

          {/* Payment Status Banner */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between mb-6 ${
            isPaid
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-amber-500/10 border-amber-500/30 text-amber-400"
          }`}>
            <div className="flex items-center gap-3">
              {isPaid ? <CheckCircle2 size={22} /> : <Clock size={22} />}
              <div>
                <h5 className="font-bold text-sm">
                  {isPaid ? "Payment Confirmed & Settled" : "Awaiting Coordinator Confirmation"}
                </h5>
                <p className="text-xs opacity-80">
                  {isPaid ? "Thank you! Invoice settlement is complete." : "Coordinator will confirm payment upon receipt."}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition"
            >
              Done / Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
