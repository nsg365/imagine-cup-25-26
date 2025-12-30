import { useEffect, useState } from "react";
import axios from "axios";

export default function IncidentHistory() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/incidents")
      .then(res => setIncidents(res.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">📜 Incident History</h1>

      {incidents.map((i, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl shadow">
          <p><strong>Condition:</strong> {i.likely_condition}</p>
          <p><strong>Triage:</strong> {i.triage_level}</p>
          <p><strong>Hospital:</strong> {i.chosen_hospital_name || "—"}</p>
        </div>
      ))}
    </div>
  );
}
