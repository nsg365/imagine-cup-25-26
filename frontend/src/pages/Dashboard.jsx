// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SidebarLayout from "../layout/SidebarLayout";

import { getPatient, getIncidents } from "../api/backend";

import VitalsCard from "../components/VitalsCard";
import ContactsList from "../components/ContactsList";
import EmergencyAlert from "../components/EmergencyAlert";
import HospitalRouteCard from "../components/HospitalRouteCard";

const API_BASE = "http://127.0.0.1:8000";

export default function Dashboard() {
  const patientId = localStorage.getItem("patient_id");
  const location = useLocation();

  const [patient, setPatient] = useState(null);
  const [latestVitals, setLatestVitals] = useState(null);
  const [latestIncident, setLatestIncident] = useState(null);
  const [hospital, setHospital] = useState(null);

  const isDashboardHome = location.pathname === "/dashboard";

  // ===============================
  // Load patient profile
  // ===============================
  useEffect(() => {
    if (!patientId) return;
    getPatient(patientId).then(setPatient);
  }, [patientId]);

  // ===============================
  // Poll vitals + incidents
  // ===============================
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!patientId) return;

      // 🔹 Fetch latest vitals (EXISTING backend endpoint)
      try {
        const vitalsRes = await fetch(`${API_BASE}/vitals/${patientId}`);
        const vitals = vitalsRes.ok ? await vitalsRes.json() : null;
        setLatestVitals(vitals);
      } catch {
        setLatestVitals(null);
      }

      // 🔹 Fetch incidents
      const data = await getIncidents();
      const critical = data.filter(
        (i) => i.status === "EMERGENCY" || i.status === "SUSPECTED"
      );

      const incident = critical[0] || null;
      setLatestIncident(incident);

      if (incident?.chosen_hospital_name) {
        setHospital({
          hospital_name: incident.chosen_hospital_name,
          lat: incident.route_info?.lat ?? null,
          lon: incident.route_info?.lon ?? null,
          eta_minutes: incident.eta_minutes ?? null,
          phone: incident.route_info?.phone ?? null,
          address: incident.route_info?.address ?? null,
          rating: incident.route_info?.rating ?? null,
          reviews: incident.route_info?.reviews ?? null,
        });
      } else if (!incident) {
        setHospital(null);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [patientId]);

  return (
    <SidebarLayout>
      {/* ================= DASHBOARD OVERVIEW ================= */}
      {isDashboardHome && (
        <>
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            Welcome,{" "}
            <span className="text-blue-600">{patient?.name || "..."}</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ✅ FIXED: vitals now come from /vitals/{patient_id} */}
            <VitalsCard vitals={latestVitals} />

            <ContactsList contacts={patient?.emergency_contacts || []} />
          </div>

          <div className="mt-8">
            {hospital && patient ? (
              <HospitalRouteCard
                hospital={hospital}
                patientLat={patient.location_lat}
                patientLon={patient.location_lon}
              />
            ) : (
              <p className="text-gray-500 italic">
                No hospital route available…
              </p>
            )}
          </div>
        </>
      )}

      {/* 🚨 EMERGENCY ALERT — ALWAYS VISIBLE */}
      <div className="mt-8">
        <EmergencyAlert incident={latestIncident} />
      </div>

      <Outlet />
    </SidebarLayout>
  );
}
