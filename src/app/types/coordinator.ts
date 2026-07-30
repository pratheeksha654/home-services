export type RequestStatus = "Pending" | "Assigned" | "In Progress" | "Resolved";
export type ServiceCategory =
  | "Electrical"
  | "Plumbing"
  | "Appliance Repair"
  | "AC Repair"
  | "Carpenter"
  | "Cleaning"
  | "Other";
export type Priority = "Critical" | "High" | "Medium" | "Low";
export type AvailabilityStatus = "Available" | "Busy" | "Offline";

export interface EmergencyRequest {
  id: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  serviceCategory: ServiceCategory;
  priority: Priority;
  status: RequestStatus;
  submittedAt: string;
  problemDescription: string;
  assignedTechnicianId?: string | null;
}

export interface Technician {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  serviceCategories: ServiceCategory[];
  availabilityStatus: AvailabilityStatus;
  rating: number;
  currentWorkload: number;
  location?: string;
  skills?: string[];
}

export interface FilterState {
  searchQuery: string;
  status: RequestStatus | "All";
  serviceCategory: ServiceCategory | "All";
  priority: Priority | "All";
}

export interface EmergencyRequestPayload {
  customerName: string;
  phoneNumber: string;
  address: string;
  serviceCategory: ServiceCategory;
  priority?: Priority;
  problemDescription: string;
}
