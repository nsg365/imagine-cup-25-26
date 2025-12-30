import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Vitals from "./pages/Vitals";
import Routing from "./pages/Routing";
import Emergency from "./pages/Emergency";
import IncidentHistory from "./pages/IncidentHistory";
import Reasoning from "./pages/Reasoning";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ DASHBOARD LAYOUT ROUTE */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* 👇 nested routes */}
          <Route path="vitals" element={<Vitals />} />
          <Route path="routing" element={<Routing />} />
          <Route path="emergency" element={<Emergency />} />
          <Route path="incidents" element={<IncidentHistory />} />
          <Route path="reasoning" element={<Reasoning />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
