'use client';

import { useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import { Marker } from 'react-leaflet';

interface MapEventsComponentProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

export default function MapEventsComponent({ onLocationSelect }: MapEventsComponentProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });

  return position ? <Marker position={position} /> : null;
}
