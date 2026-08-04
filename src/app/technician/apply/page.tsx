"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { TechnicianApplication } from "@/types/technician";

import FormHeader from "@/components/technicianForm/FormHeader";
import ProfessionalInfo from "@/components/technicianForm/ProfessionalInfo";
import AvailabilitySection from "@/components/technicianForm/AvailabilitySection";
import AboutSection from "@/components/technicianForm/AboutSection";
import SubmitSection from "@/components/technicianForm/SubmitSection";

export default function TechnicianApplyPage() {
  const router = useRouter();
  const { user, setRole } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    experience: 0,
    license: "",
    availableDays: [],
    availableFrom: "",
    availableTo: "",
    about: "",
    declarationAccepted: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to apply.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const response = await fetch(`${API_URL}/technicians/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          skills: formData.skills,
          experience: formData.experience,
          license: formData.license,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update user role in context
        setRole("TECHNICIAN_PENDING");
        router.push("/technician/pending");
      } else {
        setError(data.message || "Failed to submit application.");
      }
    } catch (err) {
      console.error(err);
      setError("A network error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0D0F14] px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <FormHeader />

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

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
