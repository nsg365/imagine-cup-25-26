// src/api/backend.js

const API_BASE = "http://127.0.0.1:8000";

// ----------------------
// REGISTER PATIENT
// ----------------------
export async function registerPatient(patientData) {
  try {
    const res = await fetch(`${API_BASE}/patients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientData),
    });

    const data = await res.json();

    if (!res.ok) {
      // Backend-provided error (FastAPI detail)
      throw new Error(data.detail || "Patient registration failed");
    }

    return data;
  } catch (error) {
    console.error("❌ Register Patient Error:", error.message);
    throw error;
  }
}

// ----------------------
// GET PATIENT BY ID
// ----------------------
export async function getPatient(patientId) {
  try {
    const res = await fetch(`${API_BASE}/patients/${patientId}`);

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch patient");
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Get Patient Error:", error.message);
    return null;
  }
}

// ----------------------
// GET INCIDENTS
// ----------------------
export async function getIncidents() {
  try {
    const res = await fetch(`${API_BASE}/incidents`);

    if (!res.ok) {
      throw new Error("Failed to fetch incidents");
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Get Incidents Error:", error.message);
    return [];
  }
}

