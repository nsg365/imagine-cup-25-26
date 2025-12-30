import axios from "axios";

export default function Emergency() {
  async function triggerSOS() {
    try {
      await axios.post("http://127.0.0.1:8000/sos/manual", {
        patient_id: localStorage.getItem("patient_id"),
      });

      alert("🚨 SOS sent successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send SOS");
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">
      <h1 className="text-3xl font-bold text-red-700 mb-4">
        🚨 Manual SOS
      </h1>

      <p className="text-gray-600 mb-6">
        Use this button if the patient feels unwell or needs immediate help.
      </p>

      <button
        onClick={triggerSOS}
        className="w-full py-4 bg-red-600 text-white rounded-xl font-bold text-xl hover:bg-red-700 emergency-pulse"
      >
        SEND SOS ALERT
      </button>
    </div>
  );
}
