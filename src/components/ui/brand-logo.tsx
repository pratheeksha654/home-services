"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth, getRoleBasedRoute } from "@/context/auth-context";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "gold";
  href?: string;
}

export default function BrandLogo({
  size = "md",
  variant = "gold",
  href,
}: BrandLogoProps) {
  const { user } = useAuth();
  const targetHref = href || (user?.role ? getRoleBasedRoute(user.role) : "/login");

  // Mapping sizes for flexibility if needed
  const logoDimensions = {
    sm: { width: 100, height: 40 },
    md: { width: 150, height: 60 },
    lg: { width: 200, height: 80 },
  };

  const { width, height } = logoDimensions[size];

  return (
    <div className="flex items-center gap-2.5">
      <Link href={targetHref} className="flex items-center gap-2.5 group flex-shrink-0">
        <Image
          src="/logo2.png"
          alt="FixNest Logo"
          width={width}
          height={height}
          priority
          className="object-contain mix-blend-screen h-auto"
        />
      </Link>
    </div>
  );
}