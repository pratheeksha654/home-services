import type { EmergencyRequest, Technician } from "@/app/types/coordinator";
import EmergencyRequestCard from "./EmergencyRequestCard";
import EmptyState from "./EmptyState";

interface Props {
  requests: EmergencyRequest[];
  technicians: Technician[];
  onAssign: (requestId: string, technicianId: string) => void;
  onReject?: (requestId: string) => void;
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
        // Filter technicians whose service categories include the request's category
        // This is the matching logic — swap technicians from API when ready
        const matching = technicians.filter((tech) =>
          tech.serviceCategories.includes(request.serviceCategory)
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
