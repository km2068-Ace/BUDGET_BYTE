import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Users,
  Clock,
  ShieldAlert,
  Sparkles,
  Radio,
  Utensils,
  Navigation,
  Trees,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CampusZone, ZoneIntelligence } from '../types';

declare global {
  interface Window {
    google?: any;
    initGoogleMap?: () => void;
  }
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyAV1uAVuq7zo0EsRJMz4BB9muJt_Pi9ZN0';

export const CampusDigitalTwin: React.FC = () => {
  const { zones, currentEvent, setActiveTab, setConstraints } = useApp();
  const [selectedZone, setSelectedZone] = useState<ZoneIntelligence>(zones[0]);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    const coordinate = selectedZone.coordinates;
    if (!coordinate.lat || !coordinate.lng || !mapRef.current) return;

    const loadMap = () => {
      if (!window.google?.maps || !mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: coordinate.lat, lng: coordinate.lng },
        zoom: 18,
        mapTypeId: window.google.maps.MapTypeId.SATELLITE,
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        gestureHandling: 'greedy',
      });

      mapInstanceRef.current = map;

      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      zones.forEach((zone) => {
        if (!zone.coordinates.lat || !zone.coordinates.lng) return;

        const marker = new window.google.maps.Marker({
          position: { lat: zone.coordinates.lat, lng: zone.coordinates.lng },
          map,
          title: zone.displayName ?? zone.shortName,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: zone.zone === selectedZone.zone ? 9 : 7,
            fillColor: zone.zone === selectedZone.zone ? '#8b5cf6' : '#22c55e',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });

        markersRef.current.push(marker);
      });

      const bounds = new window.google.maps.LatLngBounds();
      zones.forEach((zone) => {
        if (zone.coordinates.lat && zone.coordinates.lng) {
          bounds.extend({ lat: zone.coordinates.lat, lng: zone.coordinates.lng });
        }
      });

      if (zones.some((zone) => zone.coordinates.lat && zone.coordinates.lng)) {
        map.fitBounds(bounds, 40);
      }

      map.setCenter({ lat: coordinate.lat, lng: coordinate.lng });
      map.setZoom(17);
    };

    if (window.google?.maps) {
      loadMap();
      return;
    }

    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      existingScript.addEventListener('load', loadMap, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initGoogleMap`;
    script.async = true;
    script.defer = true;
    script.onload = loadMap;
    document.head.appendChild(script);

    // Provide a global callback so Google can initialize reliably when the script loads.
    (window as any).initGoogleMap = loadMap;

    return () => {
      delete (window as any).initGoogleMap;
    };
  }, [selectedZone, zones]);

  const handleZoneSelect = (z: ZoneIntelligence) => setSelectedZone(z);

  const handleExploreFood = (z: CampusZone) => {
    setConstraints((prev) => ({ ...prev, zone: z }));
    setActiveTab('smart-meal');
  };

  const handleNavigateToSelectedZone = () => {
    const destinationName = selectedZone.displayName ?? selectedZone.shortName ?? 'VIT Vellore campus';
    const destinationQuery = encodeURIComponent(destinationName + ', ' + (selectedZone.location ?? 'VIT Vellore, Katpadi, Tamil Nadu'));

    const destinationCoords = selectedZone.coordinates;
    const mapsUrl = destinationCoords.lat && destinationCoords.lng
      ? `https://www.google.com/maps/dir/?api=1&destination=${destinationCoords.lat},${destinationCoords.lng}&travelmode=walking`
      : `https://www.google.com/maps/search/?api=1&query=${destinationQuery}`;

    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[30px] border border-violet-500/20 bg-slate-950/80 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.8)] backdrop-blur-2xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_30%)]" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-200">
            <MapPin className="h-3.5 w-3.5" />
            VIT Vellore • Campus Food Digital Twin
          </div>

          <h2 className="text-3xl font-black tracking-[-0.06em] text-white sm:text-5xl">
            Live campus dining <span className="text-transparent bg-gradient-to-r from-violet-300 via-indigo-300 to-emerald-300 bg-clip-text">demand mesh</span>
          </h2>

          <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Real-time crowd density, predicted meal demand, active rescue drops, and food surpluses across the VIT campus food network.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-slate-700 bg-slate-900/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">
              Scenario: <span className="text-amber-300">{currentEvent}</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Mesh online
            </span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="lg:col-span-8 rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-black text-white">VIT campus map</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-slate-400">
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Normal</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Busy</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Risk</span>
            </div>
          </div>

          <div className="relative h-[500px] overflow-hidden rounded-[26px] border border-slate-800 bg-[#050d1a] shadow-inner shadow-slate-950/70">
            <div ref={mapRef} className="h-full w-full" />

            <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-3">
              <div className="rounded-full border border-slate-700 bg-slate-950/75 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-slate-200 backdrop-blur-md">
                VIT Vellore Campus
              </div>
              <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-emerald-300 backdrop-blur-md">
                9 zones online
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-slate-300 backdrop-blur-xl">
              <span className="inline-flex items-center gap-2"><Navigation className="h-3.5 w-3.5 text-violet-300" /> Main campus loop</span>
              <span className="inline-flex items-center gap-2"><Trees className="h-3.5 w-3.5 text-emerald-300" /> Green corridor</span>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {zones.map((z) => (
              <button
                key={z.zone}
                onClick={() => handleZoneSelect(z)}
                className={`whitespace-nowrap rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-all ${
                  selectedZone.zone === z.zone
                    ? 'border-violet-500/40 bg-violet-500/10 text-violet-200'
                    : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {z.displayName ?? z.shortName}
              </button>
            ))}
          </div>
        </section>

        <section className="lg:col-span-4 rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-violet-300">Zone telemetry</div>
              <h3 className="mt-2 text-2xl font-black text-white">{selectedZone.displayName ?? selectedZone.shortName}</h3>
            </div>
            <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] ${
              selectedZone.surplusRisk === 'critical' || selectedZone.surplusRisk === 'high'
                ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                : selectedZone.surplusRisk === 'medium'
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
            }`}>
              {selectedZone.surplusRisk} risk
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
              <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">Crowd</div>
              <div className="flex items-center gap-2 text-white">
                <Users className="h-4 w-4 text-violet-300" />
                <span className="font-black">{selectedZone.currentCrowd}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
              <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">Wait</div>
              <div className="flex items-center gap-2 text-white">
                <Clock className="h-4 w-4 text-amber-300" />
                <span className="font-black">{selectedZone.avgWaitTimeMin}m</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
              <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">Demand</div>
              <div className="text-lg font-black text-violet-200">{selectedZone.predictedDemand}</div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
              <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">Rescue</div>
              <div className="text-lg font-black text-emerald-200">{selectedZone.activeRescueMeals}</div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">Location</div>
            <div className="text-sm font-semibold text-white">
              {selectedZone.displayName ?? selectedZone.shortName}
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              {selectedZone.location ?? 'VIT Vellore, Katpadi, Tamil Nadu'}
            </div>
            <div className="mt-2 text-[11px] text-violet-200">
              {selectedZone.coordinates.lat && selectedZone.coordinates.lng
                ? `${selectedZone.coordinates.lat.toFixed(4)}, ${selectedZone.coordinates.lng.toFixed(4)}`
                : 'Coordinates unavailable'}
            </div>

            <button
              onClick={handleNavigateToSelectedZone}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-violet-500/40 bg-violet-500/10 px-4 py-3 text-sm font-bold text-violet-200 transition hover:bg-violet-500/20"
            >
              <Navigation className="h-4 w-4" />
              Navigate
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="mb-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">Popular items</div>
            <div className="space-y-2">
              {selectedZone.popularItems.map((item) => (
                <div key={item} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-200">
                  <span>{item}</span>
                  <span className="text-emerald-300">High demand</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <button
              onClick={() => handleExploreFood(selectedZone.zone)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              <Utensils className="h-4 w-4" />
              Explore menu
            </button>

            {selectedZone.activeRescueMeals > 0 && (
              <button
                onClick={() => setActiveTab('rescue-radar')}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm font-bold text-amber-200"
              >
                <ShieldAlert className="h-4 w-4" />
                View rescue drops
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
