import { useEffect, useState } from "react";

export default function Reasoning() {
  const [incident, setIncident] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/incidents")
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setIncident(data[data.length - 1]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-blue-700">
          AI Medical Reasoning
        </h1>

        {!incident ? (
          <p className="text-gray-600">No incidents yet.</p>
        ) : (
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <p>
              <strong>Detected Condition:</strong>{" "}
              {incident.likely_condition || incident.detected_pattern || "Unknown"}
            </p>

            <p>
              <strong>Triage Level:</strong>{" "}
              {incident.triage_level ?? "Not assigned"}
            </p>

            <div>
              <strong>AI Reasoning:</strong>
              <p className="text-gray-700 mt-2">
                {incident.detected_pattern
                  ? `Vitals and/or patient input matched the ${incident.detected_pattern} pattern, triggering this decision.`
                  : "No AI reasoning available yet."}
              </p>
            </div>

            {incident.chosen_hospital_name && (
              <div>
                <strong>Routing Decision:</strong>
                <p className="text-gray-700 mt-1">
                  Patient routed to {incident.chosen_hospital_name}
                  {incident.eta_minutes && ` (ETA: ${incident.eta_minutes} mins)`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

