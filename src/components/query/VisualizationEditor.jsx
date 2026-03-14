import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';

const CHART_TYPES = [
  { key: 'bar', label: 'Bar' },
  { key: 'column', label: 'Column' },
  { key: 'line', label: 'Line' },
  { key: 'area', label: 'Area' },
  { key: 'pie', label: 'Pie' },
  { key: 'donut', label: 'Donut' },
  { key: 'scatter', label: 'Scatter' },
];

const AGGREGATIONS = [
  { key: 'none', label: 'None' },
  { key: 'sum', label: 'Sum' },
  { key: 'avg', label: 'Average' },
  { key: 'count', label: 'Count' },
  { key: 'count_distinct', label: 'Count Distinct' },
  { key: 'min', label: 'Min' },
  { key: 'max', label: 'Max' },
];

const DIRECTIONS = ['Clockwise', 'Counterclockwise'];
const LEGEND_PLACEMENTS = ['Automatic (Flexible)', 'Top', 'Bottom', 'Left', 'Right', 'Hidden'];
const COLOR_PALETTES = {
  default: ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#14b8a6', '#6366f1', '#ec4899', '#84cc16', '#f97316', '#0ea5e9'],
  warm: ['#f43f5e', '#f97316', '#f59e0b', '#eab308', '#ef4444', '#fb923c', '#fbbf24', '#fcd34d', '#dc2626', '#ea580c', '#d97706', '#ca8a04'],
  cool: ['#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#14b8a6', '#2dd4bf', '#22d3ee', '#38bdf8', '#818cf8', '#c084fc'],
  earth: ['#059669', '#10b981', '#34d399', '#065f46', '#047857', '#064e3b', '#6ee7b7', '#a7f3d0', '#d1fae5', '#ecfdf5', '#022c22', '#14532d'],
  mono: ['#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a', '#f8fafc', '#f1f5f9', '#b0bec5', '#78909c'],
};

