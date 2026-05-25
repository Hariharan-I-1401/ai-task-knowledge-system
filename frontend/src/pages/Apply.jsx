import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, ChevronLeft, ShieldCheck, Upload, 
  AlertTriangle
} from 'lucide-react';
import api from '../services/api';

const Apply = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 11; 
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const userString = localStorage.getItem('user');
  const loggedInUser = userString ? JSON.parse(userString) : null;
  const isAdmin = loggedInUser?.role?.name === 'Admin' || loggedInUser?.role?.name === 'Founder';

  // Database Verification Logic
  useEffect(() => {
    if (isAdmin) { navigate('/dashboard'); return; }
    if (loggedInUser) {
      api.get(`/startups/my-application`)
        .then(() => navigate('/dashboard'))
        .catch(() => {}); // 404 is expected here if it's a fresh user profile
    }
  }, [isAdmin, navigate, loggedInUser]);

  // Master State Object capturing all 11 required section fields
  const [formData, setFormData] = useState({
    startupName: '', websiteUrl: '', founderNames: '', contactEmail: '', contactNumber: '',
    linkedinFounder: '', linkedinCompany: '', hqLocation: '', incorporationYear: '',
    problemStatement: '', solutionOverview: '', industrySector: 'AI', businessModel: 'B2B', 
    currentStage: 'MVP', coreProductDescription: '', techStack: '', usp: '', ipPatents: '',
    demoLink: '', targetMarket: '', customerSegment: '', keyCompetitors: '', competitiveAdvantage: '',
    currentRevenue: '', growthRate: '', numCustomers: '', keyPartnerships: '', notableAchievements: '',
    fundingRaised: '', currentInvestors: '', burnRate: '', runwayMonths: '', revenueProjections: '',
    amountRaising: '', fundingStageTarget: 'Seed', equityOffered: '', useOfFunds: '',
    founderBackground: '', coreTeamMembers: '', advisorsMentors: '', whyPartnerWithFSV: '',
    fsvValueAdd: '', openToMentorship: 'Yes', pitchDeckName: '', financialModelName: '',
    isCompanyRegistered: 'Yes', hasLegalIssues: 'No', legalIssuesExplanation: '', consentDataSharing: false
  });

  const [pitchDeckFile, setPitchDeckFile] = useState(null);
  const [financialModelFile, setFinancialModelFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    if (fileType === 'pitchDeck' && file.type !== 'application/pdf') {
      alert("Pitch Deck must be a valid PDF document.");
      return;
    }

    if (fileType === 'pitchDeck') {
      setPitchDeckFile(file);
      setFormData(prev => ({ ...prev, pitchDeckName: file.name }));
    } else if (fileType === 'financialModel') {
      setFinancialModelFile(file);
      setFormData(prev => ({ ...prev, financialModelName: file.name }));
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleFormFinalSubmission = async (e) => {
    e.preventDefault();
    if (!formData.consentDataSharing) {
      setError("You must check the compliance block to authorize processing parameters.");
      return;
    }
    if (!pitchDeckFile) {
      setError("Pitch Deck PDF document attachment is strictly mandatory.");
      setCurrentStep(10);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const uploadPayload = new FormData();
      
      // 🟢 FIXED: Keys map character-for-character with your FastAPI Form(...) parameters
      uploadPayload.append("startupName", formData.startupName);
      uploadPayload.append("websiteUrl", formData.websiteUrl);
      uploadPayload.append("founderNames", formData.founderNames);
      uploadPayload.append("contactEmail", formData.contactEmail);
      uploadPayload.append("contactNumber", formData.contactNumber);
      uploadPayload.append("hqLocation", formData.hqLocation);
      uploadPayload.append("problemStatement", formData.problemStatement);
      uploadPayload.append("solutionOverview", formData.solutionOverview);
      uploadPayload.append("industrySector", formData.industrySector);
      uploadPayload.append("businessModel", formData.businessModel);
      uploadPayload.append("currentStage", formData.currentStage);
      uploadPayload.append("amountRaising", formData.amountRaising);
      uploadPayload.append("useOfFunds", formData.useOfFunds);
      
      // Binary file upload mapping parameter
      uploadPayload.append("pitch_deck", pitchDeckFile);

      await api.post('/startups/apply', uploadPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Synchronize caching fallback states seamlessly
      if (loggedInUser && loggedInUser.id) {
        localStorage.setItem(`has_applied_${loggedInUser.id}`, 'true');
      }
      localStorage.setItem('has_applied', 'true');

      setSubmitSuccess(true);
    } catch (err) {
      console.error("Deal ingest pipeline failure:", err);
      setError(err.response?.data?.detail || "System rejected submission properties.");
    } finally {
      setLoading(false);
    }
  };

  const FieldLabel = ({ text, required }) => (
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
      {text} {required && <span className="text-red-500">*</span>}
    </label>
  );

  const renderSection1 = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-base font-bold text-white">Section 1: Basic Information</h2>
        <p className="text-[11px] text-slate-400">Core legal corporate identification data parameters.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1"><FieldLabel text="Startup Name" required /><input required type="text" name="startupName" value={formData.startupName} onChange={handleInputChange} placeholder="Future Transformation Pvt Ltd" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
        <div className="space-y-1"><FieldLabel text="Website URL" required /><input required type="url" name="websiteUrl" value={formData.websiteUrl} onChange={handleInputChange} placeholder="https://..." className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
        <div className="space-y-1"><FieldLabel text="Founder Name(s)" required /><input required type="text" name="founderNames" value={formData.founderNames} onChange={handleInputChange} placeholder="Founder names" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
        <div className="space-y-1"><FieldLabel text="Contact Email" required /><input required type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} placeholder="operator@fsv.capital" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
        <div className="space-y-1"><FieldLabel text="Contact Number" /><input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} placeholder="Phone number" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
        <div className="space-y-1"><FieldLabel text="HQ Location" /><input type="text" name="hqLocation" value={formData.hqLocation} onChange={handleInputChange} placeholder="City, Country" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
        <div className="space-y-1"><FieldLabel text="Founder LinkedIn" /><input type="url" name="linkedinFounder" value={formData.linkedinFounder} onChange={handleInputChange} placeholder="Personal URL" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
        <div className="space-y-1"><FieldLabel text="Year of Incorporation" /><input type="text" name="incorporationYear" value={formData.incorporationYear} onChange={handleInputChange} placeholder="e.g. 2026" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
      </div>
    </div>
  );

  const renderSection2 = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-base font-bold text-white">Section 2: Startup Overview</h2>
        <p className="text-[11px] text-slate-400">Core market positioning architecture definition inputs.</p>
      </div>
      <div className="space-y-3">
        <div className="space-y-1"><FieldLabel text="Problem Statement" required /><textarea required name="problemStatement" value={formData.problemStatement} onChange={handleInputChange} placeholder="What problem are you solving?" rows="2" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2 text-xs text-white outline-none resize-none" /></div>
        <div className="space-y-1"><FieldLabel text="Solution Overview" /><textarea name="solutionOverview" value={formData.solutionOverview} onChange={handleInputChange} placeholder="Describe your product/service" rows="2" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2 text-xs text-white outline-none resize-none" /></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1"><FieldLabel text="Industry Sector" /><select name="industrySector" value={formData.industrySector} onChange={handleInputChange} className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none"><option value="AI">AI</option><option value="Fintech">Fintech</option><option value="Blockchain">Blockchain</option><option value="DeepTech">DeepTech</option><option value="SaaS">SaaS</option></select></div>
          <div className="space-y-1"><FieldLabel text="Business Model" /><select name="businessModel" value={formData.businessModel} onChange={handleInputChange} className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none"><option value="B2B">B2B</option><option value="B2C">B2C</option><option value="B2B2C">B2B2C</option><option value="Marketplace">Marketplace</option></select></div>
          <div className="space-y-1"><FieldLabel text="Current Stage" /><select name="currentStage" value={formData.currentStage} onChange={handleInputChange} className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none"><option value="Idea">Idea</option><option value="MVP">MVP</option><option value="Early Revenue">Early Revenue</option><option value="Growth Stage">Growth Stage</option></select></div>
        </div>
      </div>
    </div>
  );

  const renderSection3 = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-base font-bold text-white">Section 3: Product & Technology</h2>
        <p className="text-[11px] text-slate-400">Engineering architecture validation profiles.</p>
      </div>
      <div className="space-y-3">
        <div className="space-y-1"><FieldLabel text="Core Product Description" /><textarea name="coreProductDescription" value={formData.coreProductDescription} onChange={handleInputChange} placeholder="Detailed product analysis..." rows="2" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2 text-xs text-white outline-none resize-none" /></div>
        <div className="space-y-1"><FieldLabel text="Technology Stack" /><input type="text" name="techStack" value={formData.techStack} onChange={handleInputChange} placeholder="e.g. FastAPI, React, MySQL, FAISS" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
        <div className="space-y-1"><FieldLabel text="Unique Value Proposition (USP)" /><input type="text" name="usp" value={formData.usp} onChange={handleInputChange} placeholder="What makes your tech distinct?" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1"><FieldLabel text="IP / Patents" /><input type="text" name="ipPatents" value={formData.ipPatents} onChange={handleInputChange} placeholder="Patent indicators" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
          <div className="space-y-1"><FieldLabel text="Demo / Video Link" /><input type="url" name="demoLink" value={formData.demoLink} onChange={handleInputChange} placeholder="https://demo.url" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
        </div>
      </div>
    </div>
  );

  const renderSection4 = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-base font-bold text-white">Section 4: Market Opportunity</h2>
        <p className="text-[11px] text-slate-400">TAM, SAM, SOM analysis evaluation sizing profiles.</p>
      </div>
      <div className="space-y-3">
        <div className="space-y-1"><FieldLabel text="Target Market (TAM, SAM, SOM)" /><textarea name="targetMarket" value={formData.targetMarket} onChange={handleInputChange} placeholder="Provide addressable market sizing..." rows="2" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2 text-xs text-white outline-none resize-none" /></div>
        <div className="space-y-1"><FieldLabel text="Customer Segment Target" /><input type="text" name="customerSegment" value={formData.customerSegment} onChange={handleInputChange} placeholder="Ideal customer persona" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1"><FieldLabel text="Key Competitors" /><input type="text" name="keyCompetitors" value={formData.keyCompetitors} onChange={handleInputChange} placeholder="Competitor list" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
          <div className="space-y-1"><FieldLabel text="Competitive Advantage" /><input type="text" name="competitiveAdvantage" value={formData.competitiveAdvantage} onChange={handleInputChange} placeholder="Moat explanation" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
        </div>
      </div>
    </div>
  );

  const renderSection5 = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-base font-bold text-white">Section 5: Traction & Metrics</h2>
        <p className="text-[11px] text-slate-400">Verifiable operational tracking points ledger data.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1"><FieldLabel text="Current Revenue" /><input type="text" name="currentRevenue" value={formData.currentRevenue} onChange={handleInputChange} placeholder="Monthly/Annual" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
        <div className="space-y-1"><FieldLabel text="Growth Rate (%)" /><input type="text" name="growthRate" value={formData.growthRate} onChange={handleInputChange} placeholder="Percentage metric" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
        <div className="space-y-1"><FieldLabel text="Number of Customers" /><input type="text" name="numCustomers" value={formData.numCustomers} onChange={handleInputChange} placeholder="Active base size" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
      </div>
      <div className="space-y-3 pt-2">
        <div className="space-y-1"><FieldLabel text="Key Partnerships" /><input type="text" name="keyPartnerships" value={formData.keyPartnerships} onChange={handleInputChange} placeholder="Alliances / distribution channels" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
        <div className="space-y-1"><FieldLabel text="Notable Achievements" /><textarea name="notableAchievements" value={formData.notableAchievements} onChange={handleInputChange} placeholder="Cohort selections or awards" rows="2" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2 text-xs text-white outline-none resize-none" /></div>
      </div>
    </div>
  );

  const renderSection6 = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-base font-bold text-white">Section 6: Financials</h2>
        <p className="text-[11px] text-slate-400">Capital balance ledger metrics and burn architecture indexes.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1"><FieldLabel text="Funding Raised Till Date" /><input type="text" name="fundingRaised" value={formData.fundingRaised} onChange={handleInputChange} placeholder="USD / INR raised" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
        <div className="space-y-1"><FieldLabel text="Existing Investors" /><input type="text" name="currentInvestors" value={formData.currentInvestors} onChange={handleInputChange} placeholder="Angel or institutional names" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
        <div className="space-y-1"><FieldLabel text="Monthly Burn Rate" /><input type="text" name="burnRate" value={formData.burnRate} onChange={handleInputChange} placeholder="Capital burn rate profile" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
        <div className="space-y-1"><FieldLabel text="Runway (In Months)" /><input type="text" name="runwayMonths" value={formData.runwayMonths} onChange={handleInputChange} placeholder="Months of operations remaining" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
      </div>
      <div className="space-y-1 pt-1"><FieldLabel text="Revenue Projections (Next 3 Years)" /><textarea name="revenueProjections" value={formData.revenueProjections} onChange={handleInputChange} placeholder="Year 1, Year 2, and Year 3 projections data" rows="2" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2 text-xs text-white outline-none resize-none" /></div>
    </div>
  );

  const renderSection7 = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-base font-bold text-white">Section 7: Funding Requirement</h2>
        <p className="text-[11px] text-slate-400">Target raise requirements parameters allocation context.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1"><FieldLabel text="Amount Raising (USD)" required /><input required type="text" name="amountRaising" value={formData.amountRaising} onChange={handleInputChange} placeholder="e.g. $1,500,000" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
        <div className="space-y-1"><FieldLabel text="Funding Stage" /><select name="fundingStageTarget" value={formData.fundingStageTarget} onChange={handleInputChange} className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none"><option value="Pre-Seed">Pre-seed</option><option value="Seed">Seed</option><option value="Series A">Series A</option><option value="Series B">Series B</option></select></div>
        <div className="space-y-1"><FieldLabel text="Equity Offered (%)" /><input type="text" name="equityOffered" value={formData.equityOffered} onChange={handleInputChange} placeholder="e.g. 12%" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
      </div>
      <div className="space-y-1 pt-1"><FieldLabel text="Use of Funds" /><textarea name="useOfFunds" value={formData.useOfFunds} onChange={handleInputChange} placeholder="Product Engineering, Go-To-Market, etc." rows="2" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2 text-xs text-white outline-none resize-none" /></div>
    </div>
  );

  const renderSection8 = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-base font-bold text-white">Section 8: Team</h2>
        <p className="text-[11px] text-slate-400">Human capital foundation assessment profiles.</p>
      </div>
      <div className="space-y-3">
        <div className="space-y-1"><FieldLabel text="Founder Background" /><textarea name="founderBackground" value={formData.founderBackground} onChange={handleInputChange} placeholder="Education, domain expertise, previous tracks..." rows="2" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2 text-xs text-white outline-none resize-none" /></div>
        <div className="space-y-1"><FieldLabel text="Core Team Members" /><input type="text" name="coreTeamMembers" value={formData.coreTeamMembers} onChange={handleInputChange} placeholder="Key operators, engineering headers, sales headers" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
        <div className="space-y-1"><FieldLabel text="Advisors / Mentors" /><input type="text" name="advisorsMentors" value={formData.advisorsMentors} onChange={handleInputChange} placeholder="Active board or advisory nodes" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
      </div>
    </div>
  );

  const renderSection9 = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-base font-bold text-white">Section 9: Strategic Fit with FSV Capital</h2>
        <p className="text-[11px] text-slate-400">Synergy tracking verification matrix data parameters.</p>
      </div>
      <div className="space-y-3">
        <div className="space-y-1"><FieldLabel text="Why do you want to partner with FSV Capital?" /><textarea name="whyPartnerWithFSV" value={formData.whyPartnerWithFSV} onChange={handleInputChange} placeholder="Ecosystem alignment indicators" rows="2" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2 text-xs text-white outline-none resize-none" /></div>
        <div className="space-y-1"><FieldLabel text="How can FSV Capital add value beyond funding?" /><input type="text" name="fsvValueAdd" value={formData.fsvValueAdd} onChange={handleInputChange} placeholder="Network clearances, infrastructure scale support" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" /></div>
        <div className="space-y-1">
          <FieldLabel text="Are you open to mentorship / cohort programs?" />
          <select name="openToMentorship" value={formData.openToMentorship} onChange={handleInputChange} className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none"><option value="Yes">Yes</option><option value="No">No</option></select>
        </div>
      </div>
    </div>
  );

  const renderSection10 = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-base font-bold text-white">Section 10: Documents Upload</h2>
        <p className="text-[11px] text-slate-400">Mandatory investment deck data dropzone parameters.</p>
      </div>
      <div className="space-y-4">
        <div className="border border-dashed border-slate-800 bg-[#0B0F19] rounded-2xl p-5 text-center space-y-2">
          <Upload className="h-6 w-6 text-blue-500 mx-auto" />
          <h3 className="text-xs font-bold text-white">Pitch Deck (PDF Mandatory <span className="text-red-500">*</span>)</h3>
          <p className="text-[10px] text-slate-500">Enterprise evaluation deck limits max 25MB.</p>
          <input type="file" id="pitchDeckInput" onChange={(e) => handleFileChange(e, 'pitchDeck')} className="hidden" accept=".pdf" />
          <button type="button" onClick={() => document.getElementById('pitchDeckInput').click()} className="text-[10px] bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-white font-medium transition-colors">
            {formData.pitchDeckName ? `Selected: ${formData.pitchDeckName}` : "Choose File"}
          </button>
        </div>

        <div className="border border-dashed border-slate-800 bg-[#0B0F19] rounded-2xl p-5 text-center space-y-2">
          <Upload className="h-6 w-6 text-slate-500 mx-auto" />
          <h3 className="text-xs font-bold text-slate-400">Financial Model (Optional)</h3>
          <p className="text-[10px] text-slate-500">Excel tables sheet or tracking spreadsheet</p>
          <input type="file" id="financialModelInput" onChange={(e) => handleFileChange(e, 'financialModel')} className="hidden" accept=".xlsx,.xls,.pdf" />
          <button type="button" onClick={() => document.getElementById('financialModelInput').click()} className="text-[10px] bg-slate-800/50 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-400 font-medium transition-colors">
            {formData.financialModelName ? `Selected: ${formData.financialModelName}` : "Choose File"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderSection11 = () => (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-base font-bold text-white">Section 11: Compliance & Declaration</h2>
        <p className="text-[11px] text-slate-400">Final background validation declarations check parameters.</p>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <FieldLabel text="Company Registered?" />
            <select name="isCompanyRegistered" value={formData.isCompanyRegistered} onChange={handleInputChange} className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none"><option value="Yes">Yes</option><option value="No">No</option></select>
          </div>
          <div className="space-y-1">
            <FieldLabel text="Any Active Legal Issues?" />
            <select name="hasLegalIssues" value={formData.hasLegalIssues} onChange={handleInputChange} className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none"><option value="Yes">Yes</option><option value="No">No</option></select>
          </div>
        </div>
        {formData.hasLegalIssues === 'Yes' && (
          <div className="space-y-1"><FieldLabel text="Legal Issues Explanation" required /><textarea name="legalIssuesExplanation" value={formData.legalIssuesExplanation} onChange={handleInputChange} placeholder="Provide details on active disputes..." rows="2" className="w-full bg-[#0B0F19] border border-red-900/40 focus:border-red-500 rounded-xl px-4 py-2 text-xs text-white outline-none resize-none" /></div>
        )}

        <div className="bg-[#0B0F19] border border-slate-800 p-4 rounded-xl flex items-start space-x-3 mt-4">
          <input required type="checkbox" name="consentDataSharing" checked={formData.consentDataSharing} onChange={handleInputChange} id="consentCheck" className="mt-1 h-3.5 w-3.5 accent-blue-600 rounded bg-[#0B0F19] border-slate-800" />
          <label htmlFor="consentCheck" className="text-[11px] text-slate-400 leading-relaxed select-none">
            I hereby certify all submitted indicators to be accurate and provide absolute consent to share internal data elements with FSV Capital investment partners. <span className="text-red-500">*</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6 text-white min-h-screen">
      {submitSuccess ? (
        <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-8 text-center space-y-4 my-12 animate-in zoom-in-95 duration-200">
          <div className="h-12 w-12 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">Application Transmitted Successfully</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Your venture profile has integrated with the FSV deal pipeline. Redirecting to your workspace dashboard shortly...
          </p>
          <button type="button" onClick={() => navigate('/dashboard')} className="mt-4 bg-blue-600 hover:bg-blue-500 px-5 py-2 text-xs font-bold rounded-xl transition-colors">
            Go to Dashboard Now
          </button>
        </div>
      ) : (
        <form onSubmit={handleFormFinalSubmission} className="bg-[#131B2E] border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
          <div className="mb-6">
            <h1 className="text-lg font-bold text-white tracking-tight">Capital Startup Funding Application</h1>
            <p className="text-[11px] text-blue-400 tracking-wider font-semibold uppercase mt-0.5">"Fueling DeepTech, Fintech & Future Innovation"</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              <span>Section {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% Metrics Completed</span>
            </div>
            <div className="w-full bg-[#0B0F19] h-1 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-1 rounded-full transition-all duration-300 ease-out" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
            </div>
          </div>

          {error && (
            <div className="mb-4 text-[11px] text-red-400 bg-red-500/5 p-3 border border-red-500/10 rounded-xl flex items-center space-x-2">
              <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
              <span className="break-all">{error}</span>
            </div>
          )}

          <div className="min-h-72.5">
            {currentStep === 1 && renderSection1()}
            {currentStep === 2 && renderSection2()}
            {currentStep === 3 && renderSection3()}
            {currentStep === 4 && renderSection4()}
            {currentStep === 5 && renderSection5()}
            {currentStep === 6 && renderSection6()}
            {currentStep === 7 && renderSection7()}
            {currentStep === 8 && renderSection8()}
            {currentStep === 9 && renderSection9()}
            {currentStep === 10 && renderSection10()}
            {currentStep === 11 && renderSection11()}
          </div>

          <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-800/60">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1 || loading}
              className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-white disabled:opacity-20 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
            
            {currentStep === totalSteps ? (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/5"
              >
                <span>{loading ? "Transmitting Packet..." : "Submit File"}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/5"
              >
                <span>Save & Continue</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default Apply;