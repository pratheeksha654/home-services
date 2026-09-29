"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, UserCheck, AlertTriangle, Calendar, Clock, MapPin, Wrench, CreditCard, CheckCircle2 } from "lucide-react";

type JobDetailDrawerProps = {
  job: any | null;
  technicians: any[];
  onClose: () => void;
  onAssign: (bookingId: string, technicianId: string) => void;
  onMarkPaid?: (bookingId: string) => void;
};

export default function JobDetailDrawer({
  job,
  technicians,
  onClose,
  onAssign,
  onMarkPaid,
}: JobDetailDrawerProps) {
  const [markingPaid, setMarkingPaid] = useState(false);

  if (!job) return null;

  const isEmergency = job.booking_type === "Emergency" || job.isEmergency;
  const isCompleted = job.status === "Completed";
  const isPaid = job.payment_status === "Paid";

  const handleMarkPaid = async () => {
    if (!job) return;
    setMarkingPaid(true);
    if (onMarkPaid) {
      await onMarkPaid(job.booking_id || job.id);
    }
    setMarkingPaid(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full max-w-md bg-[#14161E] border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl text-[#ECEDF0]"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${isEmergency ? "bg-red-500/20 text-red-400" : "bg-cyan-500/20 text-cyan-400"}`}>
                  {isEmergency ? <AlertTriangle size={22} /> : <Wrench size={22} />}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {job.service_name || job.title || "Service Job"}
                  </h3>
                  <p className="text-xs text-gray-400">ID: {job.booking_id || job.id}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Emergency Alert Tag */}
            {isEmergency && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                <AlertTriangle className="text-red-400 shrink-0" size={24} />
                <div>
                  <h4 className="text-sm font-bold text-red-400">High Priority Emergency Request</h4>
                  <p className="text-xs text-red-300/80">Guaranteed 30-minute response SLA applies.</p>
                </div>
              </div>
            )}

            {/* Key Information Cards */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0D0E14] border border-white/5 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Calendar size={16} className="text-cyan-400" />
                  <span>Date: <strong className="text-white">{job.preferred_date || "Today"}</strong></span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Clock size={16} className="text-cyan-400" />
                  <span>Time Slot: <strong className="text-white">{job.preferred_time || "Asap"}</strong></span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <MapPin size={16} className="text-cyan-400" />
                  <span className="truncate">Address: <strong className="text-white">{job.address || "Customer Location"}</strong></span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="p-4 rounded-2xl bg-[#0D0E14] border border-white/5">
                <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Customer</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{job.customer_name || job.user_name || "Customer"}</p>
                    <p className="text-xs text-gray-400">{job.customer_phone || "+91 98765 43210"}</p>
                  </div>
                  <a
                    href={`tel:${job.customer_phone || "9876543210"}`}
                    className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition flex items-center gap-2 text-xs font-semibold"
                  >
                    <Phone size={16} /> Call
                  </a>
                </div>
              </div>

              {/* Bill & Payment Status Box */}
              {(() => {
                const category = (job.service_category || "").toLowerCase();
                const prices: Record<string, number> = {
                  cleaner: 39, carpenter: 45, electrician: 49, plumber: 49,
                  "appliance repair": 55, "ac technician": 59, pest: 65, painter: 79, other: 35
                };
                let base = 45;
                for (const [k, v] of Object.entries(prices)) {
                  if (category.includes(k)) { base = v; break; }
                }
                let total = base + 10;
                if ((job.booking_type || "").toLowerCase() === "emergency") total = Math.round(total * 1.5);
                const displayAmt = job.amount || total;

                return (
                  <div className="p-4 rounded-2xl bg-[#0D0E14] border border-white/5">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Billing & Payment</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">Total Bill Amount</p>
                        <p className="text-xl font-bold text-emerald-400">${displayAmt}</p>
                      </div>
                      <div>
                        {isPaid ? (
                          <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                            <CheckCircle2 size={14} /> Paid & Confirmed
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                            ⏳ Payment Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Technician Info & Assignment */}
              <div className="p-4 rounded-2xl bg-[#0D0E14] border border-white/5">
                <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Assigned Technician</h4>
                {job.assigned_technician ? (
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-white">{job.assigned_technician}</p>
                      <p className="text-xs text-green-400 font-medium">● Assigned & On Duty</p>
                    </div>
                    <a
                      href={`tel:${job.technician_phone || "9988776655"}`}
                      className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Phone size={14} /> Call Tech
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-amber-400 mb-3">⚠️ No technician assigned yet.</p>
                )}

                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      onAssign(job.booking_id || job.id, e.target.value);
                    }
                  }}
                  defaultValue=""
                  className="w-full bg-[#1A1D27] text-white border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="" disabled>Assign / Reassign technician...</option>
                  {technicians.map((tech) => (
                    <option key={tech.id} value={tech.profileId || tech.id}>
                      {tech.name} ({tech.availability}) — ⭐ {tech.rating || 5.0}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-white/10 pt-4 mt-6 space-y-2">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition"
            >
              Close Drawer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
