// src/pages/Reasoning.jsx
import { useEffect, useState } from "react";
import SidebarLayout from "../layout/SidebarLayout";

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
    <SidebarLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-blue-700">
          AI Medical Reasoning
        </h1>

        {!incident ? (
          <p className="text-gray-600">No incidents yet.</p>
        ) : (
          <div className="card space-y-4">

            <p>
              <strong>Detected Condition:</strong>{" "}
              {incident.likely_condition || incident.detected_pattern}
            </p>

            <p>
              <strong>Triage Level:</strong>{" "}
              {incident.triage_level}
            </p>

            {incident.confidence !== undefined && (
              <p>
                <strong>Confidence:</strong>{" "}
                {(incident.confidence * 100).toFixed(0)}%
              </p>
            )}

            <div>
              <strong>AI Explanation:</strong>
              <ul className="list-disc ml-6 mt-2 text-gray-700">
                {incident.explanation?.length > 0 ? (
                  incident.explanation.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))
                ) : (
                  <li>No explanation available</li>
                )}
              </ul>
            </div>

            {incident.justification && (
              <div>
                <strong>Hospital Selection Logic:</strong>
                <p className="text-gray-700 mt-1">
                  {incident.justification}
                </p>
              </div>
            )}

          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
