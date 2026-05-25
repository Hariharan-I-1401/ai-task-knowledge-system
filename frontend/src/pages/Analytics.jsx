import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, Database, ShieldCheck, Activity, 
  Cpu, HardDrive, RefreshCw, Server, FileDown // 🟢 Added FileDown icon
} from 'lucide-react';
import api from '../services/api';

const Analytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false); // 🟢 Added export loading state
  
  const [stats, setStats] = useState({
    total_startups: 0,
    total_tasks: 0,
    task_completion_rate: 0,
    total_users: 0,
    sector_distribution: {} 
  });

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const isAdmin = user?.role?.name === 'Admin' || user?.role?.name === 'Founder';

  const fetchTelemetry = useCallback(() => {
    if (!isAdmin) return;
    setLoading(true);
    api.get('/admin/stats')
      .then(res => {
        if (!res.data.error) setStats(prev => ({ ...prev, ...res.data }));
      })
      .catch(err => console.error("Telemetry fetch failure:", err))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  // 🟢 Function to handle Excel Export
  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await api.get('/analytics/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'FSV_Startup_Pipeline.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failure:", err);
      alert("Failed to export data.");
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }

    setLoading(true);
    api.get('/admin/stats')
      .then(res => {
        if (!res.data.error) setStats(prev => ({ ...prev, ...res.data }));
      })
      .catch(err => console.error("Initial load failure:", err))
      .finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return (
    <div className="p-8 space-y-6 text-white max-w-6xl mx-auto min-h-screen animate-in fade-in duration-300">
      
      {/* Analytics Main Header */}
      <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-indigo-500" />
            <span>Advanced System Telemetry</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Deep-dive vector indexing audit pools and machine learning infrastructure clusters.
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={fetchTelemetry} 
            disabled={loading}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-700/60 transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? "Syncing..." : "Force Sync"}</span>
          </button>

          {/* 🟢 Export Excel Button */}
          <button 
            onClick={handleExport} 
            disabled={exporting}
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-colors disabled:opacity-40"
          >
            <FileDown className={`h-3.5 w-3.5 ${exporting ? 'animate-spin' : ''}`} />
            <span>{exporting ? "Exporting..." : "Export Excel"}</span>
          </button>
        </div>
      </div>

      {/* Row 1: Hardware Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#131B2E] border border-slate-800/80 rounded-xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Cpu className="h-3.5 w-3.5 text-indigo-400" />
              <span>Embedding Model Load</span>
            </span>
            <span className="text-xs text-indigo-400 font-mono font-bold">14.2%</span>
          </div>
          <div className="w-full bg-[#0B0F19] h-2 rounded-full overflow-hidden border border-slate-900">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: '14.2%' }} />
          </div>
          <p className="text-[10px] text-slate-500 font-mono">Framework: sentence-transformers/all-MiniLM-L6-v2</p>
        </div>

        <div className="bg-[#131B2E] border border-slate-800/80 rounded-xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <HardDrive className="h-3.5 w-3.5 text-purple-400" />
              <span>FAISS Index Memory RAM</span>
            </span>
            <span className="text-xs text-purple-400 font-mono font-bold">32.8 MB</span>
          </div>
          <div className="w-full bg-[#0B0F19] h-2 rounded-full overflow-hidden border border-slate-900">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: '8.5%' }} />
          </div>
          <p className="text-[10px] text-slate-500 font-mono">Index Architecture: FlatL2 Vector Clustering</p>
        </div>

        <div className="bg-[#131B2E] border border-slate-800/80 rounded-xl p-5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
              <span>API Gateway Latency</span>
            </span>
            <span className="text-xs text-emerald-400 font-mono font-bold">42 ms</span>
          </div>
          <div className="w-full bg-[#0B0F19] h-2 rounded-full overflow-hidden border border-slate-900">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '12%' }} />
          </div>
          <p className="text-[10px] text-slate-500 font-mono">HTTP Engine: FastAPI Node Pool / Uvicorn</p>
        </div>
      </div>

      {/* Row 2: Charts and Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Server className="h-4 w-4 text-indigo-500" />
            <span>Sector Weights Density</span>
          </h3>
          <div className="space-y-4 pt-2">
            {Object.keys(stats.sector_distribution || {}).length === 0 ? (
              <p className="text-xs text-slate-500 italic">No incoming startup vector models matched yet.</p>
            ) : (
              Object.entries(stats.sector_distribution || {}).map(([sector, count]) => {
                const percentage = stats.total_startups > 0 ? (count / stats.total_startups) * 100 : 0;
                return (
                  <div key={sector} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-200 font-semibold">{sector} Cluster</span>
                      <span className="text-indigo-400 font-mono">{percentage.toFixed(1)}% ({count})</span>
                    </div>
                    <div className="w-full bg-[#0B0F19] h-2 rounded-full overflow-hidden border border-slate-900">
                      <div className="bg-linear-to-r from-blue-500 to-indigo-500 h-full rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-6 lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Database className="h-4 w-4 text-purple-500" />
            <span>AI Cluster Pipeline Ingestion Stream Terminal</span>
          </h3>
          <div className="bg-[#0B0F19] border border-slate-800 p-4 rounded-xl space-y-2 font-mono text-[11px] text-slate-500 h-48 overflow-y-auto">
            <p className="text-emerald-400">&gt;&gt; Total operational tokens: {stats.total_startups || 0}</p>
            <p className="text-slate-400">&gt;&gt; Tasks allocated: {stats.total_tasks || 0} tasks</p>
            <p className="text-indigo-400">&gt;&gt; Network completion density: {stats.task_completion_rate || 0}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;