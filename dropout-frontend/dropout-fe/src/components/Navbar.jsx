export default function Navbar() {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      {/* Left Section */}
      <h2 className="text-xl font-bold text-[#0046FF]">Admin Panel</h2>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#0046FF] flex items-center justify-center text-white font-bold">
          U
        </div>
      </div>
    </header>
  );
}
