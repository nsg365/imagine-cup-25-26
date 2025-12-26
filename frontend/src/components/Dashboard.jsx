import { useEffect, useState } from "react";
import axios from "axios";
import SidebarLayout from "../layout/SidebarLayout";

import ContactsList from "../components/ContactsList";
import VitalsCard from "../components/VitalsCard";
import EmergencyAlert from "../components/EmergencyAlert";
import HospitalRouteCard from "../components/HospitalRouteCard";

export default function Dashboard() {
  const patientId = "p1"; // MUST match backend

  const [patient, setPatient] = useState(null);
  const [incident, setIncident] = useState(null);

  // Fetch patient
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/patients/${patientId}`)
      .then(res => setPatient(res.data))
      .catch(() => setPatient(null));
  }, []);

  // Poll incidents
  useEffect(() => {
    const poller = setInterval(() => {
      axios.get("http://127.0.0.1:8000/incidents").then(res => {
        if (res.data.length > 0) {
          setIncident(res.data[res.data.length - 1]);
        }
      });
    }, 3000);

    return () => clearInterval(poller);
  }, []);

  if (!patient) {
    return (
      <SidebarLayout>
        <div className="text-center text-slate-500 text-xl mt-20">
          No patient registered yet.
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="card">
          <h1 className="text-3xl font-bold text-blue-700">
            Welcome, {patient.name}
          </h1>
          <p className="text-slate-500 mt-1">
            Real-time AI health monitoring dashboard
          </p>
        </div>

        {/* VITALS */}
        <VitalsCard vitals={incident?.vitals_snapshot} />

        {/* EMERGENCY ALERT */}
        <EmergencyAlert incident={incident} />

        {/* CONTACTS */}
        <ContactsList contacts={patient.emergency_contacts} />

        {/* HOSPITAL ROUTING */}
        {incident?.route_info && (
          <HospitalRouteCard
            hospital={{
              name: incident.chosen_hospital_name,
              eta: incident.eta_minutes,
              lat: incident.route_info.lat,
              lon: incident.route_info.lon,
            }}
            patientLat={patient.location_lat}
            patientLon={patient.location_lon}
          />
        )}
      </div>
    </SidebarLayout>
  );
}



