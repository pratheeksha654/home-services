"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, getRoleBasedRoute } from "@/context/AuthContext";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user && user.role) {
        router.replace(getRoleBasedRoute(user.role));
      } else {
        router.replace("/login");
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-[#08090D] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#C8A55E] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
