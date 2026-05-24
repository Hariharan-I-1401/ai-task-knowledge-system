import React from 'react';
import { Building2, PlusCircle, ArrowUpRight } from 'lucide-react';

const DealRow = ({ startup, onAssignTask }) => {
  // Generate a mock metric calculation score if backend isn't feeding a live one down yet
  const displayScore = startup.deal_score || 72.5;

  return (
    <tr className="border-b border-slate-900/60 hover:bg-[#131B2E]/30 transition-colors duration-100 group">
      <td className="py-4 px-6">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-[#0B0F19] border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white tracking-wide">{startup.name}</span>
            {startup.website && (
              <a href={startup.website} target="_blank" rel="noreferrer" className="text-[10px] text-slate-500 hover:text-blue-400 flex items-center space-x-0.5 mt-0.5">
                <span>Visit URL</span>
                <ArrowUpRight className="h-2.5 w-2.5" />
              </a>
            )}
          </div>
        </div>
      </td>
      
      <td className="py-4 px-6">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#0B0F19] border border-slate-800 text-slate-300">
          {startup.sector}
        </span>
      </td>

      <td className="py-4 px-6 text-xs text-slate-400 font-medium">
        {startup.stage}
      </td>

      <td className="py-4 px-6 font-bold text-xs text-white">
        ${startup.funding_ask?.toLocaleString() ?? '0'}
      </td>

      <td className="py-4 px-6">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-emerald-400">${startup.current_revenue?.toLocaleString() ?? '0'}</span>
          <span className="text-[9px] text-slate-500 font-semibold tracking-wide uppercase mt-0.5">Monthly</span>
        </div>
      </td>

      <td className="py-4 px-6">
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
          displayScore >= 75 ? "text-emerald-400 bg-emerald-500/5" : "text-amber-400 bg-amber-500/5"
        }`}>
          {displayScore}
        </span>
      </td>

      <td className="py-4 px-6 text-right">
        <button
          onClick={() => onAssignTask(startup)}
          className="text-[11px] font-bold text-slate-400 hover:text-white bg-[#0B0F19] hover:bg-blue-600 border border-slate-800 hover:border-blue-500 px-3 py-1.5 rounded-lg transition-all duration-150 inline-flex items-center space-x-1.5"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Queue Task</span>
        </button>
      </td>
    </tr>
  );
};

export default DealRow;