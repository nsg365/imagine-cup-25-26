import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Vitals from "./pages/Vitals";
import Routing from "./pages/Routing";
import Emergency from "./pages/Emergency";
import IncidentHistory from "./pages/IncidentHistory";
import Reasoning from "./pages/Reasoning";

import "./index.css";

// ✅ ADD THIS LINE
import "leaflet/dist/leaflet.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vitals" element={<Vitals />} />
        <Route path="/routing" element={<Routing />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/history" element={<IncidentHistory />} />
        <Route path="/reasoning" element={<Reasoning />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
