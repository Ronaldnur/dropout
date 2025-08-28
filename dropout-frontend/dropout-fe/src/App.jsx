import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Predicts from "./pages/Predicts";

export default function App() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto bg-gray-50 px-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/predicts" element={<Predicts />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
