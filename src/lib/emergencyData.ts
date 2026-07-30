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

const normalizeServiceCategory = (value: unknown): ServiceCategory => {
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (normalized.includes("plumb")) return "Plumbing";
    if (normalized.includes("elect")) return "Electrical";
    if (normalized.includes("ac")) return "AC Repair";
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

  const serviceCategories = Array.isArray(value.serviceCategories)
    ? (value.serviceCategories as string[]).map((category) => normalizeServiceCategory(category))
    : normalizeText(value.skills)
        .split(/[,&/|\n]/)
        .map((skill) => normalizeServiceCategory(skill))
        .filter((category, index, categories) => categories.indexOf(category) === index);

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
        value.profile?.name ??
        value.email ??
        "Unnamed technician"
    ),
    email: typeof value.email === "string" ? value.email : typeof value.profile?.email === "string" ? value.profile.email : undefined,
    phone: typeof value.phone === "string" ? value.phone : typeof value.profile?.phone === "string" ? value.profile.phone : undefined,
    serviceCategories,
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
  const items = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.items)
      ? payload.items
      : isRecord(payload) && isRecord(payload.data) && Array.isArray(payload.data.items)
        ? payload.data.items
        : isRecord(payload)
          ? [payload]
          : [];

  const requests: EmergencyRequest[] = [];

  items.forEach((item) => {
    if (!isRecord(item)) return;

    const serviceCategory = normalizeServiceCategory(item.serviceCategory);
    const customerName =
      typeof item.customerName === "string"
        ? item.customerName
        : typeof item.name === "string"
          ? item.name
          : "Customer";
    const phoneNumber =
      typeof item.phoneNumber === "string"
        ? item.phoneNumber
        : typeof item.customerPhone === "string"
          ? item.customerPhone
          : typeof item.phone === "string"
            ? item.phone
            : "";
    const address = typeof item.address === "string" ? item.address : typeof item.customerAddress === "string" ? item.customerAddress : "";
    const problemDescription =
      typeof item.problemDescription === "string"
        ? item.problemDescription
        : typeof item.description === "string"
          ? item.description
        : "No description provided.";
    const submittedAt =
      typeof item.submittedAt === "string"
        ? item.submittedAt
        : typeof item.createdAt === "string"
          ? item.createdAt
        : new Date().toISOString();
    const status = normalizeStatus(item.status);
    const priority = normalizePriority(item.priority);

    requests.push({
      id: String(item.id ?? `${customerName}-${submittedAt}`),
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
          : null,
    });
  });

  return requests;
}

export function mapTechnicians(payload: unknown): Technician[] {
  if (!Array.isArray(payload)) return [];

  const technicians: Technician[] = [];

  payload.forEach((item) => {
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
