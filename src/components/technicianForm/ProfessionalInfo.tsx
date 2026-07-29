// components/technicianForm/ProfessionalInfo.tsx

import { Dispatch, SetStateAction } from "react";
import { TechnicianApplication } from "@/types/technician";

interface ProfessionalInfoProps {
  formData: TechnicianApplication;
  setFormData: Dispatch<SetStateAction<TechnicianApplication>>;
}

const categories = [
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "Cleaner",
  "AC Technician",
  "Appliance Repair",
  "Pest Control",
  "Other",
];

export default function ProfessionalInfo({
  formData,
  setFormData,
}: ProfessionalInfoProps) {
  const toggleCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceCategories: prev.serviceCategories.includes(category)
        ? prev.serviceCategories.filter((item) => item !== category)
        : [...prev.serviceCategories, category],
    }));
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-[#151922] p-6">
      <h2 className="mb-6 text-xl font-semibold text-white">
        Professional Details
      </h2>

      <div className="space-y-8">
        <div>
          <label className="mb-4 block text-sm text-gray-300">
            Service Categories
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <label
                key={category}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[#0D0F14] px-4 py-3 text-gray-300 transition hover:border-[#C8A55E]"
              >
                <input
                  type="checkbox"
                  checked={formData.serviceCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="h-4 w-4 accent-[#C8A55E]"
                />

                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Skills
          </label>

          <textarea
            rows={4}
            value={formData.skills}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                skills: e.target.value,
              }))
            }
            placeholder="Example: Wiring, Fan Installation, AC Servicing"
            className="w-full rounded-xl border border-white/10 bg-[#0D0F14] px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#C8A55E] focus:outline-none"
            required
          />
        </div>
      </div>
    </section>
  );
}