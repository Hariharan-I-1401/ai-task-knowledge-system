import React from 'react';
import { Check } from 'lucide-react';

const ProgressIndicator = ({ currentStep = 1, totalSteps = 3, stepsConfig = [] }) => {
  // Fallback step titles if none are passed via props
  const defaultSteps = ["Company Details", "Financial Traction", "Review Submit"];
  const steps = stepsConfig.length > 0 ? stepsConfig : defaultSteps;

  return (
    <div className="w-full py-4 px-2 max-w-3xl mx-auto">
      <div className="flex items-center justify-between relative">
        
        {/* Dynamic Background Progress Connnecting Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-800 z-0" />
        
        {/* Active Filled Colored Line Layer */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-blue-500 transition-all duration-300 ease-in-out z-0" 
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {/* Step Nodes Map */}
        {steps.map((stepTitle, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;

          return (
            <div key={index} className="flex flex-col items-center relative z-10">
              {/* Outer Ring Node Container */}
              <div 
                className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs border transition-all duration-200 ${
                  isCompleted 
                    ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20" 
                    : isActive
                      ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/20 ring-4 ring-blue-500/10"
                      : "bg-[#131B2E] border-slate-800 text-slate-400"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 stroke-3" />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>

              {/* Absolute Text Label Wrapper */}
              <span 
                className={`absolute top-11 text-[11px] font-semibold whitespace-nowrap tracking-wide uppercase transition-colors duration-150 ${
                  isActive ? "text-blue-400 font-bold" : isCompleted ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {stepTitle}
              </span>
            </div>
          );
        })}

      </div>
      {/* Structural bottom spacer box to give absolute labels room to layout safely */}
      <div className="h-6" />
    </div>
  );
};

export default ProgressIndicator;