// components/technicianForm/AvailabilitySection.tsx

import { Dispatch, SetStateAction } from "react";
import { TechnicianApplication } from "@/types/technician";

interface AvailabilitySectionProps {
  formData: TechnicianApplication;
  setFormData: Dispatch<SetStateAction<TechnicianApplication>>;
}

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function AvailabilitySection({
  formData,
  setFormData,
}: AvailabilitySectionProps) {
  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-[#151922] p-6">
      <h2 className="mb-6 text-xl font-semibold text-white">
        Availability
      </h2>

      <div className="space-y-8">
        <div>
          <label className="mb-4 block text-sm text-gray-300">
            Available Days
          </label>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {days.map((day) => (
              <label
                key={day}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[#0D0F14] px-4 py-3 text-gray-300 hover:border-[#C8A55E]"
              >
                <input
                  type="checkbox"
                  checked={formData.availableDays.includes(day)}
                  onChange={() => toggleDay(day)}
                  className="h-4 w-4 accent-[#C8A55E]"
                />

                <span>{day}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Available From
            </label>

            <input
              type="time"
              value={formData.availableFrom}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  availableFrom: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-[#0D0F14] px-4 py-3 text-white focus:border-[#C8A55E] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Available To
            </label>

            <input
              type="time"
              value={formData.availableTo}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  availableTo: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-[#0D0F14] px-4 py-3 text-white focus:border-[#C8A55E] focus:outline-none"
              required
            />
          </div>
        </div>
      </div>
    </section>
  );
}