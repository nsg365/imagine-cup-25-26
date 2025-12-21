export default function VitalsCard({ vitals }) {
  if (!vitals) return null;

  return (
    <div className="bg-white shadow rounded-lg p-4 border">
      <h2 className="text-lg font-semibold mb-2">Vitals</h2>

      <div className="space-y-1 text-gray-700">
        <p><strong>Heart Rate:</strong> {vitals.heart_rate} bpm</p>
        <p><strong>SpO₂:</strong> {vitals.spo2}%</p>
        <p><strong>Blood Pressure:</strong> 
          {vitals.systolic_bp}/{vitals.diastolic_bp}
        </p>
        <p><strong>Motion Flag:</strong> {vitals.motion_flag ? "Yes" : "No"}</p>
        <p><strong>Fall Detected:</strong> {vitals.fall_flag ? "Yes" : "No"}</p>
      </div>
    </div>
  );
}
