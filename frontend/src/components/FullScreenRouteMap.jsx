// src/components/FullScreenRouteMap.jsx
import { useEffect, useRef } from "react";
import L from "leaflet";
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
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${patientLon},${patientLat};${hospitalLon},${hospitalLat}?overview=full&geometries=polyline`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.routes || !data.routes.length) return null;
      return polyline.decode(data.routes[0].geometry);
    } catch (e) {
      console.error("Route fetch failed", e);
      return null;
    }
  }

  useEffect(() => {
    if (mapRef.current) return; // prevent double init

    const map = L.map("fullscreen-map", {
      zoomControl: false,
    }).setView([patientLat, patientLon], 13);

    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const patientIcon = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    const hospitalIcon = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/1483/1483336.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    const patientMarker = L.marker([patientLat, patientLon], {
      icon: patientIcon,
    }).addTo(map);

    const hospitalMarker = L.marker([hospitalLat, hospitalLon], {
      icon: hospitalIcon,
    }).addTo(map);

    (async () => {
      const coords = await fetchRoute();
      if (coords) {
        const routeLine = L.polyline(coords, {
          color: "#2563eb",
          weight: 5,
        }).addTo(map);

        map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
      } else {
        map.fitBounds(
          [
            [patientLat, patientLon],
            [hospitalLat, hospitalLon],
          ],
          { padding: [40, 40] }
        );
      }
    })();

    return () => {
      map.remove();          // CLEANUP
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-11/12 h-5/6 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-slate-800">
            Route to {hospitalName}
          </h3>

          <button
            className="bg-red-600 text-white px-4 py-1.5 rounded-lg hover:bg-red-700 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {/* Map */}
        <div id="fullscreen-map" className="w-full h-full" />
      </div>
    </div>
  );
}
