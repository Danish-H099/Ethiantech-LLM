import { Link, useNavigate } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  ChevronDown,
  LogOut,
  User,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";
import { clearMockAuth } from "src/utils/authMock";

export default function TutorNavbar({ sidebarOpen, setSidebarOpen, hamburgerRef }) {
  const navigate = useNavigate();

  function handleLogout() {
    clearMockAuth();
    navigate("/", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 flex h-[74px] items-center justify-between border-b border-gray-300 bg-white px-4 sm:px-6">
      <Link to="/" className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-dark text-white shadow-sm">
          <span className="text-sm-fluid font-bold">ET</span>
        </div>
        <span className="font-outfit text-body-lg font-bold text-ink sm:text-heading">
          EthianTech
        </span>
        <span className="rounded bg-accent-tutor px-2 py-0.5 text-sm-fluid font-bold uppercase text-white">
          Tutor
        </span>
      </Link>

      <div className="flex items-center gap-3">
        {/* Profile dropdown — desktop only; on mobile the profile actions
            live inside the sidebar drawer. */}
        <div className="hidden lg:block">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                aria-label="Open profile menu"
                className="flex select-none items-center gap-2 rounded transition hover:bg-gray-50 focus-visible:outline-none"
              >
                <span className="hidden text-sm-fluid text-ink-muted sm:inline">
                  Hi! <span className="font-medium text-ink">Richard</span>
                </span>
                <div className="relative flex h-[45px] w-[45px] items-center justify-center overflow-hidden rounded-full bg-brand/10 shadow-avatar">
                  <GraduationCap size={20} className="text-brand" />
                </div>
                <ChevronDown size={16} className="text-ink-muted" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className="z-50 w-[194px] rounded border border-gray-200 bg-surface-soft shadow-dropdown"
              >
                <DropdownMenu.Item asChild className="outline-none">
                  <button
                    className="flex w-full items-center gap-3 px-5 py-3 text-sm-fluid text-gray-800 transition data-[highlighted]:bg-gray-100 hover:bg-gray-100"
                  >
                    <User size={16} />
                    My Profile
                  </button>
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="border-t border-gray-200" />

                <DropdownMenu.Item
                  onSelect={handleLogout}
                  className="flex items-center gap-3 px-5 py-3 text-sm-fluid text-gray-800 outline-none transition data-[highlighted]:bg-gray-100 hover:bg-gray-100"
                >
                  <LogOut size={16} />
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        {/* Mobile hamburger — rightmost on small screens */}
        <button
          ref={hamburgerRef}
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={sidebarOpen}
          className="rounded p-1 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
