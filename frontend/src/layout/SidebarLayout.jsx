// src/layout/SidebarLayout.jsx
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  Map,
  AlertTriangle,
  UserPlus,
} from "lucide-react";

export default function SidebarLayout({ children }) {
  const location = useLocation();
  const path = location.pathname;

  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, to: "/" },
    { name: "Vitals", icon: <Activity size={18} />, to: "/vitals" },
    { name: "Routing", icon: <Map size={18} />, to: "/routing" },
    { name: "Emergency", icon: <AlertTriangle size={18} />, to: "/emergency" },
    { name: "Register", icon: <UserPlus size={18} />, to: "/register" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-xl border-r flex flex-col">
        <div className="px-6 py-6 border-b">
          <h1 className="text-2xl font-bold text-blue-700">
            HealthCompanion
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menu.map((item) => {
            const active = path === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition
                ${
                  active
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-10">{children}</div>
    </div>
  );
}
