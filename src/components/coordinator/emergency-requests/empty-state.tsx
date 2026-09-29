import { ClipboardX } from "lucide-react";

interface Props {
  message?: string;
}

export default function EmptyState({ message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#C8A55E]/15 bg-[#151922]">
        <ClipboardX size={28} className="text-[#5C6070]" />
      </div>
      <p className="text-base font-semibold text-[#ECEDF0]">
        No requests found
      </p>
      <p className="mt-2 text-sm text-[#5C6070]">
        {message ?? "Try adjusting the filters or search query."}
      </p>
    </div>
  );
}
