import React from 'react';

const AnalyticsCard = ({ title, value, icon: Icon, description, trendColor = "text-blue-500" }) => {
  return (
    <div className="bg-[#131B2E] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 hover:border-slate-700/70 transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl bg-[#0B0F19] border border-slate-800 ${trendColor}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-3xl font-bold text-white tracking-tight">
          {value}
        </h3>
        {description && (
          <p className="text-xs text-slate-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCard;