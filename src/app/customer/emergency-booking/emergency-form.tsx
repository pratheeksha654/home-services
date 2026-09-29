"use client";

import { motion } from "framer-motion";
import SuccessModal from "./success-modal";
import {
  Wrench,
  FileText,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "@/context/auth-context";

export default function EmergencyForm() {
  const { user } = useAuth();
  const [category, setCategory] = useState("");
  const [problem, setProblem] = useState("");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const customerName = user?.name?.trim() || "Customer";
  const customerPhone = user?.phone?.trim() || user?.phoneNumber?.trim() || "";
  const customerEmail = user?.email?.trim() || "";

  const resolvedAddress = useMemo(() => {
    const parts = [
      user?.street || "",
      user?.city || "",
      user?.postalCode || "",
    ].filter(Boolean);

    return parts.join(", ") || "Bejai, Mangalore, Karnataka";
  }, [user]);

  const handleSubmit = async () => {
    if (!category.trim()) {
      alert("Please select a service category.");
      return;
    }

    if (!problem.trim()) {
      alert("Please describe your emergency.");
      return;
    }

    setSubmitting(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const response = await fetch(`${API_URL}/emergency-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include authorization token if your backend requires auth middleware
          ...(localStorage.getItem("token") && {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }),
        },
        body: JSON.stringify({
          // Snake_case variants (commonly used in SQL/Postgres/MySQL schemas)
          service_category: category,
          problem_description: problem,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail,
          preferred_date: new Date().toISOString().split("T")[0],
          preferred_time: "Immediate / ASAP",
          is_emergency: true,
          status: "pending",
          address: resolvedAddress,

          // CamelCase variants (commonly used in Mongoose/MongoDB schemas)
          serviceCategory: category,
          problemDescription: problem,
          description: problem,
          customerName: customerName,
          customerPhone: customerPhone,
          customerEmail: customerEmail,
          customerAddress: resolvedAddress,
          phoneNumber: customerPhone,
          name: customerName,
          city: "Mangalore",
          priority: "High",
          street: user?.street || "",
          postalCode: user?.postalCode || "",
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || "Unable to submit your emergency request.");
      }

      setOpen(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to submit your request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 70 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: .8 }}
        className="
        mt-16
        rounded-3xl
        border
        border-[#C8A55E]/20
        bg-[#14161E]/70
        backdrop-blur-xl
        p-8
        lg:p-10
        shadow-[0_0_50px_rgba(0,0,0,.25)]
        "
      >
        <div className="mt-10 grid lg:grid-cols-2 gap-8">
          {/* CATEGORY */}
          <div>
            <label className="mb-3 flex items-center gap-2 text-[#E4D5A8] font-medium">
              <Wrench size={18} />
              Service Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="
              w-full
              rounded-xl
              border
              border-[#C8A55E]/20
              bg-[#0D0F14]
              p-4
              text-[#ECEDF0]
              outline-none
              transition
              focus:border-[#C8A55E]
              "
            >
              <option value="">
                Select Category
              </option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Appliance Repair">Appliance Repair</option>
              <option value="AC Repair">AC Repair</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* PHONE */}
          <div>
            <label className="mb-3 flex items-center gap-2 text-[#E4D5A8] font-medium">
              <Phone size={18} />
              Contact Number
            </label>
            <input
              value={customerPhone || "No phone number found in your profile"}
              readOnly
              className="
              w-full
              rounded-xl
              border
              border-[#C8A55E]/20
              bg-[#1A1D28]
              p-4
              text-[#9CA0AE]
              cursor-not-allowed
              "
            />
          </div>
        </div>

        {/* PROBLEM */}
        <div className="mt-8">
          <label className="mb-3 flex items-center gap-2 text-[#E4D5A8] font-medium">
            <FileText size={18} />
            Problem Description
          </label>
          <textarea
            rows={5}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Briefly describe your emergency..."
            className="
            w-full
            rounded-xl
            border
            border-[#C8A55E]/20
            bg-[#0D0F14]
            p-4
            text-[#ECEDF0]
            resize-none
            outline-none
            transition
            focus:border-[#C8A55E]
            "
          />
        </div>

        {/* ADDRESS */}
        <div className="mt-8">
          <label className="mb-3 flex items-center gap-2 text-[#E4D5A8] font-medium">
            <MapPin size={18} />
            Current Address
          </label>
          <textarea
            rows={3}
            value={resolvedAddress}
            readOnly
            className="
            w-full
            rounded-xl
            border
            border-[#C8A55E]/20
            bg-[#1A1D28]
            p-4
            text-[#9CA0AE]
            cursor-not-allowed
            resize-none
            "
          />
        </div>

        {/* BUTTON */}
        <motion.button
          onClick={handleSubmit}
          disabled={submitting}
          whileHover={!submitting ? {
            scale: 1.03,
            boxShadow: "0px 0px 35px rgba(200,165,94,.35)",
          } : {}}
          whileTap={!submitting ? {
            scale: .96,
          } : {}}
          className="
          mt-10
          w-full
          rounded-xl
          bg-[#C8A55E]
          py-4
          text-lg
          font-bold
          text-black
          flex
          items-center
          justify-center
          gap-3
          disabled:opacity-60
          disabled:cursor-not-allowed
          "
        >
          <Send size={20} />
          {submitting ? "Submitting…" : "Request Emergency Help"}
        </motion.button>
      </motion.div>

      <SuccessModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}