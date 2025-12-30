import { useEffect, useState } from "react";
import axios from "axios";

export default function Reasoning() {
  const [incident, setIncident] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/incidents")
      .then(res => setIncident(res.data.at(-1)));
  }, []);

  if (!incident) return <p>No incidents available.</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">🧠 AI Decision Reasoning</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <ul className="list-disc ml-6">
          {incident.explanation?.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
