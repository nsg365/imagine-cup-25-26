export default function EmergencyAlert({ incident }) {
  if (!incident) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-white shadow-xl rounded-xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600">
          🚨 EMERGENCY DETECTED
        </h2>

        <p className="mt-2 text-gray-700">
          Pattern: {incident.detected_pattern || "Unknown"}
        </p>

        <p className="mt-1 text-gray-700">
          Triage Level: {incident.triage_level ?? "-"}
        </p>

        <div className="mt-4 space-y-3">
          <a
            href="tel:108"
            className="block w-full text-center bg-red-600 text-white font-semibold py-2 rounded-lg"
          >
            Call General Ambulance (108)
          </a>

          <a
            href="tel:9844604339"
            className="block w-full text-center bg-blue-600 text-white font-semibold py-2 rounded-lg"
          >
            Call Nearest Hospital Ambulance
          </a>
        </div>
      </div>
    </div>
  );
}
