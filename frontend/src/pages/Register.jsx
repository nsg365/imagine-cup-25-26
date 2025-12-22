// src/pages/Register.jsx
import { useState, useEffect } from "react";
import { registerPatient } from "../api/backend";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    patient_id: "",
    name: "",
    age: "",
    emergency_contacts: "",
    location_lat: "",
    location_lon: "",
  });

  const [locStatus, setLocStatus] = useState("Detecting location...");

  // -----------------------------
  // AUTO-DETECT LOCATION HERE
  // -----------------------------
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocStatus("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          location_lat: pos.coords.latitude,
          location_lon: pos.coords.longitude,
        }));
        setLocStatus("Location detected ✔");
      },
      (err) => {
        console.error(err);
        setLocStatus("Unable to fetch location. Please allow permission.");
      }
    );
  }, []);

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      age: Number(form.age),
      emergency_contacts: form.emergency_contacts
        .split(",")
        .map((x) => x.trim()),
    };

    try {
      await registerPatient(payload);
      alert("Patient registered successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert("Registration failed.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white shadow-md rounded-xl p-6"
      >
        <h1 className="text-2xl font-bold mb-4">Register New Patient</h1>

        {/* Patient ID */}
        <label className="block mb-2 font-semibold">Patient ID</label>
        <input
          type="text"
          value={form.patient_id}
          onChange={(e) =>
            setForm({ ...form, patient_id: e.target.value })
          }
          className="w-full p-2 border rounded mb-4"
          required
        />

        {/* Name */}
        <label className="block mb-2 font-semibold">Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="w-full p-2 border rounded mb-4"
          required
        />

        {/* Age */}
        <label className="block mb-2 font-semibold">Age</label>
        <input
          type="number"
          value={form.age}
          onChange={(e) =>
            setForm({ ...form, age: e.target.value })
          }
          className="w-full p-2 border rounded mb-4"
          required
        />

        {/* Contacts */}
        <label className="block mb-2 font-semibold">
          Emergency Contacts (comma separated)
        </label>
        <input
          type="text"
          value={form.emergency_contacts}
          onChange={(e) =>
            setForm({ ...form, emergency_contacts: e.target.value })
          }
          className="w-full p-2 border rounded mb-4"
          required
        />

        {/* Auto Location Display */}
        <p className="text-sm text-blue-600 mb-2">{locStatus}</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Latitude</label>
            <input
              type="text"
              value={form.location_lat}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Longitude</label>
            <input
              type="text"
              value={form.location_lon}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold"
        >
          Register Patient
        </button>
      </form>
    </div>
  );
}
