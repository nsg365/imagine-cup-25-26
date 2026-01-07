// src/pages/Routing.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import HospitalRouteCard from "../components/HospitalRouteCard";

export default function Routing() {
  const [incident, setIncident] = useState(null);
  const [patient, setPatient] = useState(null);

  const PATIENT_ID = "p1"; // replace later with logged-in patient

  // Fetch patient (for location)
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/patients/${PATIENT_ID}`)
      .then((res) => setPatient(res.data))
      .catch(() => {});
  }, []);

  // Fetch latest incident
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/incidents")
      .then((res) => {
        if (res.data.length > 0) {
          setIncident(res.data[res.data.length - 1]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">
        Hospital Routing
      </h1>

      {!incident || !incident.chosen_hospital_name ? (
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-slate-600">
            No routing decision yet.
          </p>
          <p className="text-slate-500 mt-2">
            Routing appears automatically during emergencies.
          </p>
        </div>
      ) : (
        <HospitalRouteCard
          hospital={{
            hospital_name: incident.chosen_hospital_name,
            eta_minutes: incident.eta_minutes,
            lat: incident.route_info?.lat,
            lon: incident.route_info?.lon,
          }}
          patientLat={patient?.location_lat}
          patientLon={patient?.location_lon}
        />
      )}
    </div>
  );
}

