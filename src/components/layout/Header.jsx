import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/": "Dashboard",
  "/query-editor": "SQL Query Editor",
  "/saved-queries": "Saved Queries",
  "/query-history": "Query History",
  "/alerts": "Alerts",
};

const Header = ({ sidebarCollapsed }) => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "DataVault";

  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const notifications = 3;

  return (
    <header
      className={`fixed top-0 right-0 h-16 z-30 flex items-center justify-between px-6 border-b transition-all duration-300 ${sidebarCollapsed ? "left-[72px]" : "left-[260px]"
        }`}
      style={{
        background: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: "rgba(71, 85, 105, 0.3)",
      }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-6">

        {/* Page title */}
        <h1 className="text-xl font-semibold text-slate-100 tracking-tight">
          {title}
        </h1>

        {/* Optional breadcrumb */}
        <span className="hidden lg:block text-xs text-slate-500">
          Data Warehouse / {title}
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">

        {/* Search */}
        <div className="relative hidden md:block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tables, queries..."
            className="w-64 pl-9 pr-4 py-2 rounded-lg text-sm bg-surface-700/50 border border-surface-500/30 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all duration-200"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors duration-200">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>

          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-semibold">
              {notifications}
            </span>
          )}
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="flex items-center gap-3 p-1 rounded-lg hover:bg-white/5 transition"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
              A
            </div>
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-3 w-44 rounded-lg border border-slate-700 bg-slate-900 shadow-xl overflow-hidden">

              <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
                Profile
              </button>

              <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
                Settings
              </button>

              <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800">
                Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;