"use client";

import React from "react";

const ROLE_CONFIG: Record<
    string,
    { label: string; color: string; bg: string; border: string }
> = {
    CUSTOMER: {
        label: "Customer",
        color: "#C8A55E",
        bg: "#C8A55E14",
        border: "#C8A55E30",
    },
    TECHNICIAN: {
        label: "Technician",
        color: "#34D399",
        bg: "#34D39914",
        border: "#34D39930",
    },
    TECHNICIAN_PENDING: {
        label: "Pending Review",
        color: "#FBBF24",
        bg: "#FBBF2414",
        border: "#FBBF2430",
    },
    COORDINATOR: {
        label: "Coordinator",
        color: "#818CF8",
        bg: "#818CF814",
        border: "#818CF830",
    },
    ADMIN: {
        label: "Admin",
        color: "#F87171",
        bg: "#F8717114",
        border: "#F8717130",
    },
};

export function RoleBadge({ role }: { role: string }) {
    const normalizedKey = role ? role.toUpperCase().trim() : "CUSTOMER";
    const c = ROLE_CONFIG[normalizedKey] || ROLE_CONFIG.CUSTOMER;

    return (
        <span
            className="inline-block text-[10px] font-semibold font-mono tracking-wider px-2.5 py-0.5 rounded-full"
            style={{
                color: c.color,
                background: c.bg,
                border: `1px solid ${c.border}`,
            }}
        >
            {c.label}
        </span>
    );
}