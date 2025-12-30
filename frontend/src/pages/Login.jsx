import { useState } from "react";
import { loginPatient } from "../api/backend";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    patient_id: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginPatient(form);

      // save login state
      localStorage.setItem("patient_id", data.patient_id);

      navigate("/dashboard");
    } catch (err) {
      alert("Invalid patient ID or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-md rounded-xl p-6"
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>

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

        <label className="block mb-2 font-semibold">Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          className="w-full p-2 border rounded mb-6"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
}
