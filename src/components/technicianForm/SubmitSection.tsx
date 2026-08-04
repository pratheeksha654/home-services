// components/technicianForm/SubmitSection.tsx

import { Dispatch, SetStateAction } from "react";
import { TechnicianApplication } from "@/types/technician";

interface SubmitSectionProps {
  formData: TechnicianApplication;
  setFormData: Dispatch<SetStateAction<TechnicianApplication>>;
}

export default function SubmitSection({
  formData,
  setFormData,
}: SubmitSectionProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#151922] p-6">
      <div className="space-y-6">
        <label className="flex items-start gap-3 text-gray-300">
          <input
            type="checkbox"
            checked={formData.declarationAccepted}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                declarationAccepted: e.target.checked,
              }))
            }
            className="mt-1 h-4 w-4 accent-[#C8A55E]"
          />

          <span>
            I confirm that the information provided is accurate and I
            agree to FixNest reviewing my application.
          </span>
        </label>

        <button
          type="submit"
          disabled={!formData.declarationAccepted}
          className="w-full rounded-xl bg-[#C8A55E] px-6 py-3 font-semibold text-black transition hover:bg-[#d4b26a] disabled:cursor-not-allowed disabled:bg-[#6b5a35] disabled:text-gray-300"
        >
          Submit Application
        </button>
      </div>
    </section>
  );
}