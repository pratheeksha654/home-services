"use client";

import { motion } from "framer-motion";
import SuccessModal from "./SuccessModal";
import {
  Wrench,
  FileText,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { useState } from "react";

export default function EmergencyForm() {
  const [category, setCategory] = useState("");
  const [problem, setProblem] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
  if (!category.trim()) {
    alert("Please select a service category.");
    return;
  }

  if (!problem.trim()) {
    alert("Please describe your emergency.");
    return;
  }

  setOpen(true);
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

            <option>Electrical</option>

            <option>Plumbing</option>

            <option>Appliance Repair</option>

            <option>AC Repair</option>

            <option>Carpenter</option>

            <option>Cleaning</option>
            <option>other</option>

          </select>

        </div>

        {/* PHONE */}

        <div>

          <label className="mb-3 flex items-center gap-2 text-[#E4D5A8] font-medium">

            <Phone size={18} />

            Contact Number

          </label>

          <input

            value="+91 9876543210"

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

          readOnly

          value="Bejai, Mangalore, Karnataka"

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

        whileHover={{
          scale: 1.03,
          boxShadow: "0px 0px 35px rgba(200,165,94,.35)",
        }}

        whileTap={{
          scale: .96,
        }}

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
        "
      >

        <Send size={20} />

        Request Emergency Help

      </motion.button>
      

    </motion.div>
    
     <SuccessModal
      open={open}
      onClose={() => setOpen(false)}
    />
  </>
  );
}