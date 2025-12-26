import { useEffect, useState } from "react";
import SidebarLayout from "../layout/SidebarLayout";
import axios from "axios";

export default function Reasoning() {
  const [incident, setIncident] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/incidents")
      .then(res => {
        if (res.data.length > 0) {
          setIncident(res.data[res.data.length - 1]);
        }
      });
  }, []);

  if (!incident) {
    return (
      <SidebarLayout>
        <p>No incidents available.</p>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <h1 className="text-3xl font-bold mb-6">🧠 AI Decision Reasoning</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <div>
          <h2 className="font-semibold text-lg">Medical Agent</h2>
          <ul className="list-disc ml-6 text-gray-700">
            {incident.explanation?.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-lg">Routing Agent</h2>
          <p className="text-gray-700">
            {incident.justification}
          </p>
        </div>
      </div>
    </SidebarLayout>
  );
}
