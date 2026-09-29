import { Search, SlidersHorizontal } from "lucide-react";
import type { FilterState, RequestStatus, ServiceCategory, Priority } from "@/app/types/coordinator";

const STATUS_OPTIONS: Array<RequestStatus | "All"> = [
  "All",
  "Pending",
  "Assigned",
  "In Progress",
  "Resolved",
];

const CATEGORY_OPTIONS: Array<ServiceCategory | "All"> = [
  "All",
  "Electrical",
  "Plumbing",
  "AC Repair",
  "Appliance Repair",
  "Carpenter",
  "Cleaning",
  "Other",
];

const PRIORITY_OPTIONS: Array<Priority | "All"> = [
  "All",
  "Critical",
  "High",
  "Medium",
  "Low",
];

interface Props {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  totalCount: number;
  filteredCount: number;
}

export default function SearchFilterBar({
  filters,
  onChange,
  totalCount,
  filteredCount,
}: Props) {
  const selectClass =
    "rounded-xl border border-[#C8A55E]/15 bg-[#1A1D28] px-4 py-2.5 text-sm text-[#ECEDF0] outline-none transition focus:border-[#C8A55E]/40 cursor-pointer";

  return (
    <div className="mt-10 space-y-4">
      {/* Search + result count row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-xl">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C6070]"
          />
          <input
            type="text"
            placeholder="Search by customer name, phone or address…"
            value={filters.searchQuery}
            onChange={(e) => onChange({ searchQuery: e.target.value })}
            className="w-full rounded-xl border border-[#C8A55E]/15 bg-[#1A1D28] py-2.5 pl-10 pr-4 text-sm text-[#ECEDF0] outline-none placeholder:text-[#5C6070] transition focus:border-[#C8A55E]/40"
          />
        </div>

        {/* Result count */}
        <p className="text-sm text-[#5C6070] whitespace-nowrap">
          Showing{" "}
          <span className="text-[#C8A55E] font-semibold">{filteredCount}</span>{" "}
          of{" "}
          <span className="text-[#ECEDF0] font-semibold">{totalCount}</span>{" "}
          requests
        </p>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 text-xs font-medium text-[#5C6070] uppercase tracking-widest">
          <SlidersHorizontal size={13} />
          Filters
        </span>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) =>
            onChange({ status: e.target.value as RequestStatus | "All" })
          }
          className={selectClass}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "All" ? "All Statuses" : s}
            </option>
          ))}
        </select>

        {/* Service Category */}
        <select
          value={filters.serviceCategory}
          onChange={(e) =>
            onChange({
              serviceCategory: e.target.value as ServiceCategory | "All",
            })
          }
          className={selectClass}
        >
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All Categories" : c}
            </option>
          ))}
        </select>

        {/* Priority */}
        <select
          value={filters.priority}
          onChange={(e) =>
            onChange({ priority: e.target.value as Priority | "All" })
          }
          className={selectClass}
        >
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p === "All" ? "All Priorities" : p}
            </option>
          ))}
        </select>

        {/* Clear filters */}
        {(filters.status !== "All" ||
          filters.serviceCategory !== "All" ||
          filters.priority !== "All" ||
          filters.searchQuery) && (
          <button
            onClick={() =>
              onChange({
                searchQuery: "",
                status: "All",
                serviceCategory: "All",
                priority: "All",
              })
            }
            className="rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 text-sm text-[#9CA0AE] transition hover:bg-white/10 hover:text-[#ECEDF0]"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
