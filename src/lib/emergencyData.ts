import type {
  EmergencyRequest,
  EmergencyRequestPayload,
  ServiceCategory,
  Technician,
} from "@/app/types/dispatcher";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

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
    : [];

  const availabilityStatus =
    typeof value.availabilityStatus === "string"
      ? value.availabilityStatus
      : "Offline";

  return {
    id: String(value.id ?? "tech-unknown"),
    name: String(value.name ?? "Unnamed technician"),
    email: typeof value.email === "string" ? value.email : undefined,
    phone: typeof value.phone === "string" ? value.phone : undefined,
    serviceCategories,
    availabilityStatus: availabilityStatus as Technician["availabilityStatus"],
    rating: typeof value.rating === "number" ? value.rating : 4.5,
    currentWorkload: typeof value.currentWorkload === "number" ? value.currentWorkload : 0,
    location: typeof value.location === "string" ? value.location : undefined,
    skills: Array.isArray(value.skills)
      ? value.skills.filter((skill): skill is string => typeof skill === "string")
      : [],
  };
};

export function mapEmergencyRequests(payload: unknown): EmergencyRequest[] {
  if (!Array.isArray(payload)) return [];

  const requests: EmergencyRequest[] = [];

  payload.forEach((item) => {
    if (!isRecord(item)) return;

    const serviceCategory = normalizeServiceCategory(item.serviceCategory);
    const customerName =
      typeof item.customerName === "string"
        ? item.customerName
        : "Customer";
    const phoneNumber =
      typeof item.phoneNumber === "string" ? item.phoneNumber : "";
    const address = typeof item.address === "string" ? item.address : "";
    const problemDescription =
      typeof item.problemDescription === "string"
        ? item.problemDescription
        : "No description provided.";
    const submittedAt =
      typeof item.submittedAt === "string"
        ? item.submittedAt
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
  payload: EmergencyRequestPayload
): EmergencyRequestPayload {
  return payload;
}
