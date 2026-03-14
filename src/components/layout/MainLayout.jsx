import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const sidebarWidth = 64;

  return (
    <div className="min-h-screen bg-surface-900 selection-soft overflow-hidden flex flex-col h-screen">
      {/* Top Navbar — full width, always visible */}
      <div className="flex-shrink-0 z-[100]">
        <Navbar />
      </div>

      <div className="flex flex-1 pt-14 overflow-hidden relative">
        {/* Sidebar container - Fixed width Rail */}
        <div
          className="relative flex-shrink-0 z-[100] bg-white w-16"
        >
          <Sidebar />
        </div>

        {/* Main content — scrollable area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50">
          <div className="p-4 sm:p-6 lg:p-8 animate-fade-in w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
