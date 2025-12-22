// src/components/VitalsCard.jsx
import { Activity } from "lucide-react";

export default function VitalsCard({ vitals }) {
  return (
    <div className="bg-white shadow-sm p-6 rounded-xl border">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
        <Activity className="text-green-600" size={22} />
        Vitals
      </h2>

      {!vitals ? (
        <p className="text-gray-500">No vitals available…</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <p>Heart Rate: <span className="font-semibold">{vitals.heart_rate}</span></p>
          <p>SpO₂: <span className="font-semibold">{vitals.spo2}</span></p>
          <p>Temperature: <span className="font-semibold">{vitals.temperature}</span></p>
          <p>BP: <span className="font-semibold">{vitals.bp}</span></p>
        </div>
      )}
    </div>
  );
}
