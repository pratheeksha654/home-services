"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function NavbarWrapper() {
    const pathname = usePathname();

    // Hide Navbar during onboarding flows
    const shouldHideNavbar =
        pathname.startsWith("/onboarding") ||
        pathname.startsWith("/details");

    if (shouldHideNavbar) {
        return null;
    }

    return <Navbar />;
}