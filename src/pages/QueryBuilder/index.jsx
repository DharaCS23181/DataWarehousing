import React, { useState, useCallback } from 'react';
import DatabaseTree from '../../components/query/DatabaseTree';
import EditorToolbar from '../../components/query/EditorToolbar';
import NotebookCell from '../../components/query/NotebookCell';

// Mock result generators per query pattern
const mockResultSets = {
  sales: [
    { product_name: 'Wireless Mouse', sku: 'WM-001', region: 'North', revenue: 12450, qty: 832 },
    { product_name: 'USB-C Hub', sku: 'UC-047', region: 'South', revenue: 8920, qty: 445 },
    { product_name: 'Mechanical Keyboard', sku: 'MK-112', region: 'East', revenue: 23100, qty: 612 },
    { product_name: 'Monitor Stand', sku: 'MS-089', region: 'West', revenue: 5670, qty: 283 },
    { product_name: 'Webcam HD', sku: 'WC-033', region: 'North', revenue: 15300, qty: 765 },
    { product_name: 'Desk Lamp LED', sku: 'DL-056', region: 'South', revenue: 3240, qty: 162 },
  ],
  orders: [
    { order_id: 'ORD-2001', customer: 'Acme Corp', total: 2499.00, status: 'Delivered', date: '2026-03-12' },
    { order_id: 'ORD-2002', customer: 'Globex Inc', total: 1850.50, status: 'Shipped', date: '2026-03-13' },
    { order_id: 'ORD-2003', customer: 'Initech', total: 5210.00, status: 'Processing', date: '2026-03-14' },
    { order_id: 'ORD-2004', customer: 'Umbrella Co', total: 890.25, status: 'Delivered', date: '2026-03-11' },
    { order_id: 'ORD-2005', customer: 'Stark Ind', total: 12750.00, status: 'Delivered', date: '2026-03-10' },
  ],
  inventory: [
    { warehouse: 'WH-North', product: 'Wireless Mouse', stock: 1250, capacity: 2000, utilization: '62.5%' },
    { warehouse: 'WH-South', product: 'USB-C Hub', stock: 890, capacity: 1500, utilization: '59.3%' },
    { warehouse: 'WH-East', product: 'Keyboard', stock: 2100, capacity: 3000, utilization: '70.0%' },
    { warehouse: 'WH-West', product: 'Monitor Stand', stock: 430, capacity: 1000, utilization: '43.0%' },
  ],
  customers: [
    { customer_id: 1, name: 'Acme Corp', email: 'info@acme.com', segment: 'Enterprise', loyalty: 'Gold' },
    { customer_id: 2, name: 'Globex Inc', email: 'sales@globex.com', segment: 'SMB', loyalty: 'Silver' },
    { customer_id: 3, name: 'Initech', email: 'admin@initech.com', segment: 'Enterprise', loyalty: 'Platinum' },
    { customer_id: 4, name: 'Umbrella Co', email: 'corp@umbrella.com', segment: 'Startup', loyalty: 'Bronze' },
  ],
  default: [
    { id: 1, col_a: 'Alpha', col_b: 245, col_c: 'Active' },
    { id: 2, col_a: 'Beta', col_b: 189, col_c: 'Active' },
    { id: 3, col_a: 'Gamma', col_b: 312, col_c: 'Inactive' },
    { id: 4, col_a: 'Delta', col_b: 567, col_c: 'Active' },
    { id: 5, col_a: 'Epsilon', col_b: 98, col_c: 'Pending' },
  ],
};

const getResultForQuery = (query) => {
  const q = query.toLowerCase();
  if (q.includes('sales') || q.includes('revenue')) return mockResultSets.sales;
  if (q.includes('order')) return mockResultSets.orders;
  if (q.includes('inventory') || q.includes('warehouse')) return mockResultSets.inventory;
  if (q.includes('customer') || q.includes('dim_customers')) return mockResultSets.customers;
  return mockResultSets.default;
};

let cellIdCounter = 3;

