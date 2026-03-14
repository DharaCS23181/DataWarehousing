import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  {
    label: 'Dashboard',
    path: '/',
    colorClass: 'text-tech-blue/60',
    activeColorClass: 'text-tech-blue',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: 'SQL Editor',
    path: '/query-editor',
    colorClass: 'text-tech-emerald/60',
    activeColorClass: 'text-tech-emerald',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
  },
  {
    label: 'Saved Queries',
    path: '/saved-queries',
    colorClass: 'text-tech-blue/60',
    activeColorClass: 'text-tech-blue',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: 'Query History',
    path: '/query-history',
    colorClass: 'text-tech-amber/60',
    activeColorClass: 'text-tech-amber',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 12" />
      </svg>
    ),
  },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside
      className="h-full flex flex-col absolute top-0 left-0 bg-white border-r border-slate-200 transition-[width] duration-300 ease-in-out z-[100] w-16 hover:w-60 group/sidebar overflow-hidden hover:shadow-2xl shadow-slate-200/50"
    >
      {/* Navigation */}
      <nav className="flex-1 py-10 px-3 space-y-6 overflow-y-auto overflow-x-visible custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`group/item flex items-center h-10 px-3 mx-3 rounded-lg transition-all duration-200 relative ${isActive
                  ? 'bg-slate-50 text-slate-900'
                  : 'text-slate-400 hover:bg-slate-50'
                }`}
            >
              <span className={`flex-shrink-0 w-4 h-4 flex items-center justify-center transition-all duration-300 ${isActive ? item.activeColorClass : item.colorClass + ' group-hover/item:text-slate-600'}`}>
                {React.cloneElement(item.icon, { size: 16 })}
              </span>

              <span className="ml-3 text-[13px] font-semibold text-slate-600 opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden">
                {item.label}
              </span>

              {/* Active Indicator Pillar */}
              {isActive && (
                <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-5 bg-slate-800 rounded-r-full shadow-sm" />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 mt-auto border-t border-slate-100/60 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-slate-800 flex items-center justify-center text-white shadow-sm">
            <span className="text-[11px] font-bold tracking-tight">FG</span>
          </div>
          <div className="flex flex-col opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 overflow-hidden">
            <p className="text-[11px] font-bold text-slate-800 whitespace-nowrap">FluxGrid</p>
            <p className="text-[9px] font-medium text-slate-400 uppercase tracking-tight whitespace-nowrap">Production Node</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
