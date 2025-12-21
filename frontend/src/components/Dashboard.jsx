import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const patientId = "Nihar";   // your real patient ID

  const [patient, setPatient] = useState(null);
  const [incident, setIncident] = useState(null);

  // Fetch patient profile
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/patients/${patientId}`)
      .then(res => setPatient(res.data))
      .catch(err => {
        console.log("Patient not found:", err);
      });
  }, []);

  // Poll for incidents every 2 seconds
  useEffect(() => {
    const poller = setInterval(() => {
      axios
        .get("http://127.0.0.1:8000/incidents")
        .then(res => {
          if (res.data.length > 0) {
            setIncident(res.data[res.data.length - 1]); // latest
          }
        })
        .catch(() => {});
    }, 2000);

    return () => clearInterval(poller);
  }, []);

  if (!patient) {
    return (
      <div className="text-center text-gray-600 text-xl mt-20">
        No patient registered yet. Add one through the backend.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">

      {/* HEADER */}
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        Welcome, {patient.name}
      </h1>

      {/* EMERGENCY CONTACTS */}
      <div className="border p-4 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-2">Emergency Contacts</h2>

        {patient.emergency_contacts.length > 0 ? (
          <ul className="list-disc ml-6">
            {patient.emergency_contacts.map((c, idx) => (
              <li key={idx}>{c}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No emergency contacts found.</p>
        )}
      </div>

      {/* INCIDENT SECTION */}
      {incident ? (
        <div className="bg-red-100 border-l-4 border-red-600 p-4 rounded-lg">
          <h2 className="text-2xl font-bold text-red-700 flex items-center gap-2">
            🚨 EMERGENCY DETECTED
          </h2>

          <p className="mt-2">
            <strong>Pattern:</strong> {incident.detected_pattern}
          </p>
          <p>
            <strong>Triage Level:</strong> {incident.triage_level}
          </p>

          <div className="mt-4 space-y-2">
            <a
              href="tel:108"
              className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Call General Ambulance (108)
            </a>

            <br />

            <a
              href="tel:102"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Call Nearest Hospital Ambulance
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded">
          <h3 className="text-lg font-semibold text-green-700">
            ✔ Vitals Stable
          </h3>
          <p>No emergencies detected.</p>
        </div>
      )}
    </div>
  );
}

