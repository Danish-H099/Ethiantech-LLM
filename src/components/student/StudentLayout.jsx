import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  StickyNote,
  Heart,
  BarChart3,
} from "lucide-react";
import StudentNavbar from "./StudentNavbar";
import Footer from "../Footer";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
  { label: "My Courses", icon: BookOpen, path: "/student/my-courses" },
  { label: "Notes", icon: StickyNote, path: "/student/notes" },
  { label: "Wishlist", icon: Heart, path: "/student/wishlist" },
  { label: "Performance", icon: BarChart3, path: "/student/performance" },
];

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-surface font-outfit">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[251px] flex-col border-r border-gray-300 bg-white transition-transform duration-200 lg:static lg:h-full lg:overflow-y-auto lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center gap-3 px-6 py-5">
            <span className="text-2xl font-semibold text-ink">
              EthianTech
            </span>
            <span className="rounded bg-brand px-2 py-0.5 text-11 font-bold uppercase text-white">
              Student
            </span>
          </div>

          <nav className="mt-2 flex flex-col gap-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded px-3 py-2.5 text-base transition-colors ${
                      isActive
                        ? "border-l-[3px] border-brand bg-tint-pink pl-[9px] font-medium text-brand"
                        : "border-l-[3px] border-transparent text-ink hover:bg-gray-50"
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <div className="flex flex-1 flex-col">
          <StudentNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main className="flex-1 overflow-auto bg-surface p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
