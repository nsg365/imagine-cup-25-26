export default function Routing() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Hospital Routing</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-slate-700">
          This page visualizes AI-selected hospitals and routing decisions.
        </p>

        <p className="text-slate-500 mt-2">
          Routing is triggered automatically during emergencies.
        </p>
      </div>
    </div>
  );
}
