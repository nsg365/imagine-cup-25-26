export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-10 text-center">

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4">
          AI Emergency Monitoring System
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 text-lg mb-8">
          Real-time vitals analysis · Intelligent hospital routing · Automated SOS alerts
        </p>

        {/* Status Card */}
        <div className="bg-slate-50 rounded-xl p-6 mb-8">
          <p className="text-xl font-semibold text-green-600 mb-2">
            ✅ System Online
          </p>
          <p className="text-slate-500">
            Backend connected · Agents active · Notifications enabled
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
            Register Patient
          </button>

          <button className="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition">
            🚨 Send SOS
          </button>
        </div>

        {/* Footer */}
        <p className="mt-10 text-sm text-slate-400">
          Built for intelligent emergency response using multi-agent AI
        </p>
      </div>
    </div>
  );
}

