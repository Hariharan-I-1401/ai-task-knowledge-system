import React from 'react';

const Step2Overview = ({ formData, updateFormData, onNextStep, onPreviousStep }) => {
  const handleSubmission = (e) => {
    e.preventDefault();
    if (!formData.solution_overview || formData.solution_overview.length < 20) return;
    onNextStep();
  };

  return (
    <form onSubmit={handleSubmission} className="space-y-5 max-w-xl mx-auto">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Value Proposition & Solution Overview *
        </label>
        <textarea
          required
          rows={6}
          value={formData.solution_overview || ''}
          onChange={(e) => updateFormData({ solution_overview: e.target.value })}
          placeholder="Describe your core product architecture, targeted pain point, and unique advantages clearly. This contextual profile will fuel our AI semantic indexing matching models..."
          className="w-full bg-[#131B2E] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-xs font-medium text-white outline-none transition-all duration-150 resize-none leading-relaxed"
        />
        <div className="text-[11px] text-slate-500 text-right font-medium">
          Minimum 20 characters required. Current: {(formData.solution_overview || '').length}
        </div>
      </div>

      <div className="flex space-x-3 pt-2">
        <button
          type="button"
          onClick={onPreviousStep}
          className="w-1/3 bg-[#131B2E] border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs py-3.5 rounded-xl transition-all duration-150"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={(formData.solution_overview || '').length < 20}
          className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs py-3.5 rounded-xl transition-all duration-150 shadow-lg shadow-blue-600/10"
        >
          Continue to Financial Metrics
        </button>
      </div>
    </form>
  );
};

export default Step2Overview;