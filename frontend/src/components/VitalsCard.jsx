// src/components/VitalsCard.jsx
import { Activity, HeartPulse, Thermometer, Droplet } from "lucide-react";

function getColor(type, value) {
  if (value == null) return "text-slate-500";

  switch (type) {
    case "hr":
      return value < 50 || value > 120 ? "text-red-600" : "text-green-600";
    case "spo2":
      return value < 92 ? "text-red-600" : "text-green-600";
    case "temp":
      return value < 36 || value > 38 ? "text-red-600" : "text-green-600";
    default:
      return "text-slate-700";
  }
}

export default function VitalsCard({ vitals }) {
  if (!vitals) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Activity className="text-green-600" size={22} />
          Vitals
        </h2>
        <p className="text-slate-500 mt-4">No vitals available</p>
      </div>
    );
  }

  const {
    heart_rate,
    spo2,
    temperature,
    systolic_bp,
    diastolic_bp,
  } = vitals;

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Activity className="text-green-600" size={22} />
        Vitals
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Heart Rate */}
        <div>
          <div className="flex items-center gap-2 text-slate-600">
            <HeartPulse size={18} />
            Heart Rate
          </div>
          <div className={`text-2xl font-bold ${getColor("hr", heart_rate)}`}>
            {heart_rate ?? "--"} bpm
          </div>
        </div>

        {/* SpO2 */}
        <div>
          <div className="flex items-center gap-2 text-slate-600">
            <Droplet size={18} />
            SpO₂
          </div>
          <div className={`text-2xl font-bold ${getColor("spo2", spo2)}`}>
            {spo2 ?? "--"}%
          </div>
        </div>

        {/* Temperature */}
        <div>
          <div className="flex items-center gap-2 text-slate-600">
            <Thermometer size={18} />
            Temperature
          </div>
          <div className={`text-2xl font-bold ${getColor("temp", temperature)}`}>
            {temperature ?? "--"}°C
          </div>
        </div>

        {/* Blood Pressure */}
        <div>
          <div className="flex items-center gap-2 text-slate-600">
            <Activity size={18} />
            Blood Pressure
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {systolic_bp && diastolic_bp
              ? `${systolic_bp}/${diastolic_bp}`
              : "--/--"} mmHg
          </div>
        </div>
      </div>
    </div>
  );
}

