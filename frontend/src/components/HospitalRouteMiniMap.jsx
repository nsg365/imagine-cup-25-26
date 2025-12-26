// src/components/HospitalRouteMiniMap.jsx
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function HospitalRouteMiniMap({
  patientLat,
  patientLon,
  hospitalLat,
  hospitalLon,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!patientLat || !patientLon || !hospitalLat || !hospitalLon) return;
    if (!mapContainerRef.current) return;

    // Prevent double initialization
    if (mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      tap: false,
    });

    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const patientIcon = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

    const hospitalIcon = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/1483/1483336.png",
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

    const patientMarker = L.marker([patientLat, patientLon], {
      icon: patientIcon,
    }).addTo(map);

    const hospitalMarker = L.marker([hospitalLat, hospitalLon], {
      icon: hospitalIcon,
    }).addTo(map);

    const routeLine = L.polyline(
      [
        [patientLat, patientLon],
        [hospitalLat, hospitalLon],
      ],
      { color: "#2563eb", weight: 4 }
    ).addTo(map);

    map.fitBounds(routeLine.getBounds(), { padding: [20, 20] });

    // Cleanup on unmount
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [patientLat, patientLon, hospitalLat, hospitalLon]);

  return (
    <div
      ref={mapContainerRef}
      className="rounded-xl border shadow-sm overflow-hidden w-full h-80"
    />
  );
}
