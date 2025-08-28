import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Activity } from "lucide-react";

export default function Sidebar() {
  const { pathname } = useLocation();

  const menu = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Predicts", path: "/predicts", icon: <Activity size={18} /> },
  ];

  return (
    <aside className="w-64 bg-white shadow-md h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-indigo-600">
          Dropout <span className="text-gray-800">System</span>
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
              pathname === item.path
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t text-sm text-gray-500">
        © 2025 DropoutSys
      </div>
    </aside>
  );
}
