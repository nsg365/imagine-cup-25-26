import { AlertTriangle } from "lucide-react";

export default function EmergencyAlert({ incident }) {
  if (!incident) return null;

  // Safe fallback values
  const pattern = incident.pattern || "Unknown";
  const triage = incident.triage_level || "N/A";
  const nearestPhone =
    incident?.route_info?.phone || incident?.hospital_phone || null;

  return (
    <div className="bg-white shadow-md border border-red-300 rounded-lg p-5 mt-6">
      <div className="flex items-center gap-3 text-red-700 font-bold text-xl">
        <AlertTriangle size={26} />
        EMERGENCY DETECTED
      </div>

      <div className="mt-3 text-gray-700">
        <p>
          <strong>Pattern:</strong> {pattern}
        </p>
        <p className="mt-1">
          <strong>Triage Level:</strong> {triage}
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex flex-col gap-2">
        {/* General ambulance */}
        <a
          href="tel:108"
          className="text-blue-700 underline hover:text-blue-900"
        >
          Call General Ambulance (108)
        </a>

        {/* Nearest hospital ambulance */}
        {nearestPhone ? (
          <a
            href={`tel:${nearestPhone}`}
            className="text-blue-700 underline hover:text-blue-900"
          >
            Call Nearest Hospital Ambulance
          </a>
        ) : (
          <span className="text-gray-500 italic">
            Nearest hospital number unavailable
          </span>
        )}
      </div>
    </div>
  );
}
