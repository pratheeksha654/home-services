import type {
  EmergencyRequest,
  EmergencyRequestPayload,
  ServiceCategory,
  Technician,
} from "@/app/types/dispatcher";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const normalizeText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const SERVICE_CATEGORY_KEYWORDS: Record<ServiceCategory, string[]> = {
  Electrical: ["electrician", "electrical", "electric", "wiring", "wire", "circuit", "fan", "light", "socket", "switch"],
  Plumbing: ["plumber", "plumbing", "pipe", "tap", "leak", "drain", "water", "bathroom", "toilet", "sink"],
  "Appliance Repair": ["appliance repair", "appliance", "fridge", "refrigerator", "washing machine", "microwave", "mixer", "oven"],
  "AC Repair": ["ac technician", "ac repair", "air condition", "hvac", "cooling", "compressor", "refrigerant"],
  Carpenter: ["carpenter", "carpentry", "wood", "furniture", "door", "cabinet", "shelf"],
  Cleaning: ["cleaner", "cleaning", "housekeeping", "sanitize", "mop", "dust", "sweep"],
  Other: [],
};

const inferServiceCategories = (text: string): ServiceCategory[] => {
  const normalized = text.toLowerCase();

  return (Object.keys(SERVICE_CATEGORY_KEYWORDS) as ServiceCategory[]).filter((category) => {
    if (category === "Other") {
      return false;
    }

    return SERVICE_CATEGORY_KEYWORDS[category].some((keyword) => normalized.includes(keyword));
  });
};

const normalizeServiceCategory = (value: unknown): ServiceCategory => {
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (normalized.includes("plumb")) return "Plumbing";
    if (normalized.includes("elect")) return "Electrical";
    if (normalized.includes("ac") || normalized.includes("hvac") || normalized.includes("air condition")) return "AC Repair";
    if (normalized.includes("appl")) return "Appliance Repair";
    if (normalized.includes("carp")) return "Carpenter";
    if (normalized.includes("clean")) return "Cleaning";
  }

  return "Other";
};

const normalizeStatus = (value: unknown) => {
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (normalized.includes("assign")) return "Assigned";
    if (normalized.includes("progress")) return "In Progress";
    if (normalized.includes("resolv")) return "Resolved";
  }

  return "Pending";
};

const normalizePriority = (value: unknown) => {
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (normalized.includes("crit")) return "Critical";
    if (normalized.includes("high")) return "High";
    if (normalized.includes("med")) return "Medium";
  }

  return "Low";
};

const normalizeTechnician = (value: unknown): Technician | null => {
  if (!isRecord(value)) return null;

  const profile = isRecord(value.profile) ? value.profile : null;

  const explicitCategories = Array.isArray(value.serviceCategories)
    ? (value.serviceCategories as string[]).map((category) => normalizeServiceCategory(category))
    : [];

  const skillCategories = normalizeText(value.skills)
    .split(/[,&/|\n]/)
    .flatMap((skill) => inferServiceCategories(skill));

  const serviceCategories = Array.from(
    new Set([...explicitCategories, ...skillCategories])
  ).filter((category) => category !== "Other");

  const normalizedServiceCategories: ServiceCategory[] =
    serviceCategories.length > 0 ? serviceCategories : ["Other"];

  const availabilityStatus =
    typeof value.availabilityStatus === "string"
      ? value.availabilityStatus
      : typeof value.availability === "string"
        ? value.availability
        : typeof value.currentStatus === "string"
          ? value.currentStatus
          : "Offline";

  const normalizedAvailability = availabilityStatus.toLowerCase();

  return {
    id: String(value.id ?? value.technician_id ?? value.technicianId ?? "tech-unknown"),
    name: String(
      value.name ??
      value.profile_name ??
      value.fullName ??
      profile?.name ??
      value.email ??
      "Unnamed technician"
    ),
    email: typeof value.email === "string" ? value.email : typeof profile?.email === "string" ? profile.email : undefined,
    phone: typeof value.phone === "string" ? value.phone : typeof profile?.phone === "string" ? profile.phone : undefined,
    serviceCategories: normalizedServiceCategories,
    availabilityStatus: (normalizedAvailability.includes("avail")
      ? "Available"
      : normalizedAvailability.includes("busy")
        ? "Busy"
        : "Offline") as Technician["availabilityStatus"],
    rating: typeof value.rating === "number" ? value.rating : 4.5,
    currentWorkload: typeof value.currentWorkload === "number"
      ? value.currentWorkload
      : typeof value.current_jobs === "number"
        ? value.current_jobs
        : 0,
    location: typeof value.location === "string" ? value.location : undefined,
    skills: Array.isArray(value.skills)
      ? value.skills.filter((skill): skill is string => typeof skill === "string")
      : typeof value.skills === "string"
        ? value.skills
          .split(/[,&/|\n]/)
          .map((skill) => skill.trim())
          .filter(Boolean)
        : [],
  };
};

