"use client";

import React from "react";
import Link from "next/link";

interface NavLinkProps {
    href: string;
    label: string;
    active: boolean;
    gold?: boolean;
    mobile?: boolean;
    onClick?: () => void;
}

export function NavLink({
    href,
    label,
    active,
    gold,
    mobile,
    onClick,
}: NavLinkProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`relative font-medium font-inter transition-colors duration-200 group py-1 bg-transparent border-none shadow-none ${mobile
                    ? `flex items-center justify-between px-0 text-sm ${active ? "text-[#ECEDF0]" : "text-[#9CA0AE] hover:text-[#ECEDF0]"
                    }`
                    : `text-sm px-0.5 ${gold
                        ? "text-[#C8A55E] hover:text-[#E4D5A8]"
                        : active
                            ? "text-[#ECEDF0]"
                            : "text-[#9CA0AE] hover:text-[#ECEDF0]"
                    }`
                }`}
        >
            <span>{label}</span>
            <span
                className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-[#C8A55E] transition-all duration-300 ease-out ${active
                        ? "w-full opacity-100"
                        : "w-0 opacity-0 group-hover:w-full group-hover:opacity-60"
                    }`}
            />
        </Link>
    );
}