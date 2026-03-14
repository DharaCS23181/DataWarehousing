import React from 'react';

const StatCard = ({ icon, label, value, trend, trendUp, color = 'slate' }) => {
  const isPurple = color === 'purple';
  
  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-200 shadow-sm ${
        isPurple ? 'bg-violet-50/30 border-violet-100 hover:border-violet-200' : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-slate-800 tracking-tight">{value}</p>
            {trend && (
              <span className={`text-[10px] font-bold ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trendUp ? '↑' : '↓'} {trend}
              </span>
            )}
          </div>
        </div>
        <div className={`p-2 rounded-xl border ${
          isPurple ? 'bg-violet-100 text-violet-600 border-violet-200' : 'bg-slate-50 text-slate-400 border-slate-100'
        }`}>
          {React.cloneElement(icon, { size: 18, strokeWidth: 2.5 })}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
