import React from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const TaskRow = ({ task, onToggleStatus }) => {
  const isCompleted = task.status === "Completed";

  return (
    <tr className="border-b border-slate-900/60 hover:bg-[#131B2E]/30 transition-colors duration-100">
      <td className="py-4 px-6">
        <div className="flex flex-col space-y-1">
          <span className={`text-xs font-bold ${isCompleted ? "text-slate-500 line-through" : "text-white"}`}>
            {task.title}
          </span>
          {task.description && (
            <span className="text-[11px] text-slate-400 max-w-sm block truncate">{task.description}</span>
          )}
        </div>
      </td>

      <td className="py-4 px-6">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400">
          <Clock className="h-3.5 w-3.5 text-slate-500" />
          <span>{task.created_at ? new Date(task.created_at).toLocaleDateString() : 'Recent'}</span>
        </div>
      </td>

      <td className="py-4 px-6">
        <span className={`inline-flex items-center space-x-1.5 text-[10px] px-2.5 py-0.5 rounded-md border font-bold ${
          isCompleted 
            ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400" 
            : "bg-amber-500/5 border-amber-500/10 text-amber-400"
        }`}>
          {isCompleted ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
          <span className="uppercase tracking-wider">{task.status}</span>
        </span> {/* FIXED: Successfully matched closing tag with line 24 span element */}
      </td>

      <td className="py-4 px-6 text-right">
        {!isCompleted && (
          <button
            onClick={() => onToggleStatus(task.id)}
            className="text-[10px] font-bold text-emerald-400 bg-emerald-500/5 hover:bg-emerald-600 hover:text-white border border-emerald-500/10 px-2.5 py-1.5 rounded-md transition-all duration-150"
          >
            Mark Complete
          </button>
        )}
      </td>
    </tr>
  );
};

export default TaskRow;