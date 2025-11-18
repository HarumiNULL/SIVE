// src/components/MapPicker.tsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapPicker({
  initialPosition,
  onChange,
}: {
  initialPosition?: { lat: number; lng: number } | null;
  onChange: (pos: { lat: number; lng: number }) => void;
}) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    initialPosition || null
  );

  // Actualiza el marcador si cambian las coordenadas iniciales (cuando llegan del backend)
  useEffect(() => {
    if (initialPosition) setPosition(initialPosition);
  }, [initialPosition]);

  // Maneja clics en el mapa
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      onChange({ lat, lng });
    },
  });

  // Si existe marcador, hacerlo arrastrable
  return position ? (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const newPos = e.target.getLatLng();
          setPosition(newPos);
          onChange(newPos);
        },
      }}
      icon={customIcon}
    />
  ) : null;
}

// Envolver MapPicker con MapContainer para usar en tu formulario
export function MapPickerContainer({
  initialPosition,
  onChange,
}: {
  initialPosition?: { lat: number; lng: number } | null;
  onChange: (pos: { lat: number; lng: number }) => void;
}) {
  const center = initialPosition || { lat: 4.8166, lng: -74.3545 }; // Faca por defecto
  return (
    <div style={{ height: "300px", width: "100%", borderRadius: "10px", overflow: "hidden" }}>
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapPicker initialPosition={initialPosition} onChange={onChange} />
      </MapContainer>
    </div>
  );
}
