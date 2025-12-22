// src/api/backend.js

const API_BASE = "http://127.0.0.1:8000";

// ----------------------
//  REGISTER PATIENT
// ----------------------
export async function registerPatient(patientData) {
  const res = await fetch(`${API_BASE}/patients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patientData),
  });

  if (!res.ok) {
    throw new Error("Failed to register patient");
  }

  return res.json();
}

// ----------------------
//  GET PATIENT BY ID
// ----------------------
export async function getPatient(patientId) {
  const res = await fetch(`${API_BASE}/patients/${patientId}`);
  if (!res.ok) return null;
  return res.json();
}

// ----------------------
//  GET VITALS + INCIDENTS
// ----------------------
export async function getIncidents() {
  const res = await fetch(`${API_BASE}/incidents`);
  if (!res.ok) return [];
  return res.json();
}
