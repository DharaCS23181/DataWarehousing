import React from 'react';

const variants = {
  success: {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    dot: 'bg-emerald-500',
    border: 'border-slate-200',
  },
  error: {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    dot: 'bg-rose-500',
    border: 'border-slate-200',
  },
  warning: {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    dot: 'bg-amber-500',
    border: 'border-slate-200',
  },
  info: {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    dot: 'bg-blue-500',
    border: 'border-slate-200',
  },
  running: {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    dot: 'bg-slate-400 animate-pulse',
    border: 'border-slate-200',
  },
};

const StatusBadge = ({ status, label }) => {
  const v = variants[status] || variants.info;
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-medium uppercase tracking-wider border ${v.bg} ${v.text} ${v.border} group transition-all duration-200`}>
      <span className={`w-1 h-1 rounded-full ${v.dot}`} />
      {displayLabel}
    </span>
  );
};

export default StatusBadge;
