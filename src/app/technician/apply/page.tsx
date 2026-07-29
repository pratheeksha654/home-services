"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { TechnicianApplication } from "@/types/technician";

import FormHeader from "@/components/technicianForm/FormHeader";
import ProfessionalInfo from "@/components/technicianForm/ProfessionalInfo";
import AvailabilitySection from "@/components/technicianForm/AvailabilitySection";
import AboutSection from "@/components/technicianForm/AboutSection";
import SubmitSection from "@/components/technicianForm/SubmitSection";

export default function TechnicianApplyPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<TechnicianApplication>({
    fullName: "",
    email: "",
    phone: "",

    address: "",
    city: "",
    state: "",
    pincode: "",

    serviceCategories: [],

    skills: "",

    availableDays: [],

    availableFrom: "",
    availableTo: "",

    about: "",

    declarationAccepted: false,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const personalInfo = JSON.parse(
    localStorage.getItem("personalInfo") || "{}"
  );

  const technicianApplication = {
    ...personalInfo,
    ...formData,
    status: "pending",
  };

  localStorage.setItem(
    "technicianApplication",
    JSON.stringify(technicianApplication)
  );

  console.log(technicianApplication);

  router.push("/technician/pending");
};

  return (
    <main className="min-h-screen bg-[#0D0F14] px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <FormHeader />

        <form onSubmit={handleSubmit} className="space-y-8">
          

          <ProfessionalInfo
            formData={formData}
            setFormData={setFormData}
          />

          <AvailabilitySection
            formData={formData}
            setFormData={setFormData}
          />

          <AboutSection
            formData={formData}
            setFormData={setFormData}
          />

          <SubmitSection
            formData={formData}
            setFormData={setFormData}
          />
        </form>
      </div>
    </main>
  );
}
