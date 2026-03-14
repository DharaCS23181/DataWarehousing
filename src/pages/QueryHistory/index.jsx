import React, { useState } from 'react';
import StatusBadge from '../../components/ui/StatusBadge';

const mockHistory = [
  { id: 1, query: "SELECT * FROM fact_sales WHERE region = 'North' LIMIT 1000", status: 'success', duration: '1.2s', rows: 1000, timestamp: '2026-03-14 11:30:15', user: 'admin' },
  { id: 2, query: "INSERT INTO dim_products (name, sku, price) VALUES ('Widget X', 'WX-100', 29.99)", status: 'success', duration: '0.3s', rows: 1, timestamp: '2026-03-14 11:15:42', user: 'admin' },
  { id: 3, query: "UPDATE warehouse_inventory SET stock = stock - 50 WHERE warehouse_id = 3", status: 'warning', duration: '2.1s', rows: 47, timestamp: '2026-03-14 10:45:08', user: 'data_eng' },
  { id: 4, query: "DROP TABLE IF EXISTS temp_staging_orders", status: 'error', duration: '0.1s', rows: 0, timestamp: '2026-03-14 10:22:33', user: 'admin' },
  { id: 5, query: "SELECT customer_id, COUNT(*) as order_count FROM fact_orders GROUP BY customer_id HAVING COUNT(*) > 5 ORDER BY order_count DESC", status: 'success', duration: '3.8s', rows: 234, timestamp: '2026-03-14 09:58:11', user: 'analyst' },
  { id: 6, query: "CREATE INDEX idx_sales_date ON fact_sales(sale_date)", status: 'running', duration: '—', rows: 0, timestamp: '2026-03-14 09:30:00', user: 'dba' },
  { id: 7, query: "SELECT DATE_TRUNC('month', sale_date) AS month, SUM(revenue) FROM fact_sales GROUP BY 1 ORDER BY 1", status: 'success', duration: '1.5s', rows: 12, timestamp: '2026-03-14 08:45:20', user: 'analyst' },
  { id: 8, query: "TRUNCATE TABLE staging_raw_events", status: 'error', duration: '0.05s', rows: 0, timestamp: '2026-03-14 08:12:55', user: 'etl_bot' },
  { id: 9, query: "SELECT p.product_name, SUM(s.qty) FROM fact_sales s JOIN dim_products p ON s.product_id = p.id GROUP BY 1 ORDER BY 2 DESC LIMIT 10", status: 'success', duration: '2.4s', rows: 10, timestamp: '2026-03-13 18:30:44', user: 'admin' },
  { id: 10, query: "ALTER TABLE dim_customers ADD COLUMN loyalty_tier VARCHAR(20)", status: 'success', duration: '0.2s', rows: 0, timestamp: '2026-03-13 17:15:30', user: 'dba' },
];

const QueryHistory = () => {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? mockHistory : mockHistory.filter((h) => h.status === filter);

  return (
    <div className="relative min-h-screen animate-fade-in -mx-4 -my-8 px-8 py-10 overflow-hidden bg-white">
      {/* Clean Slate - No Decorative Backgrounds */}

      <div className="relative z-10 space-y-8">
        {/* Intelligence Stats Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-5 rounded-xl flex items-center justify-between group border border-slate-200">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Success Rate</p>
              <p className="text-xl font-bold text-slate-800 tracking-tight">98.4%</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-emerald-600 border border-slate-200">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              </svg>
            </div>
          </div>
          <div className="bg-slate-50 p-5 rounded-xl flex items-center justify-between group border border-slate-200">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Latency</p>
              <p className="text-xl font-bold text-slate-800 tracking-tight">1.24s</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-blue-600 border border-slate-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 12" />
              </svg>
            </div>
          </div>
          <div className="bg-slate-50 p-5 rounded-xl flex items-center justify-between group border border-slate-200">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Data Volume</p>
              <p className="text-xl font-bold text-slate-800 tracking-tight">1.8 TB</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-slate-400 border border-slate-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Registry Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono">Query Filter</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {['all', 'success', 'error', 'warning', 'running'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-200 ${ 
                  filter === f
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="px-4 py-1.5 bg-white rounded-lg border border-slate-200">
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{filtered.length} Records</span>
          </div>
        </div>

        {/* Registry Feed */}
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          {filtered.map((row) => (
            <div 
              key={row.id} 
              className="bg-white px-6 py-4 flex flex-wrap md:flex-nowrap items-center justify-between gap-6 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-center gap-6 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 font-mono truncate" title={row.query}>
                    {row.query}
                  </p>
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{row.user}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{row.duration}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{row.rows.toLocaleString()} Rows</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-10 flex-shrink-0">
                <StatusBadge status={row.status} />
                <div className="text-right min-w-[100px]">
                  <p className="text-[10px] font-bold text-slate-700 uppercase">{row.timestamp.split(' ')[1]}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">{row.timestamp.split(' ')[0]}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest transition-all border-t border-slate-200">
            View Extended Archive
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueryHistory;
