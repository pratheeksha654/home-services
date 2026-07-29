"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Service Options Data
const SERVICES = [
    {
        id: "electrician",
        name: "Electrician",
        icon: "⚡",
        description: "Wiring, switchboard replacement, lighting, circuit breaker fixes & safety checks.",
        basePrice: 49,
    },
    {
        id: "plumber",
        name: "Plumber",
        icon: "🚰",
        description: "Leak repair, pipe fitting, drainage unclogging & bathroom fixture installs.",
        basePrice: 49,
    },
    {
        id: "carpenter",
        name: "Carpenter",
        icon: "🔨",
        description: "Furniture assembly, door lock repairs, cabinets & custom woodwork.",
        basePrice: 45,
    },
    {
        id: "painter",
        name: "Painter",
        icon: "🎨",
        description: "Interior & exterior wall painting, touch-ups & waterproof coating.",
        basePrice: 79,
    },
    {
        id: "cleaner",
        name: "Cleaner",
        icon: "🧹",
        description: "Deep house cleaning, kitchen & bathroom sanitization, sofa/carpet wash.",
        basePrice: 39,
    },
    {
        id: "ac-technician",
        name: "AC Technician",
        icon: "❄️",
        description: "Deep cleaning, gas refill, filter replacement & cooling issue repairs.",
        basePrice: 59,
    },
    {
        id: "appliance-repair",
        name: "Appliance Repair",
        icon: "🧺",
        description: "Washing machine, refrigerator, microwave, dishwasher & stove repairs.",
        basePrice: 55,
    },
    {
        id: "pest-control",
        name: "Pest Control",
        icon: "🦟",
        description: "Treatment for termites, cockroaches, rodents, mosquitoes & bedbugs.",
        basePrice: 65,
    },
    {
        id: "other",
        name: "Other",
        icon: "🛠️",
        description: "General handyman help, custom fixes, or unspecified home services.",
        basePrice: 35,
    },
];

const TIME_SLOTS = [
    "09:00 AM - 11:00 AM",
    "11:00 AM - 01:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
];

