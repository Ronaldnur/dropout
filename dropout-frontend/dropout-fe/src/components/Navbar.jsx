export default function Navbar() {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      {/* Left Section */}
      <h2 className="text-xl font-bold text-indigo-600">Admin Panel</h2>

      {/* Middle Nav */}
      <nav className="flex items-center gap-6 text-gray-700 font-medium">
        <a href="#" className="hover:text-indigo-600">Dashboard</a>
      </nav>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
          U
        </div>
        <span className="hidden md:block text-gray-700">Hello, User 👋</span>
      </div>
    </header>
  );
}
