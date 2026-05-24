import React from 'react';

const Step3Financials = ({ formData, updateFormData, onPreviousStep, isSubmitting }) => {
  return (
    <div className="space-y-5 max-w-xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Current Monthly Revenue (USD) *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">$</span>
            <input
              required
              type="number"
              min="0"
              value={formData.current_revenue ?? ''}
              onChange={(e) => updateFormData({ current_revenue: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              className="w-full bg-[#131B2E] border border-slate-800 focus:border-blue-500 rounded-xl pl-8 pr-4 py-3 text-xs font-medium text-white outline-none transition-all duration-150"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Target Funding Ask (USD) *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">$</span>
            <input
              required
              type="number"
              min="0"
              value={formData.funding_ask ?? ''}
              onChange={(e) => updateFormData({ funding_ask: parseFloat(e.target.value) || 0 })}
              placeholder="500000"
              className="w-full bg-[#131B2E] border border-slate-800 focus:border-blue-500 rounded-xl pl-8 pr-4 py-3 text-xs font-medium text-white outline-none transition-all duration-150"
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onPreviousStep}
          disabled={isSubmitting}
          className="w-1/3 bg-[#131B2E] border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs py-3.5 rounded-xl transition-all duration-150 disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs py-3.5 rounded-xl transition-all duration-150 shadow-lg shadow-emerald-600/10"
        >
          {isSubmitting ? "Finalizing Entry Ledger..." : "Submit Formal Application"}
        </button>
      </div>
    </div>
  );
};

export default Step3Financials;