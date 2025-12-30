// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SidebarLayout from "../layout/SidebarLayout";

import { getPatient, getIncidents } from "../api/backend";

import VitalsCard from "../components/VitalsCard";
import ContactsList from "../components/ContactsList";
import EmergencyAlert from "../components/EmergencyAlert";
import HospitalRouteCard from "../components/HospitalRouteCard";

export default function Dashboard() {
  const patientId = localStorage.getItem("patient_id");
  const location = useLocation();

  const [patient, setPatient] = useState(null);
  const [latestIncident, setLatestIncident] = useState(null);
  const [hospital, setHospital] = useState(null);

  const isDashboardHome = location.pathname === "/dashboard";

  // Load patient profile
  useEffect(() => {
    if (!patientId) return;
    getPatient(patientId).then(setPatient);
  }, [patientId]);

  // Poll incidents every 2 sec
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
            phone: incident.route_info.phone || null,
          });
        } else {
          setHospital(null);
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SidebarLayout>
      {/* ===== DASHBOARD OVERVIEW (ONLY /dashboard) ===== */}
      {isDashboardHome && (
        <>
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            Welcome,{" "}
            <span className="text-blue-600">{patient?.name || "..."}</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VitalsCard vitals={patient?.latest_vitals} />
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

      {/* ===== CHILD ROUTES ===== */}
      <Outlet />
    </SidebarLayout>
  );
}
