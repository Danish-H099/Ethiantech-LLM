import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, User, Menu, X, BookOpen } from "lucide-react";

export default function StudentNavbar({ sidebarOpen, setSidebarOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-[74px] items-center justify-between border-b border-gray-300 bg-white px-4 sm:px-6">
      <button
        className="rounded p-1 text-gray-700 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="hidden lg:block" />

      <div className="relative flex items-center gap-3" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2"
        >
          <span className="hidden text-md text-ink-muted sm:inline">
            Hi! <span className="font-medium text-ink">Student</span>
          </span>
          <div className="relative flex h-[45px] w-[45px] items-center justify-center overflow-hidden rounded-full bg-brand/10 shadow-[0_4px_4px_rgba(0,0,0,0.05)]">
            <BookOpen size={20} className="text-brand" />
          </div>
          <ChevronDown size={16} className="text-ink-muted" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-[194px] rounded border border-gray-200 bg-surface-soft shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
            <button
              onClick={() => setDropdownOpen(false)}
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-md text-gray-800 transition hover:bg-gray-100"
            >
              <User size={16} />
              My Profile
            </button>
            <div className="border-t border-gray-200" />
            <button
              onClick={() => setDropdownOpen(false)}
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-md text-gray-800 transition hover:bg-gray-100"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
