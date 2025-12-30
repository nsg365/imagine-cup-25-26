import VitalsCard from "../components/VitalsCard";

export default function Vitals() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Vitals Monitoring</h1>

      <VitalsCard vitals={null} />

      <p className="text-slate-500">
        Live vitals will appear here when data is received from the device.
      </p>
    </div>
  );
}