export default function BookingPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [step, setStep] = useState<1 | 2 | 3>(1);

    // Form State
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [issueDescription, setIssueDescription] = useState<string>("");
    const [bookingDate, setBookingDate] = useState<string>("");

    // Time Slot Selection State
    const [timeSlot, setTimeSlot] = useState<string>("");
    const [isCustomTime, setIsCustomTime] = useState<boolean>(false);
    const [customTimeSlot, setCustomTimeSlot] = useState<string>("");

    // Address pre-populated from user profile, editable
    const [address, setAddress] = useState({
        street: "",
        city: "",
        postalCode: "",
    });

    const [notes, setNotes] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Get today's date formatted for HTML date picker min attribute
    const todayDateStr = new Date().toISOString().split("T")[0];

    // Auto-fill address from AuthContext when user profile is loaded
    useEffect(() => {
        if (user?.address) {
            setAddress({
                street: user.address.street || user.address.streetAddress || "",
                city: user.address.city || "",
                postalCode: user.address.postalCode || user.address.zipCode || "",
            });
        }
    }, [user]);

    const activeServiceObj = SERVICES.find((s) => s.id === selectedService);
    const finalTimeSlot = isCustomTime ? customTimeSlot : timeSlot;

    const handleNextStep = () => {
        if (step === 1 && !selectedService) return;
        if (step === 2 && (!bookingDate || !finalTimeSlot.trim())) return;
        setStep((prev) => (prev + 1) as 2 | 3);
    };

    const handlePrevStep = () => {
        setStep((prev) => (prev - 1) as 1 | 2);
    };

    const handleSubmitBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                serviceId: selectedService,
                serviceName: activeServiceObj?.name,
                issueDescription,
                date: bookingDate,
                timeSlot: finalTimeSlot,
                address,
                notes,
            };

            console.log("Booking Submitted:", payload);

            setTimeout(() => {
                setIsSubmitting(false);
                router.push("/services?booked=success");
            }, 1200);
        } catch (err) {
            console.error("Booking error:", err);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#08090D] text-[#ECEDF0] py-10 px-4 sm:px-6 lg:px-8 font-inter">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold font-outfit text-white tracking-tight">
                        Book a Service
                    </h1>
                    <p className="mt-2 text-sm text-[#9CA0AE]">
                        Select a service, describe the issue, pick your preferred date & time slot, and our expert will handle the rest.
                    </p>
                </div>

                {/* Step Indicator Bar */}
                <div className="flex items-center justify-center mb-10 max-w-xl mx-auto">
                    {[
                        { num: 1, title: "Service & Issue" },
                        { num: 2, title: "Schedule" },
                        { num: 3, title: "Address & Confirm" },
                    ].map((item, index) => (
                        <React.Fragment key={item.num}>
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= item.num
                                            ? "bg-gradient-to-r from-[#C8A55E] to-[#E4D5A8] text-[#08090D]"
                                            : "bg-[#14161E] text-[#5C6070] border border-[rgba(255,255,255,0.08)]"
                                        }`}
                                >
                                    {item.num}
                                </div>
                                <span
                                    className={`text-xs font-medium hidden sm:inline ${step >= item.num ? "text-[#ECEDF0]" : "text-[#5C6070]"
                                        }`}
                                >
                                    {item.title}
                                </span>
                            </div>
                            {index < 2 && (
                                <div
                                    className={`flex-1 h-[2px] mx-3 transition-colors ${step > item.num ? "bg-[#C8A55E]" : "bg-[rgba(255,255,255,0.08)]"
                                        }`}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Main Form Area */}
                    <div className="lg:col-span-2 bg-[#10121A] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
                        {/* STEP 1: SELECT SERVICE & ISSUE */}
                        {step === 1 && (
                            <div>
                                <h2 className="text-xl font-semibold text-white font-outfit mb-4">
                                    Select Required Service
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                    {SERVICES.map((srv) => {
                                        const isSelected = selectedService === srv.id;
                                        return (
                                            <button
                                                key={srv.id}
                                                type="button"
                                                onClick={() => setSelectedService(srv.id)}
                                                className={`text-left p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${isSelected
                                                        ? "bg-[#C8A55E]/10 border-[#C8A55E] shadow-lg shadow-[#C8A55E]/10"
                                                        : "bg-[#14161E]/60 border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)]"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-2xl">{srv.icon}</span>
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-white">
                                                            {srv.name}
                                                        </h3>
                                                        <p className="text-xs text-[#C8A55E] font-mono">
                                                            From ${srv.basePrice}*
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-[#9CA0AE] line-clamp-2">
                                                    {srv.description}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Dynamic Issue Description Textarea */}
                                {selectedService && (
                                    <div className="pt-4 border-t border-[rgba(255,255,255,0.08)]">
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA0AE] mb-2">
                                            Describe the Issue {selectedService === "other" && <span className="text-[#C8A55E]">*</span>}
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={issueDescription}
                                            onChange={(e) => setIssueDescription(e.target.value)}
                                            placeholder={
                                                selectedService === "other"
                                                    ? "Please specify the problem or task you need help with..."
                                                    : `What seems to be the issue with the ${activeServiceObj?.name.toLowerCase()} work? (e.g., tap leaking, switch spark, AC not cooling)`
                                            }
                                            className="w-full bg-[#14161E] border border-[rgba(255,255,255,0.12)] rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-[#C8A55E] focus:ring-1 focus:ring-[#C8A55E] transition-colors"
                                        />

                                        {/* Inspection Clause Notice */}
                                        <p className="text-[11px] text-[#9CA0AE] mt-2.5 flex items-center gap-1.5">
                                            <span className="text-[#C8A55E]">⚠️</span>
                                            <span>
                                                <strong className="text-white font-medium">Note:</strong> Final charges may vary based on on-site inspection and actual spare parts required by the technician.
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 2: DATE & TIME SLOTS */}
                        {step === 2 && (
                            <div>
                                <h2 className="text-xl font-semibold text-white font-outfit mb-4">
                                    Select Date & Preferred Time
                                </h2>

                                <div className="space-y-6">
                                    {/* Date Input */}
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA0AE] mb-2">
                                            Preferred Date
                                        </label>
                                        <input
                                            type="date"
                                            value={bookingDate}
                                            onChange={(e) => setBookingDate(e.target.value)}
                                            min={todayDateStr}
                                            className="w-full bg-[#14161E] border border-[rgba(255,255,255,0.12)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C8A55E] focus:ring-1 focus:ring-[#C8A55E] transition-colors color-scheme-dark"
                                            style={{ colorScheme: "dark" }}
                                        />
                                    </div>

                                    {/* Time Slots */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA0AE]">
                                                Available Time Slots
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsCustomTime(!isCustomTime);
                                                    if (!isCustomTime) setTimeSlot("");
                                                }}
                                                className="text-xs text-[#C8A55E] hover:underline font-medium transition-colors"
                                            >
                                                {isCustomTime ? "← Choose Predefined Slot" : "+ Custom Time Slot"}
                                            </button>
                                        </div>

                                        {!isCustomTime ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {TIME_SLOTS.map((slot) => {
                                                    const isSelected = timeSlot === slot;
                                                    return (
                                                        <button
                                                            key={slot}
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setTimeSlot(slot);
                                                            }}
                                                            className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${isSelected
                                                                    ? "bg-[#C8A55E] text-[#08090D] border-[#C8A55E] shadow-md shadow-[#C8A55E]/20"
                                                                    : "bg-[#14161E] text-[#9CA0AE] border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.2)] hover:text-white"
                                                                }`}
                                                        >
                                                            {slot}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="animate-fadeIn">
                                                <input
                                                    type="text"
                                                    value={customTimeSlot}
                                                    onChange={(e) => setCustomTimeSlot(e.target.value)}
                                                    placeholder="e.g. 07:30 PM - 08:30 PM or After 6 PM"
                                                    className="w-full bg-[#14161E] border border-[rgba(255,255,255,0.12)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C8A55E] focus:ring-1 focus:ring-[#C8A55E] transition-colors"
                                                />
                                                <p className="text-[11px] text-[#9CA0AE] mt-1.5">
                                                    Specify your preferred custom timing window.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: LOCATION & NOTES */}
                        {step === 3 && (
                            <form onSubmit={handleSubmitBooking}>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-white font-outfit">
                                        Service Address & Details
                                    </h2>
                                    <span className="text-[11px] text-[#C8A55E] bg-[#C8A55E]/10 border border-[#C8A55E]/20 px-2.5 py-1 rounded-full font-medium">
                                        Pre-filled from profile
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA0AE] mb-1.5">
                                            Street Address
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="House No., Street Name, Area"
                                            value={address.street}
                                            onChange={(e) =>
                                                setAddress({ ...address, street: e.target.value })
                                            }
                                            className="w-full bg-[#14161E] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C8A55E]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA0AE] mb-1.5">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Manipal / Udupi"
                                                value={address.city}
                                                onChange={(e) =>
                                                    setAddress({ ...address, city: e.target.value })
                                                }
                                                className="w-full bg-[#14161E] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C8A55E]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA0AE] mb-1.5">
                                                Postal Code
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="576104"
                                                value={address.postalCode}
                                                onChange={(e) =>
                                                    setAddress({ ...address, postalCode: e.target.value })
                                                }
                                                className="w-full bg-[#14161E] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C8A55E]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA0AE] mb-1.5">
                                            Additional Gate Codes / Instructions (Optional)
                                        </label>
                                        <textarea
                                            rows={2}
                                            placeholder="Provide gate codes or landmark instructions for technician..."
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            className="w-full bg-[#14161E] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C8A55E]"
                                        />
                                    </div>

                                    {/* Pricing Terms Banner */}
                                    <div className="p-3.5 bg-[#14161E] border border-[#C8A55E]/20 rounded-xl text-xs text-[#9CA0AE]">
                                        <p className="flex items-start gap-2">
                                            <span className="text-[#C8A55E] mt-0.5">ℹ️</span>
                                            <span>
                                                <strong className="text-white">Pricing Policy:</strong> The cost displayed is a baseline visiting fee. Final charges are determined after detailed inspection by the technician based on task complexity and replacement parts.
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* Navigation Buttons */}
                        <div className="mt-8 flex items-center justify-between pt-6 border-t border-[rgba(255,255,255,0.06)]">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={handlePrevStep}
                                    className="px-5 py-2.5 rounded-xl border border-[rgba(255,255,255,0.1)] text-xs font-semibold text-[#9CA0AE] hover:text-white transition-colors"
                                >
                                    Back
                                </button>
                            ) : (
                                <div />
                            )}

                            {step < 3 ? (
                                <button
                                    type="button"
                                    disabled={
                                        (step === 1 && (!selectedService || (selectedService === "other" && !issueDescription.trim()))) ||
                                        (step === 2 && (!bookingDate || !finalTimeSlot.trim()))
                                    }
                                    onClick={handleNextStep}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A55E] via-[#E4D5A8] to-[#C8A55E] text-[#08090D] font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#C8A55E]/20 transition-all"
                                >
                                    Continue
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmitBooking}
                                    disabled={
                                        isSubmitting ||
                                        !address.street ||
                                        !address.city ||
                                        !address.postalCode
                                    }
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A55E] via-[#E4D5A8] to-[#C8A55E] text-[#08090D] font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#C8A55E]/20 transition-all flex items-center gap-2"
                                >
                                    {isSubmitting ? "Confirming..." : "Confirm & Book"}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Booking Summary Sidebar */}
                    <div className="bg-[#10121A] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 backdrop-blur-xl">
                        <h3 className="text-base font-semibold text-white font-outfit mb-4 pb-3 border-b border-[rgba(255,255,255,0.06)]">
                            Booking Summary
                        </h3>

                        <div className="space-y-4 text-xs">
                            <div>
                                <span className="text-[#5C6070] uppercase font-semibold block mb-1">
                                    Selected Service
                                </span>
                                {activeServiceObj ? (
                                    <div className="flex items-center gap-2 text-white font-medium">
                                        <span>{activeServiceObj.icon}</span>
                                        <span>{activeServiceObj.name}</span>
                                    </div>
                                ) : (
                                    <p className="text-[#5C6070] italic">Not selected yet</p>
                                )}
                            </div>

                            {issueDescription && (
                                <div>
                                    <span className="text-[#5C6070] uppercase font-semibold block mb-1">
                                        Issue Details
                                    </span>
                                    <p className="text-white font-medium line-clamp-2">
                                        {issueDescription}
                                    </p>
                                </div>
                            )}

                            <div>
                                <span className="text-[#5C6070] uppercase font-semibold block mb-1">
                                    Date & Time
                                </span>
                                {bookingDate && finalTimeSlot ? (
                                    <p className="text-white font-medium">
                                        {bookingDate} <br />
                                        <span className="text-[#C8A55E]">{finalTimeSlot}</span>
                                    </p>
                                ) : (
                                    <p className="text-[#5C6070] italic">Not selected yet</p>
                                )}
                            </div>

                            <div>
                                <span className="text-[#5C6070] uppercase font-semibold block mb-1">
                                    Location
                                </span>
                                {address.street ? (
                                    <p className="text-white font-medium truncate">
                                        {address.street}, {address.city}
                                    </p>
                                ) : (
                                    <p className="text-[#5C6070] italic">Not provided yet</p>
                                )}
                            </div>

                            <div className="pt-4 border-t border-[rgba(255,255,255,0.06)]">
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="font-semibold text-white">Estimated Base Cost</span>
                                    <span className="font-bold text-[#C8A55E] font-mono text-base">
                                        ${activeServiceObj ? activeServiceObj.basePrice : 0}
                                    </span>
                                </div>
                                <p className="text-[10px] text-[#5C6070] leading-tight">
                                    *Final charges depend on technician's inspection & materials required.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}