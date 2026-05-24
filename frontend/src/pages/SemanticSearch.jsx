import React, { useState } from 'react';
import { Search, Loader2, Sparkles, Building2, Globe, Target, ArrowRight } from 'lucide-react';
import api from '../services/api';

const SemanticSearch = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      // 🟢 Matches up with your registered backend search route structure
      const response = await api.post('/search', { query_text: query });
      
      // Assume response.data returns an array of matched startups with similarity scores
      if (Array.isArray(response.data)) {
        setResults(response.data);
      } else if (response.data.results) {
        setResults(response.data.results);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Vector search anomaly:", err);
      setError(err.response?.data?.detail || "The AI embedding node failed to calculate tensor distances.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 text-white max-w-5xl mx-auto min-h-screen animate-in fade-in duration-300">
      
      {/* Search Layout Headers */}
      <div className="space-y-2 max-w-3xl">
        <div className="flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full w-fit">
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">AI Cognitive Layer Active</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">AI-Powered Semantic Search</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          Query your venture pipeline using abstract concepts, sector thematic variations, or problem domains instead of simple keyword queries. The framework computes vector weights using spatial algorithms.
        </p>
      </div>

      {/* 🟢 Search Input Box Container Form */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-3xl">
        <div className="flex items-center bg-[#131B2E] border border-slate-800 focus-within:border-blue-500 rounded-2xl p-2 transition-all shadow-xl">
          <Search className="h-4 w-4 text-slate-500 ml-3 shrink-0" />
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Cross-border asset settlements using cryptographic ledgers or compliance mapping automation tools..."
            className="w-full bg-transparent px-3 py-2.5 text-xs text-white outline-none placeholder-slate-500"
            disabled={loading}
          />
          <button 
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center space-x-1.5 shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Analyzing Vector...</span>
              </>
            ) : (
              <span>Analyze Intent</span>
            )}
          </button>
        </div>
      </form>

      {/* Error Messaging Output Panel */}
      {error && (
        <p className="text-xs text-red-400 font-medium bg-red-500/5 border border-red-500/10 p-3 rounded-xl max-w-3xl">
          {error}
        </p>
      )}

      {/* 🟢 Semantic Mapping Vector Results Grid View Area */}
      <div className="space-y-4 max-w-3xl">
        {loading && (
          <div className="text-center py-12 space-y-2">
            <Loader2 className="h-6 w-6 text-blue-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-mono">Projecting search string to 384-float coordinates...</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Semantic Deal Matches</h2>
            <div className="grid grid-cols-1 gap-3">
              {results.map((deal, idx) => (
                <div 
                  key={deal.id || idx} 
                  className="bg-[#131B2E] border border-slate-800 hover:border-slate-700 p-5 rounded-xl space-y-3 transition-all relative group"
                >
                  {/* Dynamic Match Score Tag badge if returned by your model service */}
                  {deal.score !== undefined && (
                    <div className="absolute top-5 right-5 text-[10px] font-mono font-bold bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md text-purple-400">
                      Match Confidence: {(deal.score * 100).toFixed(1)}%
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{deal.name || "Unnamed Venture"}</h3>
                      <div className="flex items-center space-x-3 text-[10px] text-slate-400 mt-0.5 font-medium">
                        <span className="flex items-center space-x-1"><Globe className="h-3 w-3" /> <span>{deal.website || "N/A"}</span></span>
                        <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded uppercase text-[9px] tracking-wide font-bold">{deal.sector || "AI"}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pl-1">
                    <span className="text-slate-500 font-semibold uppercase tracking-wide text-[9px] block mb-0.5">Abstract Concept Problem Statement:</span>
                    {deal.problem_statement || "No problem parameters logged."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && results.length === 0 && query && (
          <div className="border border-dashed border-slate-800 p-8 text-center rounded-2xl">
            <Target className="h-6 w-6 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No startup context models exist inside this coordinate neighborhood block.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default SemanticSearch;