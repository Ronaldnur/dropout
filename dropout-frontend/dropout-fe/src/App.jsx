import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Predicts from "./pages/Predicts";
import Chatbot from "./pages/Chatbot";
import PredictionDetail from "./pages/PredictionDetail";

export default function App() {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto bg-white px-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/predicts" element={<Predicts />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/prediction/:nim" element={<PredictionDetail />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
