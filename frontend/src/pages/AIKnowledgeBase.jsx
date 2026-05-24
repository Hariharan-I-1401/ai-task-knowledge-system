import React, { useEffect, useState } from 'react';
import { 
  Building2, Globe, Mail, MapPin, Layers, 
  DollarSign, FileText, Download, Loader2, AlertCircle 
} from 'lucide-react';
import api from '../services/api';

const AIKnowledgeBase = () => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/startups')
      .then(res => {
        setStartups(res.data);
      })
      .catch(err => {
        console.error("Pipeline fetch error:", err);
        setError("Failed to retrieve the active venture pipeline from the database.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 space-y-6 text-white max-w-6xl mx-auto min-h-screen animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-blue-500" />
          <span>Venture Pipeline Intake</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Review institutional applications, inspect structural business criteria, and download submitted documents.
        </p>
      </div>

      {error && (
        <div className="text-xs text-red-400 bg-red-500/5 p-4 border border-red-500/10 rounded-xl flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State Wrapper */}
      {loading ? (
        <div className="text-center py-24 space-y-2">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-mono">Querying relational startup schema maps...</p>
        </div>
      ) : startups.length === 0 ? (
        <div className="border border-dashed border-slate-800 p-12 text-center rounded-2xl max-w-md mx-auto mt-12">
          <Building2 className="h-8 w-8 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">Pipeline Empty</h3>
          <p className="text-xs text-slate-500 mt-1">No startup applications have been submitted to the intake ledger yet.</p>
        </div>
      ) : (
        /* 🟢 Startups Interactive Grid System */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {startups.map((startup) => (
            <div 
              key={startup.id} 
              className="bg-[#131B2E] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 space-y-4 transition-all shadow-xl relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Meta Info Row */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">{startup.name}</h3>
                      <a 
                        href={startup.website} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[11px] text-blue-400 hover:underline flex items-center space-x-1 mt-0.5"
                      >
                        <Globe className="h-3 w-3" />
                        <span>{startup.website}</span>
                      </a>
                    </div>
                  </div>

                  {/* Stage Badge Label */}
                  <span className="text-[9px] font-bold tracking-wide uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700/40">
                    {startup.stage}
                  </span>
                </div>

                {/* Information Grid Data Strip */}
                <div className="grid grid-cols-2 gap-2 bg-[#0B0F19]/60 border border-slate-800/50 p-3 rounded-xl text-[11px]">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Layers className="h-3.5 w-3.5 text-slate-500" />
                    <span className="truncate">Sector: <strong className="text-slate-200">{startup.sector}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-400">
                    <MapPin className="h-3.5 w-3.5 text-slate-500" />
                    <span className="truncate">HQ: <strong className="text-slate-200">{startup.location}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-400 col-span-2 border-t border-slate-800/40 pt-1.5 mt-0.5">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Funding Target: <strong className="text-emerald-400">${startup.funding_ask.toLocaleString()} USD</strong></span>
                  </div>
                </div>

                {/* Summaries Blocks */}
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Problem Statement</h4>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 bg-[#0B0F19]/20 p-2 rounded-lg border border-slate-800/30">
                    {startup.problem_statement}
                  </p>
                </div>
              </div>

              {/* Bottom Document Controls Drawer Button Row */}
              <div className="pt-4 border-t border-slate-800/60 mt-4 flex justify-between items-center">
                <div className="flex items-center space-x-1 text-[10px] text-slate-500">
                  <Mail className="h-3 w-3" />
                  <span>{startup.email}</span>
                </div>

                {startup.pitch_deck_path ? (
                  <button 
                    type="button"
                    onClick={() => alert(`Initiating secure local file bridge read for path: ${startup.pitch_deck_path}`)}
                    className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    <span>Pitch Deck PDF</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-600 italic">No File Linked</span>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AIKnowledgeBase;