import React, { useState } from 'react';

const mockSavedQueries = [
  {
    id: 1,
    name: 'Sales by Region',
    description: 'Aggregate sales data grouped by geographic region with YoY comparison',
    query: 'SELECT region, SUM(revenue) FROM fact_sales GROUP BY region',
    tags: ['sales', 'analytics'],
    lastRun: '2 hours ago',
    createdAt: 'Mar 12, 2026',
  },
  {
    id: 2,
    name: 'Product Inventory Check',
    description: 'Current inventory levels across all warehouses for active products',
    query: 'SELECT * FROM warehouse_inventory WHERE stock > 0',
    tags: ['inventory', 'warehouse'],
    lastRun: '1 day ago',
    createdAt: 'Mar 10, 2026',
  },
  {
    id: 3,
    name: 'Customer Segmentation',
    description: 'Segment customers by purchase frequency and average order value',
    query: 'SELECT customer_id, COUNT(*) as orders FROM fact_orders GROUP BY customer_id',
    tags: ['customers', 'segmentation'],
    lastRun: '3 days ago',
    createdAt: 'Mar 8, 2026',
  },
  {
    id: 4,
    name: 'Revenue Trend Monthly',
    description: 'Monthly revenue trends for the current fiscal year',
    query: "SELECT DATE_TRUNC('month', sale_date), SUM(revenue) FROM fact_sales GROUP BY 1",
    tags: ['revenue', 'trends'],
    lastRun: '5 hours ago',
    createdAt: 'Mar 5, 2026',
  },
  {
    id: 5,
    name: 'Failed ETL Jobs',
    description: 'List all ETL pipeline jobs that failed in the last 7 days',
    query: "SELECT * FROM etl_jobs WHERE status = 'FAILED' AND run_date > NOW() - INTERVAL '7 days'",
    tags: ['etl', 'monitoring'],
    lastRun: '30 min ago',
    createdAt: 'Mar 1, 2026',
  },
  {
    id: 6,
    name: 'Top 10 Products',
    description: 'Best-selling products by quantity and revenue across all channels',
    query: 'SELECT product_name, SUM(qty) FROM fact_sales GROUP BY product_name ORDER BY 2 DESC LIMIT 10',
    tags: ['products', 'top'],
    lastRun: '1 day ago',
    createdAt: 'Feb 28, 2026',
  },
];

const SavedQueries = () => {
  const [search, setSearch] = useState('');

  const filtered = mockSavedQueries.filter(
    (q) =>
      q.name.toLowerCase().includes(search.toLowerCase()) ||
      q.description.toLowerCase().includes(search.toLowerCase()) ||
      q.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="relative min-h-screen animate-fade-in -mx-4 -my-8 px-8 py-10 overflow-hidden bg-white">
      {/* Clean Slate - No Decorative Backgrounds */}

      <div className="relative z-10 space-y-10">
        {/* Header bar - Query Registry Search */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="relative flex-1 w-full max-w-2xl group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor" strokeWidth="2.5"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search registry..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-2.5 rounded-lg text-xs bg-white border border-slate-200 text-slate-800 font-bold placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-all uppercase tracking-widest"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700">
              <span className="text-[10px] font-bold uppercase tracking-widest">{filtered.length} Modules</span>
            </div>
          </div>
        </div>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map((q, idx) => (
            <div
              key={q.id}
              className="bg-slate-50 p-6 rounded-xl border border-slate-200 transition-all duration-200 flex flex-col hover:bg-white hover:border-slate-300 hover:shadow-sm"
            >
              {/* Module Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{q.createdAt}</p>
                </div>
              </div>

              {/* Metadata */}
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{q.name}</h3>
                <p className="text-[11px] font-medium text-slate-500 mt-2 leading-relaxed">{q.description}</p>
              </div>

              {/* Syntax Preview */}
              <div className="rounded-2xl bg-slate-50 px-5 py-4 mb-8 overflow-hidden relative group/code border border-slate-100">
                <p className="text-xs text-slate-600 font-mono truncate tracking-tight">{q.query}</p>
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-slate-50" />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-10">
                {q.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-slate-50 text-slate-500 border border-slate-200 group-hover/card:bg-brand-50 group-hover/card:text-brand-600 group-hover/card:border-brand-200 transition-all"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Technical Actions */}
              <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Last Active</span>
                  <span className="text-sm text-slate-800 font-bold tracking-tight">{q.lastRun}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-100 hover:border-slate-800 transition-all shadow-sm" title="Execute Query">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6 4 20 12 6 20 6 4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedQueries;
