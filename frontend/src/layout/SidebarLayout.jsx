// src/layout/SidebarLayout.jsx
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  Map,
  AlertTriangle,
  UserPlus,
  History,
  Brain,
} from "lucide-react";

export default function SidebarLayout({ children }) {
  const { pathname } = useLocation();

  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, to: "/dashboard" },
    { name: "Vitals", icon: <Activity size={18} />, to: "/dashboard/vitals" },
    { name: "Routing", icon: <Map size={18} />, to: "/dashboard/routing" },
    { name: "Emergency SOS", icon: <AlertTriangle size={18} />, to: "/dashboard/emergency" },
    { name: "Incident History", icon: <History size={18} />, to: "/dashboard/incidents" },
    { name: "AI Reasoning", icon: <Brain size={18} />, to: "/dashboard/reasoning" },
    { name: "Register", icon: <UserPlus size={18} />, to: "/register" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="w-64 bg-white border-r shadow-lg">
        <div className="p-6 text-2xl font-bold text-blue-700">
          HealthCompanion
        </div>

        <nav className="p-4 space-y-2">
          {menu.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition
                ${pathname === item.to
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-200"}`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex-1 p-10 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
