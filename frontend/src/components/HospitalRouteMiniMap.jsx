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

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(mapContainerRef.current).setView(
      [patientLat, patientLon],
      13
    );

    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const patientIcon = new L.Icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
      iconSize: [32, 32],
    });

    const hospitalIcon = new L.Icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/1483/1483336.png",
      iconSize: [32, 32],
    });

    L.marker([patientLat, patientLon], { icon: patientIcon }).addTo(map);
    L.marker([hospitalLat, hospitalLon], { icon: hospitalIcon }).addTo(map);

    L.polyline(
      [
        [patientLat, patientLon],
        [hospitalLat, hospitalLon],
      ],
      { color: "blue", weight: 4 }
    ).addTo(map);

    map.fitBounds([
      [patientLat, patientLon],
      [hospitalLat, hospitalLon],
    ]);
  }, [patientLat, patientLon, hospitalLat, hospitalLon]);

  return (
    <div
      ref={mapContainerRef}
      className="rounded-xl border shadow-sm overflow-hidden"
      style={{ width: "100%", height: "320px" }}
    />
  );
}
