export const API_BASE = "http://127.0.0.1:8000";

export async function getPatient(id) {
  const res = await fetch(`${API_BASE}/patients/${id}`);
  return res.json();
}

export async function getIncidents() {
  const res = await fetch(`${API_BASE}/incidents`);
  return res.json();
}
