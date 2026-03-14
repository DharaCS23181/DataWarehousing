import React, { useState } from 'react';

const mockDatabase = [
  {
    name: 'analytics_db',
    schemas: [
      {
        name: 'public',
        tables: [
          {
            name: 'fact_sales', columns: [
              { name: 'id', type: 'INT' }, { name: 'product_id', type: 'INT' }, { name: 'region_id', type: 'INT' },
              { name: 'revenue', type: 'DECIMAL' }, { name: 'qty', type: 'INT' }, { name: 'sale_date', type: 'DATE' },
              { name: 'order_id', type: 'VARCHAR' },
            ]
          },
          {
            name: 'fact_orders', columns: [
              { name: 'id', type: 'INT' }, { name: 'customer_id', type: 'INT' }, { name: 'total', type: 'DECIMAL' },
              { name: 'status', type: 'VARCHAR' }, { name: 'created_at', type: 'TIMESTAMP' },
            ]
          },
          {
            name: 'dim_products', columns: [
              { name: 'id', type: 'INT' }, { name: 'product_name', type: 'VARCHAR' }, { name: 'sku', type: 'VARCHAR' },
              { name: 'category', type: 'VARCHAR' }, { name: 'price', type: 'DECIMAL' },
            ]
          },
          {
            name: 'dim_regions', columns: [
              { name: 'id', type: 'INT' }, { name: 'region_name', type: 'VARCHAR' }, { name: 'country', type: 'VARCHAR' },
            ]
          },
          {
            name: 'dim_customers', columns: [
              { name: 'id', type: 'INT' }, { name: 'name', type: 'VARCHAR' }, { name: 'email', type: 'VARCHAR' },
              { name: 'segment', type: 'VARCHAR' }, { name: 'loyalty_tier', type: 'VARCHAR' },
            ]
          },
        ],
      },
      {
        name: 'staging',
        tables: [
          {
            name: 'raw_events', columns: [
              { name: 'id', type: 'BIGINT' }, { name: 'event_type', type: 'VARCHAR' }, { name: 'payload', type: 'JSON' },
              { name: 'timestamp', type: 'TIMESTAMP' },
            ]
          },
          {
            name: 'staging_temp', columns: [
              { name: 'id', type: 'INT' }, { name: 'data', type: 'TEXT' }, { name: 'created_at', type: 'TIMESTAMP' },
            ]
          },
        ],
      },
    ],
  },
  {
    name: 'warehouse_db',
    schemas: [
      {
        name: 'inventory',
        tables: [
          {
            name: 'warehouse_inventory', columns: [
              { name: 'id', type: 'INT' }, { name: 'warehouse_id', type: 'INT' }, { name: 'product_id', type: 'INT' },
              { name: 'stock', type: 'INT' }, { name: 'last_updated', type: 'TIMESTAMP' },
            ]
          },
          {
            name: 'warehouses', columns: [
              { name: 'id', type: 'INT' }, { name: 'name', type: 'VARCHAR' }, { name: 'location', type: 'VARCHAR' },
              { name: 'capacity', type: 'INT' },
            ]
          },
        ],
      },
      {
        name: 'etl',
        tables: [
          {
            name: 'etl_jobs', columns: [
              { name: 'id', type: 'INT' }, { name: 'job_name', type: 'VARCHAR' }, { name: 'status', type: 'VARCHAR' },
              { name: 'run_date', type: 'TIMESTAMP' }, { name: 'duration_ms', type: 'INT' },
            ]
          },
        ],
      },
    ],
  },
];

const typeIcons = {
  INT: '123', BIGINT: '123', DECIMAL: '1.2',
  VARCHAR: 'Abc', TEXT: 'Abc', JSON: '{ }',
  DATE: '📅', TIMESTAMP: '🕐', BOOLEAN: '✓/✗',
};

const ChevronIcon = ({ open }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const DatabaseTree = ({ onInsertTable }) => {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState({ analytics_db: true, 'analytics_db.public': true });

  const toggle = (key) => setExpanded((p) => ({ ...p, [key]: !p[key] }));

  const matchesSearch = (name) => !search || name.toLowerCase().includes(search.toLowerCase());

  return (
    <div className="flex flex-col h-full bg-white animate-fade-in">
      {/* Header */}
      <div className="px-3 py-3 border-b border-surface-300 bg-surface-100/50">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Infrastructure Explorer</h3>
        <div className="relative group/dbsearch">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/dbsearch:text-brand-500 transition-colors">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Filter tables..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-white border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-300 transition-all" />
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-2 text-xs custom-scrollbar">
        {mockDatabase.map((db) => (
          <div key={db.name}>
            {/* Database */}
            <button onClick={() => toggle(db.name)}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-slate-50 transition-colors group/item">
              <ChevronIcon open={expanded[db.name]} />
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" className="text-slate-400 flex-shrink-0 group-hover/item:scale-110 transition-transform">
                <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              </svg>
              <span className="font-bold truncate tracking-tight">{db.name}</span>
            </button>

            {expanded[db.name] && db.schemas.map((schema) => {
              const sKey = `${db.name}.${schema.name}`;
              return (
                <div key={sKey}>
                  {/* Schema */}
                  <button onClick={() => toggle(sKey)}
                    className="w-full flex items-center gap-2 pl-7 pr-3 py-1 text-slate-600 hover:bg-brand-50 transition-colors">
                    <ChevronIcon open={expanded[sKey]} />
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" className="text-violet-500/70 flex-shrink-0">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="font-semibold truncate">{schema.name}</span>
                  </button>

                  {expanded[sKey] && schema.tables.filter((t) => matchesSearch(t.name)).map((table) => {
                    const tKey = `${sKey}.${table.name}`;
                    return (
                      <div key={tKey}>
                        {/* Table */}
                        <button onClick={() => toggle(tKey)}
                          className="w-full flex items-center gap-2 pl-12 pr-3 py-1 text-slate-600 hover:bg-brand-50 transition-colors group/table">
                          <ChevronIcon open={expanded[tKey]} />
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" className="text-brand-400 flex-shrink-0">
                            <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" />
                            <line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" />
                          </svg>
                          <span className="truncate flex-1 text-left font-medium">{table.name}</span>
                          <span onClick={(e) => { e.stopPropagation(); onInsertTable?.(`${schema.name}.${table.name}`); }}
                            className="opacity-0 group-hover/table:opacity-100 text-[9px] font-bold bg-slate-800 text-white px-1 py-0.5 rounded shadow-sm hover:bg-slate-900 transition-all cursor-pointer"
                            title="Insert SELECT query">
                            +SQL
                          </span>
                        </button>

                        {/* Columns */}
                        {expanded[tKey] && table.columns.map((col) => (
                          <div key={`${tKey}.${col.name}`}
                            className="flex items-center gap-2 pl-[4.5rem] pr-3 py-0.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50/30 transition-colors group/col">
                            <span className="w-6 text-[8px] font-bold text-slate-400 text-right flex-shrink-0 bg-surface-200 rounded px-1">{typeIcons[col.type] || col.type}</span>
                            <span className="truncate text-[11px] font-medium">{col.name}</span>
                            <span className="text-[9px] text-slate-300 ml-auto group-hover/col:text-brand-400">{col.type}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatabaseTree;
