"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

// Dynamically import the map component to avoid SSR issues with leaflet
const LocationMap = dynamic(() => import("./_components/LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-transparent">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

export default function LocationMapPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main className="w-full h-screen bg-linear-to-b from-app-dark-blue to-app-blue ">
      <LocationMap />
    </main>
  );
}
