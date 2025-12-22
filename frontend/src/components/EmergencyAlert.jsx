// src/components/EmergencyAlert.jsx
import { AlertTriangle, MapPin, Phone } from "lucide-react";

export default function EmergencyAlert({ incident }) {
  if (!incident) return null;

  // Extract exactly the fields that exist in your backend
  const condition = incident.likely_condition || incident.detected_pattern;
  const triage = incident.triage_level;
  const hospital = incident.chosen_hospital_name;
  const eta = incident.eta_minutes;

  const address = incident.route_info?.address;
  const rating = incident.route_info?.rating;
  const reviews = incident.route_info?.reviews;

  return (
    <div className="bg-white border border-red-300 shadow-lg rounded-xl p-6 mt-8">
      {/* Header */}
      <div className="flex items-center gap-3 text-red-700 font-bold text-2xl">
        <AlertTriangle size={28} />
        EMERGENCY DETECTED
      </div>

      {/* Condition */}
      <p className="mt-3 text-gray-800 text-lg">
        <strong>Condition:</strong> {condition}
      </p>

      {/* Triage */}
      <p className="mt-1 text-gray-800 text-lg">
        <strong>Triage Level:</strong> {triage}
      </p>

      {/* Hospital */}
      {hospital && (
        <p className="mt-3 text-gray-800 flex items-center gap-2">
          <MapPin size={20} className="text-blue-600" />
          <strong>Hospital:</strong> {hospital}
        </p>
      )}

      {/* ETA */}
      {eta !== undefined && (
        <p className="text-gray-700 mt-1">
          <strong>ETA:</strong> {eta} minutes
        </p>
      )}

      {/* Address */}
      {address && (
        <p className="text-gray-700 mt-1">
          <strong>Address:</strong> {address}
        </p>
      )}

      {/* Rating */}
      {rating && (
        <p className="text-gray-700 mt-1">
          <strong>Hospital Rating:</strong> ⭐ {rating} ({reviews} reviews)
        </p>
      )}

      {/* Action Buttons */}
      <div className="mt-5 flex flex-col gap-2">
        <a
          href="tel:108"
          className="text-red-600 font-semibold hover:text-red-800 flex items-center gap-2"
        >
          <Phone size={18} /> Call General Ambulance (108)
        </a>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${incident.route_info?.lat},${incident.route_info?.lon}`}
          target="_blank"
          className="text-blue-600 font-semibold hover:text-blue-800"
        >
          Open Hospital Route in Google Maps
        </a>
      </div>
    </div>
  );
}
