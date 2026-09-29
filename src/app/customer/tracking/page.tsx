'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerTrackingRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/customer/track-booking');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#08090D] flex items-center justify-center text-[#9CA0AE]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#C8A55E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Redirecting to your active bookings...</p>
      </div>
    </div>
  );
}
