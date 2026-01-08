import { Activity, HeartPulse, Droplets, AlertTriangle } from "lucide-react";

export default function VitalsCard({ vitals }) {
  if (!vitals) {
    return (
      <div className="bg-white p-6 rounded-xl shadow border text-slate-500">
        No vitals data available yet.
      </div>
    );
  }

  const {
    heart_rate,
    spo2,
    systolic_bp,
    diastolic_bp,
    motion_flag,
    fall_flag,
    timestamp,
  } = vitals;

  return (
    <div className="bg-white p-6 rounded-xl shadow border space-y-4">

      {/* HEADER */}
      <div className="flex items-center gap-2 text-xl font-semibold text-slate-800">
        <Activity className="text-blue-600" />
        Latest Vitals
      </div>

      {/* VITAL GRID */}
      <div className="grid grid-cols-2 gap-4 text-slate-700">

        <div className="flex items-center gap-2">
          <HeartPulse className="text-red-600" />
          <span>
            Heart Rate:{" "}
            <strong>{heart_rate ?? "--"} bpm</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Droplets className="text-blue-600" />
          <span>
            SpO₂:{" "}
            <strong>{spo2 ?? "--"}%</strong>
          </span>
        </div>

        <div>
          Blood Pressure:{" "}
          <strong>
            {systolic_bp && diastolic_bp
              ? `${systolic_bp}/${diastolic_bp} mmHg`
              : "--"}
          </strong>
        </div>

        <div>
          Time:{" "}
          <strong>
            {timestamp
              ? new Date(timestamp).toLocaleTimeString()
              : "--"}
          </strong>
        </div>
      </div>

      {/* ALERT FLAGS */}
      {(motion_flag || fall_flag) && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 flex items-center gap-2">
          <AlertTriangle />
          {fall_flag && "Fall detected. "}
          {motion_flag && "Abnormal motion detected."}
        </div>
      )}
    </div>
  );
}


