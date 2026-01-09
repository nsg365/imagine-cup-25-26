// src/components/EmergencyAlert.jsx
import { AlertTriangle, MapPin, Phone, Star } from "lucide-react";

export default function EmergencyAlert({ incident }) {
  if (!incident || incident.triage_level < 4) return null;

  const condition =
    incident.likely_condition ||
    incident.detected_pattern ||
    "Unknown condition";

  const {
    triage_level,
    chosen_hospital_name,
    eta_minutes,
    route_info,
  } = incident;

  const address = route_info?.address;
  const rating = route_info?.rating;
  const reviews = route_info?.reviews;
  const lat = route_info?.lat;
  const lon = route_info?.lon;

  return (
    <div className="card border-l-4 border-red-600 bg-red-50 emergency-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 text-red-700 font-extrabold text-2xl">
        <AlertTriangle size={28} />
        Emergency Detected
      </div>

      {/* Condition */}
      <p className="mt-4 text-slate-800 text-lg">
        <strong>Condition:</strong> {condition}
      </p>

      {/* Triage */}
      <p className="text-slate-800 text-lg">
        <strong>Triage Level:</strong> {triage_level}
      </p>

      {/* Hospital Info */}
      {chosen_hospital_name ? (
        <div className="mt-4 p-4 bg-white rounded-xl border space-y-1">
          <p className="flex items-center gap-2 font-semibold text-slate-700">
            <MapPin size={18} className="text-blue-600" />
            {chosen_hospital_name}
          </p>

          {eta_minutes !== undefined && (
            <p className="text-slate-600">
              <strong>ETA:</strong> {eta_minutes} minutes
            </p>
          )}

          {address && (
            <p className="text-slate-600 text-sm">
              <strong>Address:</strong> {address}
            </p>
          )}

          {rating && (
            <p className="flex items-center gap-1 text-slate-600 text-sm">
              <Star size={14} className="text-yellow-500" />
              {rating} ({reviews} reviews)
            </p>
          )}
        </div>
      ) : (
        <p className="mt-4 text-gray-500 italic">
          Routing emergency services…
        </p>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3">
        <a
          href="tel:108"
          className="btn btn-danger emergency-pulse flex items-center gap-2 justify-center"
        >
          <Phone size={18} />
          Call Ambulance (108)
        </a>

        {lat && lon && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary text-center"
          >
            Open Route in Google Maps
          </a>
        )}
      </div>
    </div>
  );
}
