'use client';

import { useEffect, useState, use } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Clock, CheckCircle2, Navigation, MapPin, Truck, Wrench, PartyPopper, Play, Pause, RotateCcw, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TrackingMap = dynamic(() => import('@/components/TrackingMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#14161E] flex items-center justify-center text-[#9CA0AE] rounded-2xl">
      <div className="text-center">
        <MapPin className="w-8 h-8 mx-auto mb-2 animate-bounce text-[#C8A55E]" />
        <p>Loading Map...</p>
      </div>
    </div>
  )
});

interface TrackingData {
  bookingId: string;
  customerAddress?: string;
  technicianName: string;
  technicianPhone: string;
  technicianAvatar: string;
  currentStatus: string;
  statusLabel: string;
  completionRequested?: boolean;
  arrivalOtp: string;
  distanceKm?: number;
  etaMinutes?: number;
  technicianLocation: { lat: number; lng: number } | null;
  timeline: {
    status: string;
    label: string;
    description: string;
    timestamp: string | null;
    completed: boolean;
  }[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const STATUS_CONFIG: Record<string, { icon: any; color: string; bgColor: string; pulseColor: string }> = {
  assigned: { icon: CheckCircle2, color: 'text-blue-400', bgColor: 'bg-blue-500/10', pulseColor: 'bg-blue-500' },
  on_the_way: { icon: Truck, color: 'text-amber-400', bgColor: 'bg-amber-500/10', pulseColor: 'bg-amber-500' },
  arriving_soon: { icon: Navigation, color: 'text-orange-400', bgColor: 'bg-orange-500/10', pulseColor: 'bg-orange-500' },
  reached: { icon: MapPin, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', pulseColor: 'bg-emerald-500' },
  service_in_progress: { icon: Wrench, color: 'text-indigo-400', bgColor: 'bg-indigo-500/10', pulseColor: 'bg-indigo-500' },
  completed: { icon: PartyPopper, color: 'text-green-400', bgColor: 'bg-green-500/10', pulseColor: 'bg-green-500' },
};

export default function TrackingPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [prevStatus, setPrevStatus] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [customerLocation, setCustomerLocation] = useState<{lat: number, lng: number} | null>(null);

  const geocodeAddress = async (address: string) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setCustomerLocation({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
      } else {
        setCustomerLocation({ lat: 12.9352, lng: 77.6245 }); // Fallback
      }
    } catch (e) {
      setCustomerLocation({ lat: 12.9352, lng: 77.6245 }); // Fallback
    }
  };

  const fetchTracking = async () => {
    try {
      const res = await fetch(`${API_URL}/tracking/${resolvedParams.bookingId}`);
      const data = await res.json();
      if (data.success && data.data?.tracking) {
        const newTracking = data.data.tracking;
        
        // Detect status change for animation
        if (tracking && newTracking.currentStatus !== tracking.currentStatus) {
          setPrevStatus(tracking.currentStatus);
        }
        
        setTracking(newTracking);
        
        // Geocode customer address if not already done
        if (newTracking.customerAddress && !customerLocation) {
          geocodeAddress(newTracking.customerAddress);
        } else if (!newTracking.customerAddress && !customerLocation) {
          setCustomerLocation({ lat: 12.9352, lng: 77.6245 }); // Fallback
        }
      }
    } catch (error) {
      console.error('Error fetching tracking:', error);
    } finally {
      setLoading(false);
    }
  };

  // Regular tracking update loop
  useEffect(() => {
    fetchTracking();
    const interval = setInterval(fetchTracking, 1500);
    return () => clearInterval(interval);
  }, [resolvedParams.bookingId]);

  // Redirect to home when completed
  useEffect(() => {
    if (tracking?.currentStatus === 'completed') {
      const timer = setTimeout(() => {
        router.push('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [tracking?.currentStatus, router]);

  // Automated step simulation trigger
  const handleSimulateStep = async () => {
    try {
      const res = await fetch(`${API_URL}/tracking/${resolvedParams.bookingId}/simulate`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success && data.data?.tracking) {
        setTracking(data.data.tracking);
      }
    } catch (error) {
      console.error('Error simulating tracking step:', error);
    }
  };

  // Reset simulation trigger
  const handleResetSimulation = async () => {
    try {
      const res = await fetch(`${API_URL}/tracking/${resolvedParams.bookingId}/reset`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success && data.data?.tracking) {
        setTracking(data.data.tracking);
      }
    } catch (error) {
      console.error('Error resetting simulation state:', error);
    }
  };

  // Confirm arrival & start service
  const [confirmingArrival, setConfirmingArrival] = useState(false);
  const handleConfirmArrival = async () => {
    setConfirmingArrival(true);
    try {
      const res = await fetch(`${API_URL}/tracking/${resolvedParams.bookingId}/confirm-arrival`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success && data.data?.tracking) {
        setTracking(data.data.tracking);
      }
    } catch (error) {
      console.error('Error confirming arrival:', error);
    } finally {
      setConfirmingArrival(false);
    }
  };

  // Simulation timer loop
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      handleSimulateStep();
    }, 4000);
    return () => clearInterval(interval);
  }, [isSimulating, resolvedParams.bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090D] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#C8A55E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#9CA0AE]">Loading tracking details...</p>
        </div>
      </div>
    );
  }

  if (!tracking) {
    return (
      <div className="min-h-screen bg-[#08090D] flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-white text-lg font-semibold">Tracking information not found</p>
          <p className="text-[#9CA0AE] text-sm mt-2">This booking may not have tracking enabled yet.</p>
        </div>
      </div>
    );
  }

  const reachedOrCompleted = ['reached', 'service_in_progress', 'completed'].includes(tracking.currentStatus);
  const statusConf = STATUS_CONFIG[tracking.currentStatus] || STATUS_CONFIG.assigned;
  const StatusIcon = statusConf.icon;

  return (
    <div className="min-h-screen bg-[#08090D] text-[#ECEDF0] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Demo Simulator Control Bar */}
        <div className="mb-6 bg-[#14161E]/85 backdrop-blur-md border border-[#C8A55E]/30 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_0_20px_rgba(200,165,94,0.05)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C8A55E]/10 border border-[#C8A55E]/20 flex items-center justify-center text-[#C8A55E] shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C8A55E]">Evaluation Mode</span>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">Technician Live Tracking Simulator</h3>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md ${
                isSimulating 
                  ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {isSimulating ? (
                <>
                  <Pause size={14} />
                  <span>Pause Simulation</span>
                </>
              ) : (
                <>
                  <Play size={14} />
                  <span>Start Simulation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Status Banner */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tracking.currentStatus}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`mb-6 ${statusConf.bgColor} border border-[rgba(255,255,255,0.06)] rounded-2xl p-4 flex items-center justify-between`}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-3 h-3 ${statusConf.pulseColor} rounded-full animate-ping absolute`} />
                <div className={`w-3 h-3 ${statusConf.pulseColor} rounded-full relative`} />
              </div>
              <StatusIcon className={`w-6 h-6 ${statusConf.color}`} />
              <div>
                <p className="font-semibold text-white text-lg">{tracking.statusLabel}</p>
                <p className="text-sm text-[#9CA0AE]">Technician: {tracking.technicianName}</p>
              </div>
            </div>
            {!reachedOrCompleted && tracking.etaMinutes !== undefined && (
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{Math.ceil(tracking.etaMinutes)} min</p>
                <p className="text-xs text-[#9CA0AE]">{tracking.distanceKm?.toFixed(1)} km away</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Map - Takes 2 columns */}
          <div className="lg:col-span-2 h-[500px] relative rounded-3xl overflow-hidden shadow-xl border border-[rgba(255,255,255,0.06)] bg-[#14161E]">
            <TrackingMap 
              technicianLocation={tracking.technicianLocation}
              customerLocation={customerLocation || { lat: 12.9352, lng: 77.6245 }}
              technicianName={tracking.technicianName}
            />
            
            {/* Map overlay - technician info */}
            <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
              <div className="bg-[#14161E]/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg pointer-events-auto border border-[rgba(255,255,255,0.1)] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 border-2 border-[#C8A55E] shrink-0">
                  <img src={tracking.technicianAvatar} alt="Tech" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{tracking.technicianName}</p>
                  <p className={`text-xs font-medium ${statusConf.color}`}>{tracking.statusLabel}</p>
                </div>
              </div>
            </div>

            {/* Map legend */}
            <div className="absolute bottom-4 left-4 z-[1000] pointer-events-none">
              <div className="bg-[#14161E]/90 backdrop-blur-md px-3 py-2 rounded-xl border border-[rgba(255,255,255,0.1)] flex gap-4 text-xs text-[#9CA0AE]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#C8A55E] to-[#E4D5A8] border border-white" />
                  <span>Technician</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 border border-white" />
                  <span>You</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            
            {/* Service Completion Prompt - Shows whenever technician requests completion */}
            {tracking.completionRequested && tracking.currentStatus !== 'completed' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-950 border border-indigo-500/40 rounded-3xl p-6 text-center text-white shadow-2xl shadow-indigo-950/60"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3 border border-indigo-500/30">
                  <CheckCircle2 size={28} className="animate-bounce" />
                </div>
                <h4 className="text-lg font-bold text-white font-outfit">Technician Finished Work!</h4>
                <p className="text-xs text-indigo-200/80 mt-1 mb-5">
                  Your technician has marked the service as finished. Please verify: Is the service completed?
                </p>
                <button
                  onClick={async () => {
                    if (window.confirm("Is the service completed?")) {
                      try {
                        const res = await fetch(`${API_URL}/tracking/${resolvedParams.bookingId}/complete`, { method: "POST" });
                        const data = await res.json();
                        if (data.success && data.data?.tracking) {
                          setTracking(data.data.tracking);
                        }
                      } catch (e) {
                        console.error("Error completing service:", e);
                      }
                    }
                  }}
                  className="w-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white font-bold py-3.5 px-6 rounded-2xl text-sm shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  <span>Yes, Confirm Service Completed</span>
                </button>
              </motion.div>
            ) : (
              <>
                {/* Interactive Arrival Confirmation Card when Reached */}
                {tracking.currentStatus === 'reached' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 border border-emerald-500/40 rounded-3xl p-6 text-center text-white shadow-2xl shadow-emerald-950/60 relative overflow-hidden"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
                      <CheckCircle2 size={28} className="animate-bounce" />
                    </div>
                    <h4 className="text-lg font-bold text-[#FFFFFF] font-outfit">Technician Has Arrived!</h4>
                    <p className="text-xs text-emerald-200/80 mt-1 mb-5">
                      Your technician is at your location. Click below to confirm their arrival and start the service.
                    </p>
                    <button
                      onClick={handleConfirmArrival}
                      disabled={confirmingArrival}
                      className="w-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 text-black font-bold py-3.5 px-6 rounded-2xl text-sm shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles size={16} />
                      <span>{confirmingArrival ? "Starting Service..." : "Confirm Arrival & Start Service"}</span>
                    </button>
                  </motion.div>
                )}

                {/* Service In Progress Badge */}
                {tracking.currentStatus === 'service_in_progress' && (
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-5 text-center">
                    <Wrench className="w-10 h-10 text-indigo-400 mx-auto mb-2 animate-spin" style={{ animationDuration: '6s' }} />
                    <p className="text-white font-semibold text-lg">Service In Progress</p>
                    <p className="text-indigo-300/70 text-sm mt-1">Your technician is currently performing the service.</p>
                  </div>
                )}
              </>
            )}

            {/* Completed Badge */}
            {tracking.currentStatus === 'completed' && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-5 text-center">
                <PartyPopper className="w-10 h-10 text-green-400 mx-auto mb-2" />
                <p className="text-white font-semibold text-lg">Service Completed!</p>
                <p className="text-green-300/70 text-sm mt-1">Thank you for using HomeFixPro.</p>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-[#14161E]/60 border border-[rgba(255,255,255,0.06)] rounded-3xl p-5">
              <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider text-[#9CA0AE]">Service Timeline</h4>
              <div className="space-y-5">
                {tracking.timeline.map((item, index) => {
                  const isLast = index === tracking.timeline.length - 1;
                  const isCurrent = item.status === tracking.currentStatus;
                  return (
                    <div key={item.status} className="flex gap-3.5 relative">
                      {!isLast && (
                        <div className={`absolute left-[13px] top-7 bottom-[-20px] w-[2px] transition-colors duration-500 ${item.completed ? 'bg-indigo-500' : 'bg-[rgba(255,255,255,0.06)]'}`} />
                      )}
                      <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-500 ${
                        item.completed 
                          ? 'bg-indigo-500 border-indigo-500 text-white' 
                          : isCurrent
                          ? 'bg-[#C8A55E] border-[#C8A55E] text-white animate-pulse'
                          : 'bg-[#14161E] border-[rgba(255,255,255,0.1)] text-gray-600'
                      }`}>
                        {item.completed ? <CheckCircle2 size={14} /> : isCurrent ? <div className="w-2.5 h-2.5 bg-white rounded-full" /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />}
                      </div>
                      <div>
                        <p className={`font-medium text-sm transition-colors ${item.completed ? 'text-white' : isCurrent ? 'text-[#C8A55E]' : 'text-gray-500'}`}>
                          {item.label}
                        </p>
                        <p className="text-xs text-[#5C6070] mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
