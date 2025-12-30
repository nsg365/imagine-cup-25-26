// src/pages/Register.jsx
import { useState, useEffect } from "react";
import { registerPatient } from "../api/backend";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    emergency_contacts: "",
    location_lat: "",
    location_lon: "",
    password: "",
    confirm_password: "",
  });

  const [locStatus, setLocStatus] = useState("Detecting location...");
  const [error, setError] = useState("");

  // -----------------------------
  // AUTO-DETECT LOCATION
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
      () => {
        setLocStatus("Unable to fetch location.");
      }
    );
  }, []);

  // -----------------------------
  // SUBMIT
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    const payload = {
      name: form.name,
      age: Number(form.age),
      emergency_contacts: form.emergency_contacts
        .split(",")
        .map((x) => x.trim()),
      location_lat: form.location_lat,
      location_lon: form.location_lon,
      password: form.password,
    };

    try {
      const data = await registerPatient(payload);
      localStorage.setItem("patient_id", data.patient_id);
      alert(`Registered successfully. Your ID: ${data.patient_id}`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white shadow-md rounded-xl p-6"
      >
        <h1 className="text-2xl font-bold mb-4">Register New Patient</h1>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <label className="block mb-2 font-semibold">Name</label>
        <input
          type="text"
          required
          className="w-full p-2 border rounded mb-4"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label className="block mb-2 font-semibold">Age</label>
        <input
          type="number"
          required
          className="w-full p-2 border rounded mb-4"
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />

        <label className="block mb-2 font-semibold">
          Emergency Contacts (comma separated)
        </label>
        <input
          type="text"
          required
          className="w-full p-2 border rounded mb-4"
          onChange={(e) =>
            setForm({ ...form, emergency_contacts: e.target.value })
          }
        />

        {/* PASSWORDS */}
        <label className="block mb-2 font-semibold">Password</label>
        <input
          type="password"
          required
          className="w-full p-2 border rounded mb-4"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <label className="block mb-2 font-semibold">Confirm Password</label>
        <input
          type="password"
          required
          className="w-full p-2 border rounded mb-4"
          onChange={(e) =>
            setForm({ ...form, confirm_password: e.target.value })
          }
        />

        <p className="text-sm text-blue-600 mb-2">{locStatus}</p>

        <div className="grid grid-cols-2 gap-4">
          <input
            readOnly
            value={form.location_lat}
            className="p-2 border rounded bg-gray-100"
          />
          <input
            readOnly
            value={form.location_lon}
            className="p-2 border rounded bg-gray-100"
          />
        </div>

        <button className="w-full mt-6 bg-blue-600 text-white p-3 rounded-lg">
          Register Patient
        </button>

        {/* LOGIN NAVIGATION */}
        <p className="text-center mt-4 text-sm text-gray-600">
          Already registered?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
}
