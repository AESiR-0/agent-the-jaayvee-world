'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

// Create a separate component for map events that can be dynamically imported
const MapEventsComponent = dynamic(() => import('./MapEventsComponent'), { ssr: false });

export default function LocationPicker({ onLocationSelect }: LocationPickerProps) {
  const [isClient, setIsClient] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([19.076, 72.877]); // Default to Mumbai
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    
    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
        }
      );
    } else {
      setIsLoading(false);
    }
  }, []);

  if (!isClient || isLoading) {
    return (
      <div className="h-48 w-full rounded-xl border border-border bg-accent-light flex items-center justify-center">
        <div className="text-foreground/70">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="h-48 w-full rounded-xl border border-border overflow-hidden">
      <MapContainer
        center={userLocation}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEventsComponent onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
}
