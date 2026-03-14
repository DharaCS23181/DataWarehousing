import React from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';

const recentActivity = [
  { id: 1, query: 'SELECT * FROM sales_data WHERE region = \'North\'', status: 'success', time: '2 min ago', duration: '1.2s' },
  { id: 2, query: 'INSERT INTO dim_products (name, sku) VALUES (...)', status: 'success', time: '15 min ago', duration: '0.8s' },
  { id: 3, query: 'UPDATE warehouse_inventory SET stock = stock - 50', status: 'warning', time: '1 hr ago', duration: '3.4s' },
  { id: 4, query: 'DELETE FROM staging_temp WHERE created_at < ...', status: 'error', time: '2 hrs ago', duration: '0.1s' },
  { id: 5, query: 'CREATE TABLE fact_orders AS SELECT ...', status: 'success', time: '3 hrs ago', duration: '12.6s' },
];

const Dashboard = () => {
  return (
    <div className="relative min-h-screen animate-fade-in -mx-4 -my-8 px-8 py-10 overflow-hidden bg-white">
      {/* Clean Slate - No Decorative Backgrounds */}

      <div className="relative z-10 space-y-10">
        {/* Intelligent Stats Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            color="slate"
            label="Total Analytical Queries"
            value="142,847"
            trend="18.4% increase"
            trendUp={true}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            }
          />
          <StatCard
            color="emerald"
            label="System Accuracy"
            value="99.98%"
            trend="Calibration optimal"
            trendUp={true}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            }
          />
          <StatCard
            color="slate"
            label="Active Pipelines"
            value="1,248"
            trend="Live tracking"
            trendUp={true}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                <polyline points="7.5 19.79 7.5 14.6 3 12" />
                <polyline points="21 12 16.5 14.6 16.5 19.79" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            }
          />
          <StatCard
            color="blue"
            label="Avg Query Latency"
            value="124ms"
            trend="Performance peak"
            trendUp={true}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            }
          />
        </div>

        {/* Operational Flow Registry */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">System Activity Feed</h2>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Recent Operations Log</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-white text-slate-600 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all border border-slate-200">
                View Archive
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="px-10 py-5 flex items-center justify-between hover:bg-slate-50 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 font-mono truncate">{item.query}</p>
                    <div className="flex items-center gap-3 mt-1">
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">PID: {500 + item.id}</span>
                       <span className="w-0.5 h-0.5 rounded-full bg-slate-300" />
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">LAT: {item.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 flex-shrink-0">
                  <StatusBadge status={item.status} />
                  <div className="text-right min-w-[80px]">
                    <p className="text-[10px] font-bold text-slate-700">{item.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest transition-all border-t border-slate-200">
            Access Full Ledger
          </button>
        </div>

        {/* Core Administrative Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Notebook Editor', desc: 'Author and execute SQL query structures.', path: '/query-editor', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
            { label: 'Query Registry', desc: 'Secure repository of analytical modules.', path: '/saved-queries', icon: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' },
            { label: 'Telemetry log', desc: 'Historical telemetry and audit registries.', path: '/query-history', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="group p-6 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-sm relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center mb-4 text-slate-400 group-hover:text-slate-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d={action.icon} />
                  </svg>
                </div>
                <p className="text-sm font-bold text-slate-800 tracking-tight uppercase">{action.label}</p>
                <p className="text-[11px] font-medium text-slate-500 mt-2 leading-relaxed">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
