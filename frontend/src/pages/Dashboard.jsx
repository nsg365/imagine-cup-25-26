// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { getPatient, getIncidents } from "../api/backend";

import VitalsCard from "../components/VitalsCard";
import ContactsList from "../components/ContactsList";
import EmergencyAlert from "../components/EmergencyAlert";
import HospitalRouteCard from "../components/HospitalRouteCard";

export default function Dashboard() {
  const patientId = "Nihar";

  const [patient, setPatient] = useState(null);
  const [latestIncident, setLatestIncident] = useState(null);
  const [hospital, setHospital] = useState(null);

  useEffect(() => {
    getPatient(patientId).then(setPatient);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getIncidents().then((data) => {
        const critical = data.filter(
          (i) => i.status === "EMERGENCY" || i.status === "SUSPECTED"
        );

        const incident = critical[0] || null;
        setLatestIncident(incident);

        if (
          incident &&
          incident.route_info &&
          incident.chosen_hospital_name &&
          incident.eta_minutes !== undefined
        ) {
          setHospital({
            hospital_name: incident.chosen_hospital_name,
            lat: incident.route_info.lat,
            lon: incident.route_info.lon,
            eta_minutes: incident.eta_minutes,
          });
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Welcome, <span className="text-blue-600">{patient?.name || "..."}</span>
      </h1>

      {/* Vitals + Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VitalsCard vitals={patient?.latest_vitals} />
        <ContactsList contacts={patient?.emergency_contacts || []} />
      </div>

      {/* Hospital Route */}
      {hospital && patient && (
        <HospitalRouteCard
          hospital={hospital}
          patientLat={patient.location_lat}
          patientLon={patient.location_lon}
        />
      )}

      {/* Emergency Alert */}
      <EmergencyAlert incident={latestIncident} />
    </div>
  );
}
