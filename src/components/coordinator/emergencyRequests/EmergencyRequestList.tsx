import type { EmergencyRequest, Technician } from "@/app/types/coordinator";
import EmergencyRequestCard from "./EmergencyRequestCard";
import EmptyState from "./EmptyState";

interface Props {
  requests: EmergencyRequest[];
  technicians: Technician[];
  onAssign: (requestId: string, technicianId: string) => void;
  onReject?: (requestId: string) => void;
}

function matchesRequestCategory(
  technician: Technician,
  serviceCategory: EmergencyRequest["serviceCategory"]
) {
  if (serviceCategory === "Other") {
    return technician.availabilityStatus === "Available";
  }

  return technician.serviceCategories.includes(serviceCategory);
}

export default function EmergencyRequestList({
  requests,
  technicians,
  onAssign,
  onReject,
}: Props) {
  if (requests.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="mt-8 space-y-6">
      {requests.map((request) => {
        const matching = technicians.filter((tech) =>
          matchesRequestCategory(tech, request.serviceCategory)
        );

        return (
          <EmergencyRequestCard
            key={request.id}
            request={request}
            matchingTechnicians={matching}
            onAssign={onAssign}
            onReject={onReject}
          />
        );
      })}
    </div>
  );
}
