import React, { useState } from 'react';
import VisualizationEditor from './VisualizationEditor';

const NotebookCell = ({ cell, index, isActive, onFocus, onUpdate, onDelete, onRun, onMoveUp, onMoveDown, totalCells }) => {
  const [showVizEditor, setShowVizEditor] = useState(false);

  if (cell.type === 'text') {
    return (
      <div
        className={`group rounded-xl border transition-all duration-200 bg-white ${isActive ? 'border-violet-400 shadow-sm' : 'border-slate-200 hover:border-violet-200 shadow-sm'}`}
        onClick={() => onFocus(cell.id)}
      >
        <div className="flex items-center justify-between px-3 py-2 bg-slate-50/50 rounded-t-2xl border-b border-surface-100">
          <div className="flex items-center gap-2">
            {/* Drag Handle */}
            <div className="p-1 cursor-grab active:cursor-grabbing text-slate-300 hover:text-brand-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" />
                <circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" />
              </svg>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Markdown Documentation</span>
            <span className="text-[10px] text-slate-400 font-bold ml-1">#{index + 1}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
            <button onClick={(e) => { e.stopPropagation(); onDelete(cell.id); }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100 shadow-sm active:scale-90" title="Delete Cell">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>
        <textarea
          value={cell.content}
          onChange={(e) => onUpdate(cell.id, { content: e.target.value })}
          placeholder="Enter documentation or notes here..."
          rows={2}
          className="w-full px-5 py-4 bg-transparent text-sm text-slate-700 placeholder-slate-400 font-medium resize-none focus:outline-none"
        />
      </div>
    );
  }

  // SQL Cell
  const lines = cell.content.split('\n');

  return (
    <div
      className={`group rounded-xl border transition-all duration-200 bg-white ${isActive ? 'border-slate-400 shadow-sm' : 'border-slate-200 hover:border-slate-300 shadow-sm'}`}
      onClick={() => onFocus(cell.id)}
    >
      {/* Cell header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50/50 rounded-t-2xl border-b border-surface-100">
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <div className="p-1 cursor-grab active:cursor-grabbing text-slate-300 hover:text-brand-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" />
              <circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">SQL Query Entry</span>
            <span className="text-[10px] text-slate-400 font-bold ml-1">#{index + 1}</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          {cell.status === 'running' && (
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Executing Query...
            </span>
          )}
          {cell.status === 'success' && cell.duration && (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 shadow-sm">
              ✓ {cell.duration}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {/* Run Button */}
          <button
            onClick={(e) => { e.stopPropagation(); onRun(cell.id); }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold text-white bg-slate-800 hover:bg-slate-900 shadow-md transition-all active:scale-95"
            title="Execute SQL"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            RUN
          </button>

          <div className="h-5 w-px bg-slate-200 mx-1" />

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
            <button onClick={(e) => { e.stopPropagation(); onDelete(cell.id); }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100 shadow-sm active:scale-90" title="Delete Cell">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex bg-surface-50/30">
        {/* Line numbers */}
        <div className="py-4 px-2 text-right select-none border-r border-surface-200 bg-surface-100/30 min-w-[40px]">
          {lines.map((_, i) => (
            <div key={i} className="text-[11px] leading-[22px] text-slate-400 font-bold font-mono">{i + 1}</div>
          ))}
        </div>
        <textarea
          value={cell.content}
          onChange={(e) => onUpdate(cell.id, { content: e.target.value })}
          spellCheck={false}
          className="flex-1 py-4 px-4 bg-transparent text-[13px] text-slate-700 font-mono leading-[22px] resize-none focus:outline-none placeholder-slate-400 min-h-[88px]"
          placeholder="-- e.g. SELECT * FROM fact_sales LIMIT 10;"
        />
      </div>

      {/* ResultsSection */}
      {cell.results && cell.results.length > 0 && (
        <div className="border-t border-surface-200">
          {/* Results Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-surface-100/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-600 font-bold tracking-tight">{cell.results.length} rows</span>
                <span className="text-[10px] text-brand-600 bg-brand-100/50 px-2 py-0.5 rounded-md border border-brand-200/50 font-bold">
                  {Object.keys(cell.results[0]).length} columns
                </span>
              </div>
              <div className="h-4 w-px bg-surface-300" />
              <button
                onClick={(e) => { e.stopPropagation(); setShowVizEditor(true); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all group/viz"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover/viz:rotate-12 transition-transform">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" />
                </svg>
                OPEN VISUALIZATION
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors" title="Copy results">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              </button>
              <button className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors" title="Export CSV">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              </button>
            </div>
          </div>

          {/* Table View */}
          <div className="overflow-x-auto max-h-[320px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-xs text-left border-collapse border-separate border-spacing-0">
              <thead>
                <tr className="border-b border-surface-200">
                  {Object.keys(cell.results[0]).map((col) => (
                    <th key={col} className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-surface-100/80 sticky top-0 z-10 whitespace-nowrap border-b border-surface-200 border-r border-surface-200/50 last:border-r-0">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 bg-white">
                {cell.results.map((row, ri) => (
                  <tr key={ri} className="hover:bg-brand-50/40 transition-colors group/row">
                    {Object.values(row).map((val, ci) => (
                      <td key={ci} className="px-4 py-2.5 text-slate-700 whitespace-nowrap font-mono text-[11px] border-r border-surface-200/30 last:border-r-0 font-medium tracking-tight">
                        {val === null ? <span className="text-slate-300 italic">null</span> : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Visualization Editor Modal */}
          {showVizEditor && (
            <VisualizationEditor
              data={cell.results}
              columns={Object.keys(cell.results[0])}
              onClose={() => setShowVizEditor(false)}
              onSave={(config) => {
                console.log('Saved visualization configuration:', config);
                setShowVizEditor(false);
              }}
            />
          )}
        </div>
      )}

      {/* Error Message */}
      {cell.error && (
        <div className="border-t border-rose-100 bg-rose-50 px-5 py-3 flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-rose-500 mt-0.5">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div className="flex-1">
            <p className="text-[11px] font-bold text-rose-700 uppercase mb-1">Execution Failure</p>
            <p className="text-xs text-rose-600 font-mono leading-relaxed">{cell.error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotebookCell;

