export interface NavItem {
    href: string;
    label: string;
    gold?: boolean;
}

export const ROLE_NAV_LINKS: Record<string, NavItem[]> = {
    ADMIN: [
        { href: "/admin/dashboard", label: "Dashboard" },
        { href: "/admin/users", label: "Manage Users" },
        { href: "/admin/coordinators", label: "Coordinators" },
        { href: "/admin/settings", label: "Settings" },
    ],
    COORDINATOR: [
        { href: "/coordinator/dashboard", label: "Home" },
        { href: "/coordinator/applications", label: "Applications" },
        { href: "/about", label: "About Us" },
    ],
    CUSTOMER: [
        { href: "/customer", label: "Home" },
        { href: "/about", label: "About Us" },
        { href: "/customer/book", label: "Book Service" },
        { href: "/customer/track-booking", label: "Track Booking" },
        { href: "/customer/services", label: "My Services" },
    ],
    TECHNICIAN: [
        { href: "/technician", label: "Home" },
        { href: "/about", label: "About Us" },
        { href: "/technician/activejobs", label: "Active Jobs" },
        { href: "/technician/schedule", label: "Schedule" },
        { href: "/earnings", label: "Earnings" },
    ],
    GUEST: [
        { href: "/", label: "Home" },
        { href: "/about", label: "About Us" },
    ],
};

// Aliases
ROLE_NAV_LINKS.TECHNICIAN_PENDING = ROLE_NAV_LINKS.TECHNICIAN;


/**
 * Returns the navigation items array for a given user role.
 */
export function getNavLinksForRole(role?: string | null): NavItem[] {
    if (!role) return ROLE_NAV_LINKS.GUEST;
    const key = role.toUpperCase().trim();
    return ROLE_NAV_LINKS[key] || ROLE_NAV_LINKS.GUEST;
}

/**
 * Helper to check if a navigation item is currently active based on pathname.
 */
export function isNavItemActive(href: string, pathname: string): boolean {
    if (href === "/" || href === "/customer" || href === "/technician") {
        return pathname === href;
    }
    return pathname === href || pathname.startsWith(href);
}