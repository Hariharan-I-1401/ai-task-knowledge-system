import React from 'react';

const Step1BasicInfo = ({ formData, updateFormData, onNextStep }) => {
  const handleFormSubmissionSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sector || !formData.stage) return;
    onNextStep();
  };

  return (
    <form onSubmit={handleFormSubmissionSubmit} className="space-y-5 max-w-xl mx-auto">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Company Name *</label>
        <input
          required
          type="text"
          value={formData.name || ''}
          onChange={(e) => updateFormData({ name: e.target.value })}
          placeholder="e.g., Apex Logistics AI"
          className="w-full bg-[#131B2E] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-xs font-medium text-white outline-none transition-all duration-150"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Industry Sector *</label>
          <select
            value={formData.sector || 'SaaS'}
            onChange={(e) => updateFormData({ sector: e.target.value })}
            className="w-full bg-[#131B2E] border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-3 text-xs font-medium text-white outline-none transition-all duration-150"
          >
            <option value="SaaS">B2B SaaS</option>
            <option value="Fintech">Fintech</option>
            <option value="AI / ML">Artificial Intelligence</option>
            <option value="Web3">Web3 Infrastructure</option>
            <option value="Healthtech">Healthtech</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Development Stage *</label>
          <select
            value={formData.stage || 'MVP Complete'}
            onChange={(e) => updateFormData({ stage: e.target.value })}
            className="w-full bg-[#131B2E] border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-3 text-xs font-medium text-white outline-none transition-all duration-150"
          >
            <option value="Idea">Idea / Concept</option>
            <option value="MVP Complete">MVP Complete</option>
            <option value="Early Revenue Lifecycle">Early Revenue Lifecycle</option>
            <option value="Growth Stage">Growth Stage / Scale</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Corporate Website</label>
        <input
          type="url"
          value={formData.website || ''}
          onChange={(e) => updateFormData({ website: e.target.value })}
          placeholder="https://example.com"
          className="w-full bg-[#131B2E] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-xs font-medium text-white outline-none transition-all duration-150"
        />
      </div>

      <button
        type="submit"
        disabled={!formData.name}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs py-3.5 rounded-xl transition-all duration-150 shadow-lg shadow-blue-600/10"
      >
        Continue to Business Details
      </button>
    </form>
  );
};

export default Step1BasicInfo;