export function mapEmergencyRequests(payload: unknown): EmergencyRequest[] {
  // GET /emergency-requests returns:
  // { success, message, data: { emergencyRequests: EmergencyRequest[], items, total } }
  // `items` is a legacy compatibility alias, so prefer the canonical field first.
  const items = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.emergencyRequests)
      ? payload.emergencyRequests
      : isRecord(payload) && Array.isArray(payload.items)
        ? payload.items
        : isRecord(payload) && isRecord(payload.data) && Array.isArray(payload.data.emergencyRequests)
          ? payload.data.emergencyRequests
          : isRecord(payload) && isRecord(payload.data) && Array.isArray(payload.data.items)
            ? payload.data.items
            : isRecord(payload) && isRecord(payload.data) && Array.isArray(payload.data.requests)
              ? payload.data.requests
        : isRecord(payload) && Array.isArray(payload.data)
          ? payload.data
          : isRecord(payload) && (typeof payload.id === "string" || typeof payload.customerName === "string")
            ? [payload]
            : [];

  const requests: EmergencyRequest[] = [];

  items.forEach((item) => {
    if (!isRecord(item)) return;

    const serviceCategory = normalizeServiceCategory(
      item.serviceCategory ?? item.service_category ?? item.category
    );

    const customerName =
      typeof item.customerName === "string"
        ? item.customerName
        : typeof item.customer_name === "string"
          ? item.customer_name
          : typeof item.name === "string"
            ? item.name
            : "Customer";

    const phoneNumber =
      typeof item.phoneNumber === "string"
        ? item.phoneNumber
        : typeof item.phone_number === "string"
          ? item.phone_number
          : typeof item.customerPhone === "string"
            ? item.customerPhone
            : typeof item.phone === "string"
              ? item.phone
              : "";

    const address =
      typeof item.address === "string"
        ? item.address
        : typeof item.customerAddress === "string"
          ? item.customerAddress
          : typeof item.customer_address === "string"
            ? item.customer_address
            : "";

    const problemDescription =
      typeof item.problemDescription === "string"
        ? item.problemDescription
        : typeof item.problem_description === "string"
          ? item.problem_description
          : typeof item.description === "string"
            ? item.description
            : "No description provided.";

    const submittedAt =
      typeof item.submittedAt === "string"
        ? item.submittedAt
        : typeof item.submitted_at === "string"
          ? item.submitted_at
          : typeof item.createdAt === "string"
            ? item.createdAt
            : typeof item.created_at === "string"
              ? item.created_at
              : new Date().toISOString();

    const status = normalizeStatus(item.status);
    const priority = normalizePriority(item.priority);

    requests.push({
      id: String(item.id ?? item._id ?? `${customerName}-${submittedAt}`),
      customerName,
      phoneNumber,
      address,
      serviceCategory,
      priority,
      status,
      submittedAt,
      problemDescription,
      assignedTechnicianId:
        typeof item.assignedTechnicianId === "string"
          ? item.assignedTechnicianId
          : typeof item.assigned_technician_id === "string"
            ? item.assigned_technician_id
            : null,
    });
  });

  return requests;
}

export function mapTechnicians(payload: unknown): Technician[] {
  const rawList = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.technicians)
      ? payload.technicians
      : isRecord(payload) && isRecord(payload.data) && Array.isArray(payload.data.technicians)
        ? payload.data.technicians
        : isRecord(payload) && Array.isArray(payload.data)
          ? payload.data
          : [];

  const technicians: Technician[] = [];

  rawList.forEach((item) => {
    const technician = normalizeTechnician(item);
    if (technician) {
      technicians.push(technician);
    }
  });

  return technicians;
}

export function buildEmergencyRequestPayload(
  payload: EmergencyRequestPayload & {
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    address?: string;
    city?: string;
    status?: string;
    description?: string;
    problemDescription?: string;
  }
) {
  return {
    customerName: payload.customerName,
    customerPhone: payload.customerPhone,
    customerEmail: payload.customerEmail,
    address: payload.address,
    city: payload.city,
    serviceCategory: payload.serviceCategory,
    priority: payload.priority,
    status: payload.status,
    description: payload.problemDescription ?? payload.description,
    problemDescription: payload.problemDescription,
    phoneNumber: payload.phoneNumber,
  };
}
