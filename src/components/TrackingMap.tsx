'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom SVG icons as data URIs for reliability
const CUSTOMER_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234F46E5" stroke="white" stroke-width="1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>`;
const TECH_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23C8A55E" stroke="white" stroke-width="1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>`;

const customerIcon = L.divIcon({
  html: `<div style="width:36px;height:36px;background:#4F46E5;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  </div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const techIcon = L.divIcon({
  html: `<div style="width:42px;height:42px;background:linear-gradient(135deg,#C8A55E,#E4D5A8);border:3px solid white;border-radius:50%;box-shadow:0 2px 12px rgba(200,165,94,0.5);display:flex;align-items:center;justify-content:center;transition:all 0.3s">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
  </div>`,
  className: '',
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

interface TrackingMapProps {
  technicianLocation: { lat: number; lng: number } | null;
  customerLocation: { lat: number; lng: number };
  technicianName?: string;
}

export default function TrackingMap({ technicianLocation, customerLocation, technicianName }: TrackingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const techMarkerRef = useRef<L.Marker | null>(null);
  const custMarkerRef = useRef<L.Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize the map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const center = technicianLocation || customerLocation;
    const map = L.map(mapContainerRef.current, {
      center: [center.lat, center.lng],
      zoom: 14,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Add customer marker (fixed position)
    const cMarker = L.marker([customerLocation.lat, customerLocation.lng], { icon: customerIcon })
      .addTo(map)
      .bindPopup('📍 Your Location');
    custMarkerRef.current = cMarker;

    // Add technician marker if we have a location
    if (technicianLocation) {
      const tMarker = L.marker([technicianLocation.lat, technicianLocation.lng], { icon: techIcon })
        .addTo(map)
        .bindPopup(`🔧 ${technicianName || 'Technician'}`);
      techMarkerRef.current = tMarker;
    }

    mapInstanceRef.current = map;
    setMapReady(true);

    // Fix map rendering
    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      techMarkerRef.current = null;
      custMarkerRef.current = null;
    };
  }, []); // Only run once on mount

  // Update technician marker position when coordinates change
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;
    if (!technicianLocation) return;

    const map = mapInstanceRef.current;
    const newLatLng = L.latLng(technicianLocation.lat, technicianLocation.lng);

    if (techMarkerRef.current) {
      // Smoothly animate the marker to the new position
      techMarkerRef.current.setLatLng(newLatLng);
    } else {
      // Create the marker if it doesn't exist yet
      const tMarker = L.marker([technicianLocation.lat, technicianLocation.lng], { icon: techIcon })
        .addTo(map)
        .bindPopup(`🔧 ${technicianName || 'Technician'}`);
      techMarkerRef.current = tMarker;
    }

    // Pan the map to keep both markers visible
    const bounds = L.latLngBounds([
      [customerLocation.lat, customerLocation.lng],
      [technicianLocation.lat, technicianLocation.lng],
    ]);
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15, animate: true, duration: 1 });

  }, [technicianLocation?.lat, technicianLocation?.lng, mapReady]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full rounded-2xl"
      style={{ minHeight: '400px' }}
    />
  );
}
