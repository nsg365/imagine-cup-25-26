// src/pages/Vitals.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import VitalsCard from "../components/VitalsCard";

export default function Vitals() {
  const patientId = localStorage.getItem("patient_id");

  const [vitals, setVitals] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;

    const poller = setInterval(() => {
      axios
        .get(`http://127.0.0.1:8000/vitals/${patientId}`)
        .then((res) => {
          setVitals(res.data);
          setLoading(false);
        })
        .catch(() => {});
    }, 2000);

    return () => clearInterval(poller);
  }, [patientId]);

  // 🔴 THIS WAS MISSING
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">
        Vitals Monitoring
      </h1>

      {!patientId && (
        <p className="text-red-600">
          No patient registered. Please register first.
        </p>
      )}

      {loading && patientId && (
        <p className="text-slate-500">Waiting for vitals…</p>
      )}

      {!loading && vitals && (
        <VitalsCard vitals={vitals} />
      )}

      {!loading && !vitals && patientId && (
        <p className="text-slate-500">
          No vitals received yet from the device.
        </p>
      )}
    </div>
  );
}
