import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressIndicator from '../components/Common/ProgressIndicator';
import Step1BasicInfo from '../components/FounderForm/Step1BasicInfo';
import Step2Overview from '../components/FounderForm/Step2Overview';
import Step3Financials from '../components/FounderForm/Step3Financials';
import FileUploadZone from '../components/FounderForm/FileUploadZone';
import { startupService } from '../services/startupService';

const FormContainer = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    sector: 'SaaS',
    stage: 'MVP Complete',
    website: '',
    solution_overview: '',
    current_revenue: 0,
    funding_ask: 0
  });

  const updateFormData = (fields) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const handleNextStep = () => setCurrentStep(prev => prev + 1);
  const handlePreviousStep = () => setCurrentStep(prev => prev - 1);

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Dispatch corporate metrics packet straight down to startup database service
      await startupService.submitApplication(formData);
      navigate('/dashboard'); // Reroute back to master pipeline view upon compilation
    } catch (err) {
      console.error("Submission operational error:", err);
      setError('Form entry validation failure. Verify system connection settings.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-[#0B0F19] border border-slate-900 rounded-3xl p-8 space-y-8 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Venture Intake Application</h1>
          <p className="text-xs text-slate-400">Complete the operational tracking logs to profile your seed round.</p>
        </div>

        <ProgressIndicator currentStep={currentStep} totalSteps={3} />

        {error && (
          <div className="text-xs text-red-400 bg-red-500/5 p-3 rounded-xl border border-red-500/10 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleFinalSubmit}>
          {currentStep === 1 && (
            <Step1BasicInfo formData={formData} updateFormData={updateFormData} onNextStep={handleNextStep} />
          )}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Step2Overview formData={formData} updateFormData={updateFormData} onNextStep={handleNextStep} onPreviousStep={handlePreviousStep} />
              <div className="border-t border-slate-900/60 pt-4">
                <FileUploadZone onFileSelected={setFile} selectedFile={file} />
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <Step3Financials formData={formData} updateFormData={updateFormData} onPreviousStep={handlePreviousStep} isSubmitting={isSubmitting} />
          )}
        </form>
      </div>
    </div>
  );
};

export default FormContainer;