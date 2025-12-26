import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix Leaflet marker icons (Vite + React)
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function HospitalMiniMap({ lat, lon, hospitalName }) {
  if (!lat || !lon) {
    return (
      <div className="h-64 w-full rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
        Location unavailable
      </div>
    );
  }

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden shadow-lg border">
      <MapContainer
        center={[lat, lon]}
        zoom={15}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[lat, lon]}>
          <Popup>
            <div className="font-semibold text-slate-800">
              🏥 {hospitalName || "Selected Hospital"}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

