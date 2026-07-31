"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface UserAddressShape {
    street?: string;
    streetAddress?: string;
    city?: string;
    postalCode?: string;
    zipCode?: string;
}

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

    // Form State for Prompt Requirements:
    // Customer Name, Phone Number, Email, Service Category, Problem Description, Address, Preferred Date, Preferred Time
    const [customerName, setCustomerName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [issueDescription, setIssueDescription] = useState<string>("");
    const [bookingDate, setBookingDate] = useState<string>("");

    // Time Slot Selection State
    const [timeSlot, setTimeSlot] = useState<string>("");
    const [isCustomTime, setIsCustomTime] = useState<boolean>(false);
    const [customTimeSlot, setCustomTimeSlot] = useState<string>("");

    // Address State
    const [address, setAddress] = useState({
        street: "",
        city: "",
        postalCode: "",
    });

    const [notes, setNotes] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<boolean>(false);

    // Get today's date formatted for HTML date picker min attribute
    const todayDateStr = new Date().toISOString().split("T")[0];

    // Auto-fill customer info & address from AuthContext when user profile loads
    useEffect(() => {
        if (!user) return;

        setCustomerName(user.name || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");

        setAddress({
            street: user.street || "",
            city: user.city || "",
            postalCode: user.postalCode || "",
        });
    }, [user]);

    const activeServiceObj = SERVICES.find((s) => s.id === selectedService);
    const finalTimeSlot = isCustomTime ? customTimeSlot : timeSlot;

    const handleNextStep = () => {
        setErrorMsg(null);
        if (step === 1) {
            if (!selectedService) {
                setErrorMsg("Please select a service category.");
                return;
            }
            if (selectedService === "other" && !issueDescription.trim()) {
                setErrorMsg("Please describe the issue.");
                return;
            }
        }
        if (step === 2) {
            if (!bookingDate) {
                setErrorMsg("Please select a preferred date.");
                return;
            }
            if (!finalTimeSlot.trim()) {
                setErrorMsg("Please select or enter a preferred time slot.");
                return;
            }
        }
        setStep((prev) => (prev + 1) as 2 | 3);
    };

    const handlePrevStep = () => {
        setErrorMsg(null);
        setStep((prev) => (prev - 1) as 1 | 2);
    };

    const resetForm = () => {
        setSelectedService(null);
        setIssueDescription("");
        setBookingDate("");
        setTimeSlot("");
        setCustomTimeSlot("");
        setIsCustomTime(false);
        setNotes("");
        if (!user) {
            setCustomerName("");
            setPhone("");
            setEmail("");
            setAddress({ street: "", city: "", postalCode: "" });
        }
        setStep(1);
    };

    const handleSubmitBooking = async (e?: React.FormEvent | React.MouseEvent) => {
        if (e && typeof e.preventDefault === "function") {
            e.preventDefault();
        }
        setErrorMsg(null);

        // Check Step 1 fields
        if (!selectedService) {
            setErrorMsg("Service Category is required. Please select a service.");
            setStep(1);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        if (!issueDescription.trim()) {
            setErrorMsg("Problem Description is required. Please describe your issue.");
            setStep(1);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        // Check Step 2 fields
        if (!bookingDate) {
            setErrorMsg("Preferred Date is required. Please pick a date.");
            setStep(2);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        if (!finalTimeSlot || !finalTimeSlot.trim()) {
            setErrorMsg("Preferred Time slot is required. Please select or enter a time.");
            setStep(2);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        // Check Step 3 fields
        if (!customerName.trim()) {
            setErrorMsg("Customer Name is required.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        if (!phone.trim()) {
            setErrorMsg("Phone Number is required.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        if (!email.trim()) {
            setErrorMsg("Email is required.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        if (!address.street.trim() || !address.city.trim() || !address.postalCode.trim()) {
            setErrorMsg("Full Address (Street, City, Postal Code) is required.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        setIsSubmitting(true);

        try {
            const formattedAddress = `${address.street}, ${address.city}, ${address.postalCode}`;
            const serviceCategoryName = activeServiceObj ? activeServiceObj.name : selectedService;

            const payload = {
                customer_name: customerName,
                phone: phone,
                email: email,
                service_category: serviceCategoryName,
                problem_description: issueDescription,
                address: formattedAddress,
                preferred_date: bookingDate,
                preferred_time: finalTimeSlot,
                booking_type: "Normal",
                notes: notes,
            };

            const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
            const response = await fetch(`${backendUrl}/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to submit booking.");
            }

            setSuccessMsg(true);
            resetForm();
            setTimeout(() => {
                setSuccessMsg(false);
                router.push("/customer");
            }, 3000);
        } catch (err: any) {
            console.error("Booking error:", err);
            setErrorMsg(err.message || "An unexpected error occurred while saving your booking.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#08090D] text-[#ECEDF0] py-10 px-4 sm:px-6 lg:px-8 font-inter">
            <div className="max-w-5xl mx-auto">
                {/* Success Notification Modal */}
                {successMsg && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
                        <div className="bg-[#10121A] border border-[#C8A55E] rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl">
                            <div className="w-16 h-16 bg-[#C8A55E]/20 text-[#C8A55E] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                ✓
                            </div>
                            <h3 className="text-2xl font-bold font-outfit text-white mb-2">
                                Booking Confirmed!
                            </h3>
                            <p className="text-sm text-[#9CA0AE] mb-6">
                                Your service request has been sent to our backend database and is now pending coordinator assignment.
                            </p>
                            <button
                                onClick={() => setSuccessMsg(false)}
                                className="w-full py-2.5 rounded-xl bg-[#C8A55E] text-[#08090D] font-semibold text-sm hover:opacity-90 transition-opacity"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold font-outfit text-white tracking-tight">
                        Book a Service
                    </h1>
                    <p className="mt-2 text-sm text-[#9CA0AE]">
                        Select a service, describe the issue, pick your preferred date & time slot, and our coordinator will assign an expert.
                    </p>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                    <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                        <span>⚠️</span>
                        <span>{errorMsg}</span>
                    </div>
                )}

                {/* Step Indicator Bar */}
                <div className="flex items-center justify-center mb-10 max-w-xl mx-auto">
                    {[
                        { num: 1, title: "Service & Issue" },
                        { num: 2, title: "Schedule" },
                        { num: 3, title: "Contact & Address" },
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

                {/* Main Form Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Form Step Area */}
                    <div className="lg:col-span-2 bg-[#10121A] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
                        {/* STEP 1: SELECT SERVICE & ISSUE */}
                        {step === 1 && (
                            <div>
                                <h2 className="text-xl font-semibold text-white font-outfit mb-4">
                                    Select Required Service Category
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                    {SERVICES.map((srv) => {
                                        const isSelected = selectedService === srv.id;
                                        return (
                                            <button
                                                key={srv.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedService(srv.id);
                                                    setErrorMsg(null);
                                                }}
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

                                {/* Problem Description */}
                                {selectedService && (
                                    <div className="pt-4 border-t border-[rgba(255,255,255,0.08)]">
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA0AE] mb-2">
                                            Problem Description <span className="text-[#C8A55E]">*</span>
                                        </label>
                                        <textarea
                                            rows={3}
                                            required
                                            value={issueDescription}
                                            onChange={(e) => setIssueDescription(e.target.value)}
                                            placeholder="Describe what needs repair or servicing in detail..."
                                            className="w-full bg-[#14161E] border border-[rgba(255,255,255,0.12)] rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-[#C8A55E] focus:ring-1 focus:ring-[#C8A55E] transition-colors"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 2: DATE & TIME */}
                        {step === 2 && (
                            <div>
                                <h2 className="text-xl font-semibold text-white font-outfit mb-4">
                                    Select Preferred Date & Time
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA0AE] mb-2">
                                            Preferred Date <span className="text-[#C8A55E]">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={bookingDate}
                                            onChange={(e) => setBookingDate(e.target.value)}
                                            min={todayDateStr}
                                            className="w-full bg-[#14161E] border border-[rgba(255,255,255,0.12)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C8A55E] focus:ring-1 focus:ring-[#C8A55E] transition-colors"
                                            style={{ colorScheme: "dark" }}
                                        />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA0AE]">
                                                Preferred Time Slot <span className="text-[#C8A55E]">*</span>
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsCustomTime(!isCustomTime);
                                                    if (!isCustomTime) setTimeSlot("");
                                                }}
                                                className="text-xs text-[#C8A55E] hover:underline font-medium transition-colors"
                                            >
                                                {isCustomTime ? "← Predefined Slots" : "+ Custom Time"}
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
                                            <div>
                                                <input
                                                    type="text"
                                                    value={customTimeSlot}
                                                    onChange={(e) => setCustomTimeSlot(e.target.value)}
                                                    placeholder="e.g. 07:30 PM - 08:30 PM"
                                                    className="w-full bg-[#14161E] border border-[rgba(255,255,255,0.12)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C8A55E] focus:ring-1 focus:ring-[#C8A55E] transition-colors"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: CONTACT & ADDRESS */}
                        {step === 3 && (
                            <div>
                                <h2 className="text-xl font-semibold text-white font-outfit mb-4">
                                    Customer Contact & Service Address
                                </h2>

                                <div className="space-y-4">
                                    {/* Customer Name */}
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA0AE] mb-1.5">
                                            Customer Name <span className="text-[#C8A55E]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter your full name"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            className="w-full bg-[#14161E] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C8A55E]"
                                        />
                                    </div>

                                    {/* Phone & Email */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA0AE] mb-1.5">
                                                Phone Number <span className="text-[#C8A55E]">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="+91 98765 43210"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full bg-[#14161E] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C8A55E]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA0AE] mb-1.5">
                                                Email Address <span className="text-[#C8A55E]">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="name@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-[#14161E] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C8A55E]"
                                            />
                                        </div>
                                    </div>

                                    {/* Street Address */}
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA0AE] mb-1.5">
                                            Street Address <span className="text-[#C8A55E]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="House No., Building / Street Name, Area"
                                            value={address.street}
                                            onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                            className="w-full bg-[#14161E] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C8A55E]"
                                        />
                                    </div>

                                    {/* City & Postal Code */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA0AE] mb-1.5">
                                                City <span className="text-[#C8A55E]">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Bangalore"
                                                value={address.city}
                                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                                className="w-full bg-[#14161E] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C8A55E]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA0AE] mb-1.5">
                                                Postal Code <span className="text-[#C8A55E]">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="560001"
                                                value={address.postalCode}
                                                onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                                                className="w-full bg-[#14161E] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C8A55E]"
                                            />
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA0AE] mb-1.5">
                                            Additional Notes / Landmark (Optional)
                                        </label>
                                        <textarea
                                            rows={2}
                                            placeholder="Provide landmarks or special instructions for the coordinator/technician..."
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            className="w-full bg-[#14161E] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C8A55E]"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Controls */}
                        {errorMsg && (
                            <div className="mt-6 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                                <span>⚠️</span>
                                <span>{errorMsg}</span>
                            </div>
                        )}
                        <div className="mt-6 flex items-center justify-between pt-6 border-t border-[rgba(255,255,255,0.06)]">
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
                                    onClick={handleNextStep}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A55E] via-[#E4D5A8] to-[#C8A55E] text-[#08090D] font-semibold text-xs hover:shadow-lg hover:shadow-[#C8A55E]/20 transition-all"
                                >
                                    Continue
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmitBooking}
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A55E] via-[#E4D5A8] to-[#C8A55E] text-[#08090D] font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#C8A55E]/20 transition-all flex items-center gap-2"
                                >
                                    {isSubmitting ? "Submitting..." : "Confirm & Submit Booking"}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="sticky top-6 bg-[#10121A] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 backdrop-blur-xl">
                        <h3 className="text-base font-semibold text-white font-outfit mb-4 pb-3 border-b border-[rgba(255,255,255,0.06)]">
                            Booking Summary
                        </h3>

                        <div className="space-y-4 text-xs">
                            <div>
                                <span className="text-[#5C6070] uppercase font-semibold block mb-1">
                                    Customer
                                </span>
                                <p className="text-white font-medium">
                                    {customerName || "Not entered"}
                                </p>
                                {phone && <p className="text-[#9CA0AE]">{phone}</p>}
                                {email && <p className="text-[#9CA0AE]">{email}</p>}
                            </div>

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
                                        Problem Description
                                    </span>
                                    <p className="text-white font-medium line-clamp-2">
                                        {issueDescription}
                                    </p>
                                </div>
                            )}

                            <div>
                                <span className="text-[#5C6070] uppercase font-semibold block mb-1">
                                    Preferred Date & Time
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
                                    Address
                                </span>
                                {address.street ? (
                                    <p className="text-white font-medium truncate">
                                        {address.street}, {address.city} {address.postalCode}
                                    </p>
                                ) : (
                                    <p className="text-[#5C6070] italic">Not provided yet</p>
                                )}
                            </div>

                            <div className="pt-4 border-t border-[rgba(255,255,255,0.06)]">
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="font-semibold text-white">Booking Type</span>
                                    <span className="font-bold text-[#C8A55E] font-mono text-xs bg-[#C8A55E]/10 px-2 py-0.5 rounded border border-[#C8A55E]/20">
                                        Normal
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}