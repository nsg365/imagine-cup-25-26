import { useEffect, useState } from "react";
import SidebarLayout from "../layout/SidebarLayout";
import axios from "axios";

export default function IncidentHistory() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/incidents")
      .then(res => setIncidents(res.data));
  }, []);

  return (
    <SidebarLayout>
      <h1 className="text-3xl font-bold mb-6">📜 Incident History</h1>

      <div className="space-y-4">
        {incidents.map((i, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl shadow border"
          >
            <p><strong>Condition:</strong> {i.likely_condition}</p>
            <p><strong>Triage:</strong> {i.triage_level}</p>
            <p><strong>Hospital:</strong> {i.chosen_hospital_name || "—"}</p>
            <p className="text-sm text-gray-500 mt-1">
              Incident ID: {i.incident_id}
            </p>
          </div>
        ))}
      </div>
    </SidebarLayout>
  );
}
