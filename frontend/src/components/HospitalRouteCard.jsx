// src/components/HospitalRouteCard.jsx
import HospitalRouteMiniMap from "./HospitalRouteMiniMap";
import { MapPin, ExternalLink, Phone } from "lucide-react";

export default function HospitalRouteCard({ hospital, patientLat, patientLon }) {
  return (
    <div className="bg-white shadow-sm border rounded-xl p-6 mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <MapPin className="text-blue-600" size={22} />
        Nearest Hospital Route
      </h2>

      <p className="text-gray-700 text-lg font-medium">{hospital.hospital_name}</p>

      <p className="mt-1 text-gray-600">
        ETA:{" "}
        <span className="font-bold text-gray-900">
          {hospital.eta_minutes} minutes
        </span>
      </p>

      <div className="mt-4">
        <HospitalRouteMiniMap
          patientLat={patientLat}
          patientLon={patientLon}
          hospitalLat={hospital.lat}
          hospitalLon={hospital.lon}
        />
      </div>

      <div className="mt-4 flex gap-6">
        <a
          href={`https://www.google.com/maps/dir/?api=1&origin=${patientLat},${patientLon}&destination=${hospital.lat},${hospital.lon}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          Expand View <ExternalLink size={16} />
        </a>

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
