"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth, getRoleBasedRoute } from "@/context/auth-context";
import AuthGuard from "@/components/auth/auth-guard";
import {
  Search,
  UserPlus,
  Phone,
  User,
  Calendar,
  MapPin,
  FileText,
  Heart,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Clock,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  street?: string;
  city?: string;
  postalCode?: string;
  avatar?: string;
  age?: string | number;
}

interface BookingFormData {
  customer_name: string;
  phone: string;
  email: string;
  age: string;
  service_category: string;
  problem_description: string;
  address: string;
  city: string;
  pincode: string;
  preferred_date: string;
  preferred_time: string;
}

const SERVICE_OPTIONS = Array.from(new Set([
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "Cleaner",
  "AC Technician",
  "Appliance Repair",
  "Pest Control",
  "Other",
]));

const TIME_SLOTS = [
  { id: "slot1", label: "09:00 AM - 11:00 AM", time: "09:00 AM - 11:00 AM" },
  { id: "slot2", label: "11:00 AM - 01:00 PM", time: "11:00 AM - 01:00 PM" },
  { id: "slot3", label: "02:00 PM - 04:00 PM", time: "02:00 PM - 04:00 PM" },
  { id: "slot4", label: "04:00 PM - 06:00 PM", time: "04:00 PM - 06:00 PM" },
];

function CoordinatorOnlyWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role && user.role.toUpperCase() !== "COORDINATOR") {
      router.replace(getRoleBasedRoute(user.role));
    }
  }, [user, router]);

  if (!user || (user.role && user.role.toUpperCase() !== "COORDINATOR")) {
    return (
      <div className="min-h-screen bg-[#08090D] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-sm text-[#9CA0AE]">This page is only available for coordinators.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function CoordinatorElderlyBookingPage() {
  return (
    <AuthGuard>
      <CoordinatorOnlyWrapper>
        <ElderlyBookingContent />
      </CoordinatorOnlyWrapper>
    </AuthGuard>
  );
}

function ElderlyBookingContent() {
  const router = useRouter();
  const { user, getToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"standard" | "emergency">("standard");

  const [formData, setFormData] = useState<BookingFormData>({
    customer_name: "",
    phone: "",
    email: "",
    age: "",
    service_category: "",
    problem_description: "",
    address: "",
    city: "",
    pincode: "",
    preferred_date: "",
    preferred_time: "",
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [customServiceDescription, setCustomServiceDescription] = useState("");

  const [isCustomTime, setIsCustomTime] = useState(false);
  const [customFromTime, setCustomFromTime] = useState("");
  const [customToTime, setCustomToTime] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const formatTimeTo12Hour = (time24: string): string => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const customTimeRange = customFromTime && customToTime
    ? `${formatTimeTo12Hour(customFromTime)} - ${formatTimeTo12Hour(customToTime)}`
    : "";

  const searchUsers = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setErrorMessage(null);

    try {
      const token = getToken();
      const response = await fetch(
        `${API_URL}/users?search=${encodeURIComponent(searchQuery.trim())}`,
        {
          headers: {
            Authorization: `Bearer ${token || ""}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        const allUsers = data.data.users || [];
        const customerUsers = allUsers.filter((u: UserProfile) => u.role?.toUpperCase() === "CUSTOMER");
        setSearchResults(customerUsers);
      } else {
        setErrorMessage(data.message || "Failed to search users.");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setErrorMessage("Network error while searching users.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, API_URL, getToken]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchUsers();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, searchUsers]);

  const handleSelectUser = (profile: UserProfile) => {
    setSelectedUser(profile);
    const customerAge = profile.age ?? "";
    setFormData((prev) => ({
      ...prev,
      customer_name: profile.name || "",
      phone: profile.phone || "",
      email: profile.email || "",
      age: typeof customerAge === "number" ? String(customerAge) : String(customerAge || ""),
      address: profile.street || "",
      city: profile.city || "",
      pincode: profile.postalCode || "",
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "service_category") {
      setSelectedCategory(value);
    }
  };

  const handleTimeSlotSelect = (time: string) => {
    setFormData((prev) => ({ ...prev, preferred_time: time }));
    setIsCustomTime(false);
    setCustomFromTime("");
    setCustomToTime("");
  };

  const handleCustomTimeToggle = () => {
    setIsCustomTime((prev) => !prev);
    if (!isCustomTime) {
      setFormData((prev) => ({ ...prev, preferred_time: "" }));
      setCustomFromTime("");
      setCustomToTime("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!selectedUser) {
      setErrorMessage("Please search and select an existing customer before booking.");
      setIsSubmitting(false);
      return;
    }

    const finalPreferredTime = isEmergency
      ? "ASAP / Immediate Emergency"
      : (isCustomTime && customTimeRange ? customTimeRange : formData.preferred_time);

    const finalPreferredDate = isEmergency
      ? new Date().toISOString().split("T")[0]
      : formData.preferred_date;

    if (!isEmergency) {
      if (!finalPreferredDate) {
        setErrorMessage("Please select a preferred date for standard bookings.");
        setIsSubmitting(false);
        return;
      }
      if (!finalPreferredTime) {
        setErrorMessage("Please select a preferred time slot or input a custom time.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const token = getToken();
      const customerAge = Number(formData.age || 0);
      const isElderly = customerAge >= 60;

      // Construct a single address string combining line, city, and pincode
      const combinedAddress = [
        formData.address,
        formData.city,
        formData.pincode
      ].filter(Boolean).join(", ");

      const finalServiceCategory = formData.service_category === "Other"
        ? `Other - ${customServiceDescription}`
        : formData.service_category;

      const payload = isEmergency
        ? {
            customerName: formData.customer_name,
            customerPhone: formData.phone,
            customerEmail: formData.email,
            address: combinedAddress,
            city: formData.city || null,
            serviceCategory: finalServiceCategory,
            description: formData.problem_description || "Emergency service request",
            priority: "High",
            status: "pending",
            customerId: selectedUser.id,
          }
        : {
            customer_name: formData.customer_name,
            phone: formData.phone,
            email: formData.email,
            service_category: finalServiceCategory,
            problem_description: formData.problem_description || "Elderly care service request",
            address: combinedAddress,
            city: formData.city,
            pincode: formData.pincode,
            preferred_date: finalPreferredDate,
            preferred_time: finalPreferredTime,
            booking_type: isElderly ? "ELDERLY_CARE" : "NORMAL",
            bookingType: isElderly ? "ELDERLY_CARE" : "NORMAL",
            isElderlyCare: isElderly,
            customerId: selectedUser.id,
          };

      const url = isEmergency
        ? `${API_URL}/emergency-requests`
        : `${API_URL}/bookings`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || (isEmergency ? "Failed to create emergency request." : "Failed to create booking."));
      }

      setModalType(isEmergency ? "emergency" : "standard");
      setShowModal(true);

      setFormData({
        customer_name: "",
        phone: "",
        email: "",
        age: "",
        service_category: "",
        problem_description: "",
        address: "",
        city: "",
        pincode: "",
        preferred_date: "",
        preferred_time: "",
      });
      setSelectedCategory("");
      setCustomServiceDescription("");
      setSelectedUser(null);
      setSearchQuery("");
      setSearchResults([]);
      setCustomFromTime("");
      setCustomToTime("");
      setIsCustomTime(false);
      setIsEmergency(false);
    } catch (error) {
      console.error("Error creating elderly booking:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to create booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#08090D] text-[#ECEDF0] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C8A55E] mb-3">
            <Heart className="w-4 h-4" />
            <span>Elderly Care Services</span>
          </div>
          <h1 className="text-4xl font-bold font-outfit text-white">
            Phone-Assisted Booking
          </h1>
          <p className="mt-2 text-sm text-[#9CA0AE] max-w-2xl">
            Search for an existing customer to create an elderly care booking.
          </p>
        </div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Customer Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#10121A] p-6"
        >
          {!selectedUser ? (
            <>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-[#C8A55E]" />
                Search Existing Customer
              </h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, email, or phone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#0B0D12] px-4 py-3 pl-12 text-sm text-[#ECEDF0] placeholder:text-[#5C6070] focus:border-[#C8A55E] focus:outline-none transition-colors"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C6070]" />
                {isSearching && (
                  <RefreshCw className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C8A55E] animate-spin" />
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-4 space-y-2 max-h-56 overflow-y-auto border border-gray-800 rounded-xl bg-[#10121A] p-2">
                  {searchResults.map((profile) => (
                    <div
                      key={profile.id}
                      onClick={() => handleSelectUser(profile)}
                      className="flex items-center justify-between p-3.5 rounded-lg border border-[rgba(255,255,255,0.04)] bg-[#14161E] hover:bg-[#1A1D28] hover:border-[#C8A55E]/40 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1A1D28] border border-[rgba(200,165,94,0.3)] flex items-center justify-center text-[#C8A55E] font-bold text-xs">
                          {profile.avatar ? (
                            <img src={profile.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            profile.name?.charAt(0).toUpperCase() || "?"
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{profile.name}</p>
                          <p className="text-xs text-[#9CA0AE]">{profile.email} | {profile.phone}</p>
                          {profile.age && (
                            <p className="text-[10px] text-[#C8A55E] font-medium mt-0.5">Age: {profile.age}</p>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded bg-[#C8A55E]/10 text-[#C8A55E] text-xs font-bold border border-[#C8A55E]/20"
                      >
                        Select
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#C8A55E]/10 border border-[#C8A55E]/20">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-[#C8A55E]" />
                <div>
                  <p className="text-sm font-semibold text-white">Selected Customer Profile</p>
                  <p className="text-xs text-[#9CA0AE] mt-1">
                    {selectedUser.name} | {selectedUser.email} | {selectedUser.phone}
                    {selectedUser.age && ` | Age: ${selectedUser.age}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedUser(null);
                  setSearchQuery("");
                  setSearchResults([]);
                  setFormData((prev) => ({
                    ...prev,
                    customer_name: "",
                    phone: "",
                    email: "",
                    age: "",
                    address: "",
                    city: "",
                    pincode: "",
                  }));
                  setSelectedCategory("");
                  setCustomServiceDescription("");
                }}
                className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-semibold border border-red-500/20 transition-all"
              >
                Change Customer
              </button>
            </div>
          )}
        </motion.div>

        {/* Booking Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#10121A] p-6 sm:p-8 space-y-8"
        >

          {/* Emergency Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#10121A] border border-[rgba(255,255,255,0.06)]">
            <div>
              <p className="text-sm font-semibold text-white">Emergency / High Priority</p>
              <p className="text-xs text-[#9CA0AE]">Mark this booking as an urgent emergency request</p>
            </div>
            <button
              type="button"
              onClick={() => setIsEmergency(!isEmergency)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                isEmergency ? "bg-red-500" : "bg-[#14161E]"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 rounded-full bg-white transition-transform ${
                  isEmergency ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Section 1: Senior Resident Details */}
          <div className="space-y-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9CA0AE] flex items-center gap-2">
              <User className="w-4 h-4" />
              Senior Resident Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-[#9CA0AE] mb-2 font-medium">
                  Senior Resident Name <span className="text-[#C8A55E]">*</span>
                </label>
                <input
                  type="text"
                  name="customer_name"
                  required
                  readOnly={!!selectedUser}
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  placeholder="Full name of senior resident"
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-white focus:outline-none transition-colors ${
                    selectedUser
                      ? "bg-[#14161E]/50 text-[#9CA0AE] cursor-not-allowed border-[rgba(255,255,255,0.04)]"
                      : "bg-[#12141D] border-[rgba(255,255,255,0.1)] focus:border-[#C8A55E]"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs text-[#9CA0AE] mb-2 font-medium">Age</label>
                <input
                  type="number"
                  name="age"
                  readOnly={!!selectedUser}
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Age"
                  min="1"
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-white focus:outline-none transition-colors ${
                    selectedUser
                      ? "bg-[#14161E]/50 text-[#9CA0AE] cursor-not-allowed border-[rgba(255,255,255,0.04)]"
                      : "bg-[#12141D] border-[rgba(255,255,255,0.1)] focus:border-[#C8A55E]"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs text-[#9CA0AE] mb-2 font-medium">
                  Phone Number <span className="text-[#C8A55E]">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  readOnly={!!selectedUser}
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-white focus:outline-none transition-colors ${
                    selectedUser
                      ? "bg-[#14161E]/50 text-[#9CA0AE] cursor-not-allowed border-[rgba(255,255,255,0.04)]"
                      : "bg-[#12141D] border-[rgba(255,255,255,0.1)] focus:border-[#C8A55E]"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs text-[#9CA0AE] mb-2 font-medium">Email Address</label>
                <input
                  type="email"
                  name="email"
                  readOnly={!!selectedUser}
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-white focus:outline-none transition-colors ${
                    selectedUser
                      ? "bg-[#14161E]/50 text-[#9CA0AE] cursor-not-allowed border-[rgba(255,255,255,0.04)]"
                      : "bg-[#12141D] border-[rgba(255,255,255,0.1)] focus:border-[#C8A55E]"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Service Details */}
          <div className="space-y-5 pt-6 border-t border-[rgba(255,255,255,0.06)]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9CA0AE] flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Service Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className={isEmergency ? "sm:col-span-2" : ""}>
                <label className="block text-xs text-[#9CA0AE] mb-2 font-medium">
                  Service Type <span className="text-[#C8A55E]">*</span>
                </label>
                <select
                  name="service_category"
                  required
                  value={formData.service_category}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#12141D] px-4 py-3 text-sm text-white focus:border-[#C8A55E] focus:outline-none transition-colors"
                >
                  <option value="">Select service type</option>
                  {SERVICE_OPTIONS.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCategory === "Other" && (
                <div className={isEmergency ? "sm:col-span-2" : ""}>
                  <label className="block text-xs text-[#9CA0AE] mb-2 font-medium">
                    Custom Service Description <span className="text-[#C8A55E]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customServiceDescription}
                    onChange={(e) => setCustomServiceDescription(e.target.value)}
                    placeholder="Describe custom service (e.g. Gardening, Locksmith)"
                    className="w-full rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#12141D] px-4 py-3 text-sm text-white focus:border-[#C8A55E] focus:outline-none transition-colors"
                  />
                </div>
              )}

              {!isEmergency && (
                <>
                  <div>
                    <label className="block text-xs text-[#9CA0AE] mb-2 font-medium">
                      PREFERRED DATE <span className="text-[#C8A55E]">*</span>
                    </label>
                    <input
                      type="date"
                      name="preferred_date"
                      required={!isEmergency}
                      value={formData.preferred_date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#10121A] px-4 py-3 text-sm text-white focus:border-[#C8A55E] focus:outline-none transition-colors"
                      style={{ colorScheme: "dark" }}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs text-[#9CA0AE] font-medium">
                        PREFERRED TIME SLOT <span className="text-[#C8A55E]">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleCustomTimeToggle}
                        className="text-xs text-[#C8A55E] hover:text-[#E4D5A8] font-semibold transition-colors"
                      >
                        {isCustomTime ? "← Predefined Slots" : "+ Custom Time"}
                      </button>
                    </div>

                    {!isCustomTime ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {TIME_SLOTS.map((slot) => {
                          const isSelected = formData.preferred_time === slot.time;
                          return (
                            <button
                              key={slot.id}
                              type="button"
                              onClick={() => handleTimeSlotSelect(slot.time)}
                              className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#C8A55E] text-[#08090D] border-[#C8A55E] shadow-md shadow-[#C8A55E]/20"
                                  : "bg-[#14161E] text-[#9CA0AE] border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.2)] hover:text-white"
                              }`}
                            >
                              <p className="text-sm font-semibold">{slot.time}</p>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#9CA0AE]">From:</span>
                          <input
                            type="time"
                            value={customFromTime}
                            onChange={(e) => setCustomFromTime(e.target.value)}
                            className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#12141D] px-3 py-2 text-sm text-white focus:border-[#C8A55E] focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#9CA0AE]">To:</span>
                          <input
                            type="time"
                            value={customToTime}
                            onChange={(e) => setCustomToTime(e.target.value)}
                            className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#12141D] px-3 py-2 text-sm text-white focus:border-[#C8A55E] focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
              <div className="sm:col-span-2">
                <label className="block text-xs text-[#9CA0AE] mb-2 font-medium">
                  Street Address <span className="text-[#C8A55E]">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C6070]" />
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House No., Building, Street Name"
                    className="w-full rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#12141D] pl-12 pr-4 py-3 text-sm text-white focus:border-[#C8A55E] focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#9CA0AE] mb-2 font-medium">
                  City <span className="text-[#C8A55E]">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="w-full rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#12141D] px-4 py-3 text-sm text-white focus:border-[#C8A55E] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-[#9CA0AE] mb-2 font-medium">
                  Pincode / Postal Code <span className="text-[#C8A55E]">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="Pincode"
                  className="w-full rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#12141D] px-4 py-3 text-sm text-white focus:border-[#C8A55E] focus:outline-none transition-colors"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-[#9CA0AE] mb-2 font-medium">
                  Problem Description / Special Instructions
                </label>
                <textarea
                  name="problem_description"
                  value={formData.problem_description}
                  onChange={handleInputChange}
                  placeholder="Describe the service needed and any special instructions for the technician..."
                  rows={3}
                  className="w-full rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#12141D] px-4 py-3 text-sm text-white focus:border-[#C8A55E] focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-xl border border-[rgba(255,255,255,0.1)] text-xs font-semibold text-[#9CA0AE] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                isEmergency
                  ? "bg-gradient-to-r from-red-500 to-amber-500 text-white hover:shadow-red-500/30"
                  : "bg-gradient-to-r from-[#C8A55E] via-[#E4D5A8] to-[#C8A55E] text-[#08090D] hover:shadow-[#C8A55E]/20"
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Creating Booking...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Create Elderly Booking
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>

      {/* Dynamic Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#10121A] p-6 text-center shadow-2xl"
            >
              {/* Icon */}
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#C8A55E]/10 border border-[#C8A55E]/20">
                <Check className="h-8 w-8 text-[#C8A55E]" />
              </div>

              {/* Modal Content */}
              {modalType === "standard" ? (
                <>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Booking Confirmed!
                  </h3>
                  <p className="text-sm text-[#9CA0AE] mb-6">
                    Your service request has been created and added to the coordinator pending queue.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      router.push("/coordinator/dashboard");
                    }}
                    className="w-full rounded-xl bg-[#C8A55E] px-4 py-3 text-sm font-semibold text-[#08090D] shadow-lg shadow-[#C8A55E]/20 hover:bg-[#E4D5A8] transition-all"
                  >
                    Done
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Emergency Request Dispatched!
                  </h3>
                  <p className="text-sm text-[#9CA0AE] mb-6">
                    This high-priority request has been logged in the Emergency Request queue.
                  </p>
                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        router.push("/coordinator/emergency-requests");
                      }}
                      className="w-full rounded-xl bg-[#C8A55E] px-4 py-3 text-sm font-semibold text-[#08090D] shadow-lg shadow-[#C8A55E]/20 hover:bg-[#E4D5A8] transition-all"
                    >
                      Go to Emergency Requests
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-transparent hover:bg-white/5 px-4 py-3 text-sm font-semibold text-[#9CA0AE] hover:text-white transition-all"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
