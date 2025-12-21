import { useEffect, useState } from "react";
import { getPatient, getIncidents } from "../api/backend";

import VitalsCard from "../components/VitalsCard";
import ContactsList from "../components/ContactsList";
import EmergencyAlert from "../components/EmergencyAlert";

export default function Dashboard() {
  const patientId = "Nihar"; // test patient ID
  const [patient, setPatient] = useState(null);
  const [latestIncident, setLatestIncident] = useState(null);

  useEffect(() => {
    getPatient(patientId).then(setPatient);

    const interval = setInterval(() => {
      getIncidents().then((data) => {
        const emergencies = data.filter(
          (i) => i.status === "EMERGENCY" || i.status === "SUSPECTED"
        );
        setLatestIncident(emergencies[0] || null);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {patient?.name || "Loading..."}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VitalsCard vitals={patient?.latest_vitals} />
        <ContactsList contacts={patient?.emergency_contacts || []} />
      </div>

      <EmergencyAlert incident={latestIncident} />
    </div>
  );
}