const VisualizationEditor = ({ data, columns, onClose, onSave }) => {
  const [chartType, setChartType] = useState('bar');
  const [activeTab, setActiveTab] = useState('general');
  const [xColumn, setXColumn] = useState(columns[0] || '');
  const [yColumns, setYColumns] = useState([{ column: columns.length > 1 ? columns[1] : columns[0] || '', aggregation: 'none' }]);
  const [groupBy, setGroupBy] = useState('');
  const [direction, setDirection] = useState('Clockwise');
  const [legendPlacement, setLegendPlacement] = useState('Automatic (Flexible)');
  const [showDataLabels, setShowDataLabels] = useState(true);
  const [dataLabelPosition, setDataLabelPosition] = useState('outside');
  const [showValues, setShowValues] = useState(true);
  const [showPercentages, setShowPercentages] = useState(false);
  const [colorPalette, setColorPalette] = useState('default');
  const [seriesColors, setSeriesColors] = useState({});
  const [title, setTitle] = useState('');
  const [stacked, setStacked] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [smooth, setSmooth] = useState(false);

  const colors = COLOR_PALETTES[colorPalette];

  const parseNum = (val) => {
    if (typeof val === 'number') return val;
    const cleaned = String(val).replace(/[$,%]/g, '');
    return isNaN(Number(cleaned)) ? 0 : Number(cleaned);
  };

  const numericColumns = useMemo(() =>
    columns.filter((col) => data.some((row) => typeof row[col] === 'number' || !isNaN(Number(String(row[col]).replace(/[$,%]/g, ''))))),
    [columns, data]
  );

  const addYColumn = () => {
    const available = numericColumns.filter((c) => !yColumns.find((y) => y.column === c));
    if (available.length > 0) setYColumns([...yColumns, { column: available[0], aggregation: 'none' }]);
  };

  const removeYColumn = (idx) => {
    if (yColumns.length > 1) setYColumns(yColumns.filter((_, i) => i !== idx));
  };

  const updateYColumn = (idx, updates) => {
    setYColumns(yColumns.map((y, i) => (i === idx ? { ...y, ...updates } : y)));
  };

  // Prepare chart data
  const chartData = useMemo(() => {
    return data.slice(0, 20).map((row) => {
      const entry = { label: String(row[xColumn] ?? '') };
      yColumns.forEach((yc) => {
        entry[yc.column] = parseNum(row[yc.column]);
      });
      return entry;
    });
  }, [data, xColumn, yColumns]);

  const maxVal = useMemo(() => {
    return Math.max(...chartData.flatMap((d) => yColumns.map((yc) => d[yc.column] || 0)), 1);
  }, [chartData, yColumns]);

  // --- RENDER CHARTS ---
  const renderBarOrColumn = () => {
    const isHorizontal = chartType === 'bar';
    const chartH = 300;
    const chartW = 600;
    const seriesCount = yColumns.length;
    const groupWidth = isHorizontal
      ? chartH / chartData.length - 8
      : chartW / chartData.length - 16;
    const barSize = Math.max(8, groupWidth / seriesCount - 2);

    if (isHorizontal) {
      return (
        <svg width={chartW} height={chartH + 30} className="block">
          {showGrid && [0, 0.25, 0.5, 0.75, 1].map((f) => (
            <line key={f} x1={f * chartW} y1="0" x2={f * chartW} y2={chartH} stroke="rgba(71,85,105,0.15)" strokeDasharray="3" />
          ))}
          {chartData.map((d, ri) => {
            const baseY = ri * (groupWidth + 8) + 4;
            return (
              <g key={ri}>
                {yColumns.map((yc, si) => {
                  const w = (d[yc.column] / maxVal) * (chartW - 40);
                  const y = baseY + si * (barSize + 2);
                  return (
                    <g key={si}>
                      <rect x="0" y={y} width={Math.max(w, 2)} height={barSize} rx="2" fill={colors[si % colors.length]} opacity="0.85">
                        <title>{`${d.label} — ${yc.column}: ${d[yc.column]}`}</title>
                      </rect>
                      {showDataLabels && showValues && (
                        <text x={w + 4} y={y + barSize / 2 + 3} fontSize="9" fill="#94a3b8">{d[yc.column].toLocaleString()}</text>
                      )}
                    </g>
                  );
                })}
                <text x={-4} y={baseY + groupWidth / 2 + 3} textAnchor="end" fontSize="9" fill="#64748b" visibility="hidden">{d.label}</text>
              </g>
            );
          })}
          {/* X labels at bottom */}
          {chartData.map((d, i) => (
            <text key={i} x="-5" y={i * (groupWidth + 8) + groupWidth / 2 + 6} textAnchor="end" fontSize="9" fill="#64748b" className="select-none">
              {d.label.length > 12 ? d.label.slice(0, 12) + '…' : d.label}
            </text>
          ))}
        </svg>
      );
    }

    // Column chart (vertical bars)
    const barW = Math.max(10, Math.min(36, (chartW - 40) / (chartData.length * seriesCount) - 4));
    return (
      <svg width={chartW} height={chartH + 30} className="block">
        {showGrid && [0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1="0" y1={chartH - f * chartH} x2={chartW} y2={chartH - f * chartH} stroke="rgba(71,85,105,0.15)" strokeDasharray="3" />
        ))}
        {chartData.map((d, ri) => {
          const groupX = ri * (chartW / chartData.length) + 10;
          return (
            <g key={ri}>
              {yColumns.map((yc, si) => {
                const h = (d[yc.column] / maxVal) * chartH;
                const x = groupX + si * (barW + 2);
                return (
                  <g key={si}>
                    <rect x={x} y={chartH - h} width={barW} height={h} rx="2" fill={colors[si % colors.length]} opacity="0.85">
                      <title>{`${d.label} — ${yc.column}: ${d[yc.column]}`}</title>
                    </rect>
                    {showDataLabels && showValues && (
                      <text x={x + barW / 2} y={chartH - h - 4} textAnchor="middle" fontSize="8" fill="#94a3b8">{d[yc.column].toLocaleString()}</text>
                    )}
                  </g>
                );
              })}
              <text x={groupX + (seriesCount * barW) / 2} y={chartH + 14} textAnchor="middle" fontSize="9" fill="#64748b" className="select-none">
                {d.label.length > 8 ? d.label.slice(0, 8) + '…' : d.label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  const renderLineOrArea = () => {
    const chartH = 300;
    const chartW = 600;
    const isArea = chartType === 'area';
    return (
      <svg width={chartW} height={chartH + 30} className="block">
        <defs>
          {yColumns.map((_, si) => (
            <linearGradient key={si} id={`areaGrad_${si}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors[si % colors.length]} stopOpacity="0.3" />
              <stop offset="100%" stopColor={colors[si % colors.length]} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {showGrid && [0, 0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line x1="0" y1={chartH - f * chartH} x2={chartW} y2={chartH - f * chartH} stroke="rgba(71,85,105,0.15)" strokeDasharray="3" />
            <text x={chartW + 4} y={chartH - f * chartH + 3} fontSize="8" fill="#475569">{Math.round(maxVal * f).toLocaleString()}</text>
          </g>
        ))}
        {yColumns.map((yc, si) => {
          const pts = chartData.map((d, i) => ({
            x: (i / Math.max(chartData.length - 1, 1)) * (chartW - 40) + 20,
            y: chartH - (d[yc.column] / maxVal) * chartH,
            val: d[yc.column],
            label: d.label,
          }));
          const pathD = pts.map((p, i) => {
            if (smooth && i > 0) {
              const prev = pts[i - 1];
              const cpx = (prev.x + p.x) / 2;
              return `C ${cpx} ${prev.y}, ${cpx} ${p.y}, ${p.x} ${p.y}`;
            }
            return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
          }).join(' ');
          const areaD = pathD + ` L ${pts[pts.length - 1]?.x || 0} ${chartH} L ${pts[0]?.x || 0} ${chartH} Z`;
          return (
            <g key={si}>
              {isArea && <path d={areaD} fill={`url(#areaGrad_${si})`} />}
              <path d={pathD} fill="none" stroke={colors[si % colors.length]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill={colors[si % colors.length]} stroke="#0f172a" strokeWidth="2">
                  <title>{`${p.label} — ${yc.column}: ${p.val}`}</title>
                </circle>
              ))}
            </g>
          );
        })}
        {chartData.map((d, i) => (
          <text key={i} x={(i / Math.max(chartData.length - 1, 1)) * (chartW - 40) + 20} y={chartH + 14} textAnchor="middle" fontSize="9" fill="#64748b">
            {d.label.length > 8 ? d.label.slice(0, 8) + '…' : d.label}
          </text>
        ))}
      </svg>
    );
  };

  const renderPieOrDonut = () => {
    const isDonut = chartType === 'donut';
    const yCol = yColumns[0]?.column || '';
    const total = chartData.reduce((s, d) => s + (d[yCol] || 0), 0) || 1;
    const size = 280;
    const cx = size / 2, cy = size / 2, r = 110;
    const innerR = isDonut ? 55 : 0;
    let cumAngle = direction === 'Clockwise' ? -Math.PI / 2 : Math.PI / 2;
    const dir = direction === 'Clockwise' ? 1 : -1;

    const slices = chartData.map((d, i) => {
      const val = d[yCol] || 0;
      const angle = (val / total) * 2 * Math.PI * dir;
      const startA = cumAngle;
      cumAngle += angle;
      const endA = cumAngle;

      const startOuter = { x: cx + r * Math.cos(startA), y: cy + r * Math.sin(startA) };
      const endOuter = { x: cx + r * Math.cos(endA), y: cy + r * Math.sin(endA) };
      const startInner = { x: cx + innerR * Math.cos(endA), y: cy + innerR * Math.sin(endA) };
      const endInner = { x: cx + innerR * Math.cos(startA), y: cy + innerR * Math.sin(startA) };
      const large = Math.abs(angle) > Math.PI ? 1 : 0;
      const sweep = dir > 0 ? 1 : 0;

      const path = isDonut
        ? `M ${startOuter.x} ${startOuter.y} A ${r} ${r} 0 ${large} ${sweep} ${endOuter.x} ${endOuter.y} L ${startInner.x} ${startInner.y} A ${innerR} ${innerR} 0 ${large} ${1 - sweep} ${endInner.x} ${endInner.y} Z`
        : `M ${cx} ${cy} L ${startOuter.x} ${startOuter.y} A ${r} ${r} 0 ${large} ${sweep} ${endOuter.x} ${endOuter.y} Z`;

      const midAngle = startA + angle / 2;
      const labelR = r + 16;
      const labelPos = { x: cx + labelR * Math.cos(midAngle), y: cy + labelR * Math.sin(midAngle) };

      return { path, color: colors[i % colors.length], label: d.label, value: val, pct: ((val / total) * 100).toFixed(1), labelPos };
    });

    return (
      <div className="flex items-start gap-8">
        <svg width={size + 40} height={size + 40} viewBox={`-20 -20 ${size + 40} ${size + 40}`} className="flex-shrink-0">
          {slices.map((s, i) => (
            <path key={i} d={s.path} fill={s.color} opacity="0.85" stroke="#0f172a" strokeWidth="1.5" className="hover:opacity-100 transition-opacity cursor-pointer">
              <title>{`${s.label}: ${s.value.toLocaleString()} (${s.pct}%)`}</title>
            </path>
          ))}
          {isDonut && (
            <>
              <circle cx={cx} cy={cy} r={innerR - 2} fill="#0f172a" opacity="0.5" />
              <text x={cx} y={cy - 4} textAnchor="middle" fontSize="18" fontWeight="700" fill="#e2e8f0">{total.toLocaleString()}</text>
              <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="#64748b">Total</text>
            </>
          )}
          {showDataLabels && slices.map((s, i) => (
            <text key={i} x={s.labelPos.x} y={s.labelPos.y} textAnchor="middle" fontSize="8" fill="#94a3b8">
              {showPercentages ? `${s.pct}%` : s.value.toLocaleString()}
            </text>
          ))}
        </svg>

        {/* Legend */}
        {legendPlacement !== 'Hidden' && (
          <div className="flex flex-col gap-1.5 pt-4 max-h-[280px] overflow-y-auto">
            {slices.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: s.color }} />
                <span className="text-slate-300 truncate max-w-[140px]">{s.label}</span>
                <span className="text-slate-500 ml-2 font-mono text-[10px]">{s.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderScatter = () => {
    const chartH = 300;
    const chartW = 600;
    const yCol = yColumns[0]?.column || '';
    const xVals = chartData.map((d) => parseNum(d.label));
    const yVals = chartData.map((d) => d[yCol] || 0);
    const maxX = Math.max(...xVals, 1);
    const maxY = Math.max(...yVals, 1);
    return (
      <svg width={chartW} height={chartH + 30} className="block">
        {showGrid && [0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1="0" y1={chartH - f * chartH} x2={chartW} y2={chartH - f * chartH} stroke="rgba(71,85,105,0.15)" strokeDasharray="3" />
        ))}
        {chartData.map((d, i) => {
          const x = (xVals[i] / maxX) * (chartW - 40) + 20;
          const y = chartH - (yVals[i] / maxY) * chartH;
          return (
            <circle key={i} cx={x} cy={y} r="6" fill={colors[0]} opacity="0.7" stroke={colors[0]} strokeWidth="1" className="hover:opacity-100 cursor-pointer">
              <title>{`${d.label}: ${d[yCol]}`}</title>
            </circle>
          );
        })}
      </svg>
    );
  };

  const renderChart = () => {
    if (!chartData.length) return <p className="text-slate-500 text-sm">No data to visualize</p>;
    switch (chartType) {
      case 'bar': case 'column': return renderBarOrColumn();
      case 'line': case 'area': return renderLineOrArea();
      case 'pie': case 'donut': return renderPieOrDonut();
      case 'scatter': return renderScatter();
      default: return null;
    }
  };

  const tabs = [
    { key: 'general', label: 'General' },
    { key: 'series', label: 'Series' },
    { key: 'colors', label: 'Colors' },
    { key: 'labels', label: 'Data Labels' },
  ];

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex flex-col bg-slate-950/60 backdrop-blur-xl">
      <div className="flex-1 flex flex-col bg-white overflow-hidden shadow-2xl relative">



        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="12" width="4" height="9" rx="1" /><rect x="10" y="7" width="4" height="14" rx="1" /><rect x="17" y="3" width="4" height="18" rx="1" />
              </svg>
            </div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Visualization Workspace</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar - config */}
          <div className="w-[320px] flex-shrink-0 border-r border-slate-200 bg-slate-50/50 flex flex-col overflow-hidden">
            {/* Chart type */}
            <div className="px-5 py-5 border-b border-slate-200 bg-white">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Configuration Layer</label>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5 ml-0.5">Visual Paradigm</label>
                  <select value={chartType} onChange={(e) => setChartType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-400 transition-all shadow-sm">
                    {CHART_TYPES.map((ct) => <option key={ct.key} value={ct.key}>{ct.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex px-4 pt-4 border-b border-slate-200 bg-white">
              {tabs.map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all relative ${activeTab === tab.key ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
                    }`}>
                  {tab.label}
                  {activeTab === tab.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 custom-scrollbar">
              {activeTab === 'general' && (
                <>
                  {/* X Column */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-2">Abscissa (X-Axis)</label>
                    <select value={xColumn} onChange={(e) => setXColumn(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-xs bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-slate-400 shadow-sm">
                      {columns.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Y Columns */}
                  <div className="space-y-3">
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Ordinate (Y-Axis)</label>
                    {yColumns.map((yc, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2.5">
                        <div className="flex items-center gap-2">
                          <select value={yc.column} onChange={(e) => updateYColumn(idx, { column: e.target.value })}
                            className="flex-1 px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none group-hover:bg-white">
                            {(numericColumns.length > 0 ? numericColumns : columns).map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                          {yColumns.length > 1 && (
                            <button onClick={() => removeYColumn(idx)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Method</label>
                          <select value={yc.aggregation} onChange={(e) => updateYColumn(idx, { aggregation: e.target.value })}
                            className="flex-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-slate-50 border border-slate-200 text-slate-600 focus:outline-none uppercase">
                            {AGGREGATIONS.map((a) => <option key={a.key} value={a.key}>{a.label}</option>)}
                          </select>
                        </div>
                      </div>
                    ))}
                    <button onClick={addYColumn} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors ml-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      Append Dimension
                    </button>
                  </div>

                  {/* Group By */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-2">Grouping Attribute</label>
                    <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-xs bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-slate-400 shadow-sm">
                      <option value="">Unset</option>
                      {columns.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Direction (for pie/donut) */}
                  {(chartType === 'pie' || chartType === 'donut') && (
                    <div>
                      <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Direction</label>
                      <select value={direction} onChange={(e) => setDirection(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-surface-800/60 border border-surface-500/25 text-slate-300 focus:outline-none focus:border-brand-500/50">
                        {DIRECTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  )}

                  {/* Legend */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-2">Legend Topology</label>
                    <select value={legendPlacement} onChange={(e) => setLegendPlacement(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-xs bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-slate-400 shadow-sm">
                      {LEGEND_PLACEMENTS.map((lp) => <option key={lp} value={lp}>{lp}</option>)}
                    </select>
                  </div>

                  {/* Stacked (bar/column) */}
                  {(chartType === 'bar' || chartType === 'column') && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={stacked} onChange={(e) => setStacked(e.target.checked)}
                        className="w-3.5 h-3.5 rounded bg-surface-700 border-surface-500/40 text-brand-500 focus:ring-brand-500/30" />
                      <span className="text-xs text-slate-400">Stacked</span>
                    </label>
                  )}

                  {/* Smooth (line/area) */}
                  {(chartType === 'line' || chartType === 'area') && (
                    <>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={smooth} onChange={(e) => setSmooth(e.target.checked)}
                          className="w-3.5 h-3.5 rounded bg-surface-700 border-surface-500/40 text-brand-500 focus:ring-brand-500/30" />
                        <span className="text-xs text-slate-400">Smooth curve</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)}
                          className="w-3.5 h-3.5 rounded bg-surface-700 border-surface-500/40 text-brand-500 focus:ring-brand-500/30" />
                        <span className="text-xs text-slate-400">Show grid lines</span>
                      </label>
                    </>
                  )}

                  {/* Title */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-2">Workspace Identifier</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Default Visualization..."
                      className="w-full px-3 py-2.5 rounded-xl text-xs bg-white border border-slate-200 text-slate-700 placeholder-slate-300 focus:outline-none focus:border-slate-400 shadow-sm" />
                  </div>
                </>
              )}

              {activeTab === 'series' && (
                <div className="space-y-4">
                  <p className="text-[11px] font-medium text-slate-400 leading-relaxed">Orchestrate individual data dimensionality and series behavior.</p>
                  {yColumns.map((yc, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ background: seriesColors[yc.column] || colors[idx % colors.length] }} />
                        <span className="text-xs text-slate-900 font-bold tracking-tight">{yc.column}</span>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reduction Method</label>
                        <select value={yc.aggregation} onChange={(e) => updateYColumn(idx, { aggregation: e.target.value })}
                          className="w-full px-2.5 py-2 rounded-lg text-xs bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-slate-400 transition-colors uppercase font-bold">
                          {AGGREGATIONS.map((a) => <option key={a.key} value={a.key}>{a.label}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'colors' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-2">Color Palette</label>
                    {Object.entries(COLOR_PALETTES).map(([key, pal]) => (
                      <button key={key} onClick={() => setColorPalette(key)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1.5 transition-all ${colorPalette === key ? 'bg-brand-500/10 border border-brand-500/30' : 'hover:bg-white/5 border border-transparent'
                          }`}>
                        <div className="flex gap-0.5">
                          {pal.slice(0, 8).map((c, i) => (
                            <span key={i} className="w-4 h-4 rounded-sm" style={{ background: c }} />
                          ))}
                        </div>
                        <span className="text-xs text-slate-400 capitalize">{key}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'labels' && (
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={showDataLabels} onChange={(e) => setShowDataLabels(e.target.checked)}
                      className="w-3.5 h-3.5 rounded bg-surface-700 border-surface-500/40 text-brand-500 focus:ring-brand-500/30" />
                    <span className="text-xs text-slate-300">Show data labels</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={showValues} onChange={(e) => setShowValues(e.target.checked)}
                      className="w-3.5 h-3.5 rounded bg-surface-700 border-surface-500/40 text-brand-500 focus:ring-brand-500/30" />
                    <span className="text-xs text-slate-300">Show values</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={showPercentages} onChange={(e) => setShowPercentages(e.target.checked)}
                      className="w-3.5 h-3.5 rounded bg-surface-700 border-surface-500/40 text-brand-500 focus:ring-brand-500/30" />
                    <span className="text-xs text-slate-300">Show percentages</span>
                  </label>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Label Position</label>
                    <select value={dataLabelPosition} onChange={(e) => setDataLabelPosition(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-xs bg-surface-800/60 border border-surface-500/25 text-slate-300 focus:outline-none focus:border-brand-500/50">
                      <option value="outside">Outside</option>
                      <option value="inside">Inside</option>
                      <option value="center">Center</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right - Chart preview */}
          <div className="flex-1 flex flex-col bg-slate-50/30 overflow-hidden">
            {/* Workspace State */}
            <div className="px-8 py-5 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Live Synthesis</span>
                </div>
                {title && <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>}
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Density</p>
                  <p className="text-xs font-bold text-slate-900">{chartData.length} Points</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Complexity</p>
                  <p className="text-xs font-bold text-slate-900">{yColumns.length} Layers</p>
                </div>
              </div>
            </div>

            {/* Chart area */}
            <div className="flex-1 flex flex-col items-center justify-center p-12 overflow-auto">
              <div className="w-full max-w-4xl p-10 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 relative">
                {/* Decorative UI elements */}
                <div className="absolute top-6 left-6 flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                </div>
                <div className="flex items-center justify-center mt-4">
                  {renderChart()}
                </div>
              </div>
            </div>

            {/* Detail bar */}
            <div className="px-8 py-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Awaiting Transformation</span>
              </div>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter italic">SVG Dynamic Engine v2.0</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-slate-200 bg-white z-10">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
            Discard Changes
          </button>
          <button onClick={() => onSave?.({ chartType, xColumn, yColumns, colorPalette, title, legendPlacement })}
            className="px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95">
            Commit Parameters
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default VisualizationEditor;
