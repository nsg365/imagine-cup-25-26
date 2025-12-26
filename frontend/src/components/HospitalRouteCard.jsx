// src/components/HospitalRouteCard.jsx
import HospitalRouteMiniMap from "./HospitalRouteMiniMap";
import { MapPin, ExternalLink, Phone } from "lucide-react";

export default function HospitalRouteCard({ hospital, patientLat, patientLon }) {
  if (!hospital) return null;

  return (
    <div className="card mt-8">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
        <MapPin className="text-blue-600" size={22} />
        Nearest Hospital Route
      </h2>

      {/* Hospital Info */}
      <p className="text-slate-800 text-lg font-medium">
        🏥 {hospital.name || "Selected Hospital"}
      </p>

      {hospital.eta !== undefined && (
        <p className="mt-1 text-slate-600">
          ETA:{" "}
          <span className="font-bold text-slate-900">
            {hospital.eta} minutes
          </span>
        </p>
      )}

      {/* Mini Map */}
      {hospital.lat && hospital.lon && (
        <div className="mt-4">
          <HospitalRouteMiniMap
            patientLat={patientLat}
            patientLon={patientLon}
            hospitalLat={hospital.lat}
            hospitalLon={hospital.lon}
          />
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-6">
        {patientLat && patientLon && hospital.lat && hospital.lon && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&origin=${patientLat},${patientLon}&destination=${hospital.lat},${hospital.lon}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            Expand Route <ExternalLink size={16} />
          </a>
        )}

        <a
          href="tel:108"
          className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
        >
          <Phone size={16} /> Call Ambulance (108)
        </a>
      </div>
    </div>
  );
}
