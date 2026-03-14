import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const pageTitles = {
    '/': 'Dashboard',
    '/query-editor': 'SQL Query Editor',
    '/saved-queries': 'Saved Queries',
    '/query-history': 'Query History',
    '/alerts': 'Alerts',
  };

  const title = pageTitles[location.pathname] || 'FluxGrid';

  return (
    <nav
      className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center justify-between px-5 glass-nav transition-all duration-300"
    >
      {/* Left: Logo + Brand */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0 shadow-glow-plum group-hover:shadow-glow-lg transition-all duration-300 group-hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse-slow">
              <path d="M12 3L2 12h3v8h14v-8h3L12 3z" />
            </svg>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-brand-600 to-rose-500 bg-clip-text text-transparent tracking-tighter uppercase">
            FluxGrid
          </span>
        </Link>

        {/* Breadcrumb / Page indicator */}
        <div className="hidden sm:flex items-center gap-2 ml-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-sm font-semibold text-brand-600/70">{title}</span>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center">
        <div className="relative group/search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-brand-500 transition-colors"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search queries, tables..."
            className="w-72 pl-9 pr-4 py-1.5 rounded-xl text-sm bg-surface-200/50 border border-surface-300 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-400/50 focus:ring-4 focus:ring-brand-500/5 focus:w-80 transition-all duration-300"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-white border border-surface-300 shadow-sm">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button className="relative p-2 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-all duration-200 group" title="Notifications">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-white bg-rose-500" />
        </button>

        {/* Settings */}
        <button className="p-2 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-all duration-200 group" title="Settings">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-45 transition-transform">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-surface-300 mx-1" />

        {/* User */}
        <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-brand-50 transition-all duration-200">
          <div className="w-7.5 h-7.5 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
            AD
          </div>
          <div className="flex flex-col items-start leading-none hidden lg:flex">
            <span className="text-xs font-bold text-slate-700">Admin</span>
            <span className="text-[9px] text-slate-400 mt-0.5">Primary Workspace</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-400 hidden lg:block">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
