// components/technicianForm/AboutSection.tsx

import { Dispatch, SetStateAction } from "react";
import { TechnicianApplication } from "@/types/technician";

interface AboutSectionProps {
  formData: TechnicianApplication;
  setFormData: Dispatch<SetStateAction<TechnicianApplication>>;
}

export default function AboutSection({
  formData,
  setFormData,
}: AboutSectionProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#151922] p-6">
      <h2 className="mb-6 text-xl font-semibold text-white">
        About You
      </h2>

      <div>
        <label className="mb-2 block text-sm text-gray-300">
          Tell us about yourself
        </label>

        <textarea
          rows={6}
          value={formData.about}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              about: e.target.value,
            }))
          }
          placeholder="Tell us about your skills, the services you provide, and why you'd like to join FixNest."
          className="w-full rounded-xl border border-white/10 bg-[#0D0F14] px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#C8A55E] focus:outline-none resize-none"
          required
        />
      </div>
    </section>
  );
}