import React, { useState } from 'react';

const severityConfig = {
  critical: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    dot: 'bg-rose-400',
    label: 'Critical',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    label: 'Warning',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    dot: 'bg-blue-400',
    label: 'Info',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
};

const mockAlerts = [
  {
    id: 1,
    severity: 'critical',
    title: 'ETL Pipeline Failure',
    message: 'The nightly ETL pipeline for fact_sales has failed at stage 3 (transform). Error: Connection timeout to source database. Immediate attention required.',
    timestamp: '2026-03-14 11:22:00',
    source: 'ETL Monitor',
  },
  {
    id: 2,
    severity: 'critical',
    title: 'Storage Threshold Exceeded',
    message: 'Data warehouse storage has exceeded 90% capacity (847 GB / 1 TB). Consider archiving old partitions or increasing storage allocation.',
    timestamp: '2026-03-14 10:15:33',
    source: 'Storage Monitor',
  },
  {
    id: 3,
    severity: 'warning',
    title: 'Slow Query Detected',
    message: 'Query on fact_orders table took 45.2 seconds to execute. Consider adding an index on order_date column or optimizing the JOIN conditions.',
    timestamp: '2026-03-14 09:45:12',
    source: 'Query Analyzer',
  },
  {
    id: 4,
    severity: 'warning',
    title: 'Schema Drift Detected',
    message: 'Column "customer_tier" was added to source table "customers" but is not reflected in the dim_customers table. Schema sync recommended.',
    timestamp: '2026-03-14 08:30:00',
    source: 'Schema Monitor',
  },
  {
    id: 5,
    severity: 'info',
    title: 'Backup Completed Successfully',
    message: 'Full database backup completed. Size: 234 GB. Duration: 18 minutes. Backup stored in cold storage tier.',
    timestamp: '2026-03-14 06:00:05',
    source: 'Backup Service',
  },
  {
    id: 6,
    severity: 'info',
    title: 'New Data Source Connected',
    message: 'Databricks workspace "analytics-prod" has been successfully connected. 12 tables are now available for querying.',
    timestamp: '2026-03-13 16:20:44',
    source: 'Integration Service',
  },
];

const Alerts = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? alerts : alerts.filter((a) => a.severity === filter);

  const dismiss = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const counts = {
    all: alerts.length,
    critical: alerts.filter((a) => a.severity === 'critical').length,
    warning: alerts.filter((a) => a.severity === 'warning').length,
    info: alerts.filter((a) => a.severity === 'info').length,
  };

  return (
    <div className="space-y-5">
      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {['all', 'critical', 'warning', 'info'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${filter === f
                ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                : 'text-slate-400 border border-surface-500/30 hover:text-slate-200 hover:border-surface-400/50'
              }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-brand-500/30' : 'bg-surface-500/30'}`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Alert cards */}
      <div className="space-y-3">
        {filtered.map((alert) => {
          const config = severityConfig[alert.severity];
          return (
            <div
              key={alert.id}
              className={`rounded-xl border ${config.border} ${config.bg} p-4 transition-all duration-200 hover:shadow-lg animate-fade-in`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`mt-0.5 flex-shrink-0 ${config.text}`}>
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-slate-200">{alert.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${config.bg} ${config.text} border ${config.border}`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{alert.message}</p>
                    </div>
                    <button
                      onClick={() => dismiss(alert.id)}
                      className="flex-shrink-0 p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
                      title="Dismiss"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-500">
                    <span>{alert.source}</span>
                    <span>•</span>
                    <span>{alert.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-slate-600 mb-4">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <p className="text-slate-500 text-sm">No alerts to show</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
