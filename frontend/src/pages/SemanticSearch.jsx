import React, { useState } from 'react';
import { Search, Sparkles, Globe, Target, CircleDollarSign, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';

const SemanticSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!query.strip || !query.trim()) return;

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      // Hits your live router endpoint: GET /api/search?query=...
      const response = await api.get(`/search`, {
        params: { query: query.trim() }
      });
      setResults(response.data || []);
    } catch (err) {
      console.error("AI Vector Search subsystem fault:", err);
      setError(err.response?.data?.detail || "Failed to execute semantic distance lookup query.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 text-white min-h-screen max-w-6xl mx-auto">
      
      {/* Search Header Banner */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-blue-400">
          <Sparkles className="h-5 w-5 text-blue-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
            AI Cognitive Layer Active
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">AI-Powered Semantic Search</h1>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Query the venture pipeline using abstract concepts or problem domains instead of simple keywords. The embedding matrix computes vector weights to retrieve contextually matched deals instantly .
        </p>
      </div>

      {/* Input Formulation Bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-3xl">
        <div className="relative flex items-center bg-[#131B2E] border border-slate-800 focus-within:border-blue-500 rounded-2xl p-2 transition-all shadow-xl">
          <Search className="h-5 w-5 text-slate-500 ml-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Blockchain-based payment rails for healthcare infrastructure segments..."
            className="w-full bg-transparent px-3 py-3 text-xs text-white outline-none placeholder-slate-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center space-x-2 shrink-0 shadow-lg shadow-blue-600/10"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Computing Tensors...</span>
              </>
            ) : (
              <span>Analyze Intent</span>
            )}
          </button>
        </div>
      </form>

      {/* Error Bound Warning */}
      {error && (
        <div className="text-xs text-red-400 bg-red-500/5 p-4 rounded-xl border border-red-500/10 max-w-3xl flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Results Matrix Grid View */}
      <div className="space-y-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-3 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-xs italic">Transforming text string into vector representations and querying index layers... [cite: 163-165]</p>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-16 border border-slate-800/50 bg-[#131B2E]/30 rounded-2xl max-w-3xl">
            <p className="text-xs text-slate-500 italic">No deals or companies matched the semantic weight parameters of this query.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 gap-4 max-w-4xl">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Top Semantic Pipeline Alignments
            </h3>
            
            {results.map((startup) => (
              <div 
                key={startup.id} 
                className="bg-[#131B2E] border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition-all space-y-4 shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200"
              >
                {/* Meta Row Headers */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h2 className="text-base font-bold text-white tracking-tight">{startup.name}</h2>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                      <span className="bg-slate-800 px-2.5 py-0.5 rounded-md font-medium border border-slate-700/50 text-blue-400">
                        {startup.sector}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="font-medium text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded">
                        {startup.stage}
                      </span>
                    </div>
                  </div>

                  {startup.website && (
                    <a 
                      href={startup.website.startsWith('http') ? startup.website : `https://${startup.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-white p-2 bg-[#0B0F19] rounded-xl border border-slate-800 transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                </div>

                {/* Conceptual Business Summary View */}
                <p className="text-xs text-slate-400 leading-relaxed bg-[#0B0F19]/50 border border-slate-900/60 p-3.5 rounded-xl">
                  {startup.solution_overview}
                </p>

                {/* Financial Health Indicators Row Metrics */}
                <div className="grid grid-cols-2 gap-4 pt-1 max-w-md">
                  <div className="flex items-center space-x-2 text-xs">
                    <Target className="h-4 w-4 text-slate-500 shrink-0" />
                    <span className="text-slate-500">Target Funding Ask:</span>
                    <span className="font-bold text-slate-200">{startup.funding_ask || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <CircleDollarSign className="h-4 w-4 text-slate-500 shrink-0" />
                    <span className="text-slate-500">Current ARR/MRR:</span>
                    <span className="font-bold text-slate-200">{startup.current_revenue || 'N/A'}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default SemanticSearch;