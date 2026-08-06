export interface TechnicianJob {
  booking_id: string;
  customer_name: string;
  email: string;
  phone: string;
  service_category: string;
  problem_description: string;
  address: string;
  preferred_date: string;
  preferred_time: string;
  booking_type: string;
  status: string;
  priority?: string;
  assigned_technician?: string;
}

/**
 * Sorts technician jobs so that:
 * 1. Emergency bookings appear first
 * 2. Within each group, jobs are sorted by preferred_time ascending
 */
export function sortTechnicianJobs(jobs: TechnicianJob[]): TechnicianJob[] {
  return [...jobs].sort((a, b) => {
    const aIsEmergency = a.booking_type === "Emergency" || a.priority === "Emergency";
    const bIsEmergency = b.booking_type === "Emergency" || b.priority === "Emergency";

    if (aIsEmergency && !bIsEmergency) return -1;
    if (!aIsEmergency && bIsEmergency) return 1;

    // Both same type — sort by time
    const aTime = a.preferred_time || "";
    const bTime = b.preferred_time || "";
    return aTime.localeCompare(bTime);
  });
}
