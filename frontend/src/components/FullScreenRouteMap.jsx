// src/components/FullScreenRouteMap.jsx
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import polyline from "@mapbox/polyline";

export default function FullScreenRouteMap({
  patientLat,
  patientLon,
  hospitalLat,
  hospitalLon,
  hospitalName,
  onClose,
}) {
  const mapRef = useRef(null);

  async function fetchRoute() {
    const url = `https://router.project-osrm.org/route/v1/driving/${patientLon},${patientLat};${hospitalLon},${hospitalLat}?overview=full&geometries=polyline`;
    const res = await fetch(url);
    const data = await res.json();
    return polyline.decode(data.routes[0].geometry);
  }

  useEffect(() => {
    const map = L.map("fullscreen-map").setView([patientLat, patientLon], 13);
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

    (async () => {
      const coords = await fetchRoute();
      L.polyline(coords, { color: "blue", weight: 5 }).addTo(map);
      map.fitBounds(coords);
    })();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-11/12 h-5/6 relative">
        <button
          className="absolute top-3 right-3 bg-red-500 text-white px-4 py-1 rounded-lg"
          onClick={onClose}
        >
          Close
        </button>

        <div className="p-3 font-semibold text-gray-800">{hospitalName}</div>

        <div id="fullscreen-map" className="w-full h-full rounded-b-xl" />
      </div>
    </div>
  );
}