const initialCells = [
  {
    id: 1,
    type: 'text',
    content: '📊 Sales Analysis — This notebook queries sales data from the analytics warehouse.',
  },
  {
    id: 2,
    type: 'sql',
    content: `SELECT\n    p.product_name,\n    r.region_name AS region,\n    SUM(s.revenue) AS total_revenue,\n    SUM(s.qty) AS total_qty\nFROM fact_sales s\nJOIN dim_products p ON s.product_id = p.id\nJOIN dim_regions r ON s.region_id = r.id\nWHERE s.sale_date >= '2025-01-01'\nGROUP BY p.product_name, r.region_name\nORDER BY total_revenue DESC;`,
    status: null,
    results: null,
    error: null,
    duration: null,
  },
  {
    id: 3,
    type: 'sql',
    content: `SELECT * FROM dim_customers\nWHERE segment = 'Enterprise'\nORDER BY name;`,
    status: null,
    results: null,
    error: null,
    duration: null,
  },
];

const QueryBuilder = () => {
  const [cells, setCells] = useState(initialCells);
  const [activeCell, setActiveCell] = useState(2);
  const [dbPanelWidth, setDbPanelWidth] = useState(260);
  const [showDbPanel, setShowDbPanel] = useState(true);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const stopResizing = () => setIsResizing(false);

  const resize = (e) => {
    if (isResizing) {
      const newWidth = e.clientX - 64; // Adjust based on sidebar width if needed, but here we just take the relative X
      // More accurate: get the relative position
      if (newWidth > 180 && newWidth < 450) {
        setDbPanelWidth(newWidth);
      }
    }
  };

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing]);

  const addCell = useCallback((type, atIndex) => {
    cellIdCounter++;
    const newCell = {
      id: cellIdCounter,
      type,
      content: '',
      status: null,
      results: null,
      error: null,
      duration: null,
    };
    
    setCells((prev) => {
      if (atIndex === undefined) return [...prev, newCell];
      const next = [...prev];
      next.splice(atIndex, 0, newCell);
      return next;
    });
    
    setActiveCell(cellIdCounter);
  }, []);

  const deleteCell = useCallback((id) => {
    setCells((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateCell = useCallback((id, updates) => {
    setCells((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const moveCell = useCallback((id, direction) => {
    setCells((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx < 0) return prev;
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr;
    });
  }, []);

  const runCell = useCallback((id) => {
    setCells((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'running', results: null, error: null } : c)));
    const cell = cells.find((c) => c.id === id);
    if (!cell || cell.type !== 'sql' || !cell.content.trim()) return;

    setTimeout(() => {
      const duration = (Math.random() * 3 + 0.2).toFixed(1) + 's';
      const results = getResultForQuery(cell.content);
      setCells((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'success', results, duration, error: null } : c))
      );
    }, 600 + Math.random() * 800);
  }, [cells]);

  const runAll = useCallback(() => {
    const sqlCells = cells.filter((c) => c.type === 'sql' && c.content.trim());
    sqlCells.forEach((cell, i) => {
      setTimeout(() => runCell(cell.id), i * 500);
    });
  }, [cells, runCell]);

  const insertTable = useCallback((tableName) => {
    const query = `SELECT * FROM ${tableName}\nLIMIT 100;`;
    cellIdCounter++;
    const newCell = {
      id: cellIdCounter,
      type: 'sql',
      content: query,
      status: null,
      results: null,
      error: null,
      duration: null,
    };
    setCells((prev) => [...prev, newCell]);
    setActiveCell(cellIdCounter);
  }, []);

  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newCells = [...cells];
    const item = newCells[draggedIndex];
    newCells.splice(draggedIndex, 1);
    newCells.splice(index, 0, item);
    setCells(newCells);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const InlineAddCell = ({ index }) => (
    <div className="relative h-4 group/inline z-20 -my-2">
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/inline:opacity-100 transition-all duration-300">
        <div className="w-full h-px bg-slate-200" />
        <div className="absolute flex items-center gap-2 p-1 bg-white rounded-lg border border-slate-200 shadow-sm scale-90 group-hover/inline:scale-100 transition-transform duration-200">
          <button
            onClick={() => addCell('sql', index)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[9px] font-bold text-slate-600 hover:bg-slate-800 hover:text-white transition-all"
          >
            SQL
          </button>
          <div className="w-px h-3 bg-slate-100" />
          <button
            onClick={() => addCell('text', index)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[9px] font-bold text-violet-600 hover:bg-violet-600 hover:text-white transition-all"
          >
            TEXT
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 animate-fade-in -m-8 overflow-hidden">
      {/* Database Panel */}
      {showDbPanel && (
        <div className="flex flex-shrink-0 relative group/panel">
          <div
            className="h-full border-r border-slate-200 bg-white transition-all duration-300"
            style={{ width: dbPanelWidth }}
          >
            <DatabaseTree onInsertTable={insertTable} />
          </div>

          {/* Internal Resizer Grip */}
          <div
            onMouseDown={startResizing}
            className={`absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-brand-500/20 transition-all z-[45] group/db-resizer ${isResizing ? 'bg-brand-500/30' : ''}`}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-8 bg-white border border-slate-200 rounded-md shadow-sm opacity-0 group-hover/db-resizer:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
              <div className="flex flex-col gap-0.5">
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <div className="w-1 h-1 rounded-full bg-slate-300" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main notebook area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
        {/* Toggle DB panel floating button */}
        {!showDbPanel && (
          <button
            onClick={() => setShowDbPanel(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-50 w-5 h-16 bg-white border border-l-0 border-slate-200 rounded-r-2xl shadow-soft flex items-center justify-center text-brand-500 hover:text-brand-600 transition-all active:scale-95 group/toggle"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover/toggle:translate-x-0.5 transition-transform">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}

        {/* Toolbar */}
        <div className="flex-shrink-0 bg-white border-b border-slate-100 z-10">
          <EditorToolbar
            onAddCell={addCell}
            onRunAll={runAll}
            onSave={(name, desc) => alert(`Saved: ${name}`)}
            onExport={(fmt) => alert(`Exported as ${fmt}`)}
            onSchedule={(freq, time) => alert(`Scheduled: ${freq} at ${time}`)}
          />
        </div>

        {/* Cells Workspace */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-12 space-y-4 custom-scrollbar relative">
          {cells.map((cell, index) => (
            <React.Fragment key={cell.id}>
              <InlineAddCell index={index} />
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`transition-all duration-300 ${draggedIndex === index ? 'opacity-40 scale-[0.98]' : 'opacity-100 scale-100'}`}
              >
                <NotebookCell
                  cell={cell}
                  index={index}
                  isActive={activeCell === cell.id}
                  onFocus={setActiveCell}
                  onUpdate={updateCell}
                  onDelete={deleteCell}
                  onRun={runCell}
                  onMoveUp={(id) => moveCell(id, -1)}
                  onMoveDown={(id) => moveCell(id, 1)}
                  totalCells={cells.length}
                />
              </div>
            </React.Fragment>
          ))}
          <InlineAddCell index={cells.length} />

          <div className="flex items-center justify-center pt-8 pb-32">
            <div className="flex items-center gap-6 p-2 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
              <button
                onClick={() => addCell('sql')}
                className="flex items-center gap-3 px-8 py-3 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-800 hover:text-white transition-all active:scale-95 group"
              >
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-inherit shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                INSERT SQL WORKSPACE
              </button>
              <div className="w-px h-8 bg-slate-200" />
              <button
                onClick={() => addCell('text')}
                className="flex items-center gap-3 px-8 py-3 rounded-lg text-xs font-bold text-slate-500 hover:bg-violet-600 hover:text-white transition-all active:scale-95 group"
              >
                <div className="w-7 h-7 rounded-lg bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-600 group-hover:text-inherit shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                INSERT TEXT CELL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryBuilder;
