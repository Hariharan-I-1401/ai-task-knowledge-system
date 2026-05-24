import React, { useState, useEffect } from 'react';
import { startupService } from '../services/startupService';
import DealRow from '../components/Dashboard/DealRow';
import { Layers } from 'lucide-react';

const AIKnowledgeBase = () => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const data = await startupService.getPipelineStartups();
        setStartups(data);
      } catch (err) {
        console.error("Failed loading deal flow pipeline records:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStartups();
  }, []);

  const handleAssignWorkflowItem = (startup) => {
    alert(`Assigning structural vetting task protocol guidelines for: ${startup.name}`);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-8 space-y-6">
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-blue-400">
          <Layers className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Deal Flow Ledger</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Global Venture Pipeline</h1>
      </div>

      <div className="bg-[#131B2E] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0B0F19] border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-4 px-6">Venture Account Portfolio Name</th>
              <th className="py-4 px-6">Industry Sector</th>
              <th className="py-4 px-6">Lifecycle Stage</th>
              <th className="py-4 px-6">Target Ask</th>
              <th className="py-4 px-6">Traction Scaling</th>
              <th className="py-4 px-6">AI Index Score</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {startups.map(item => (
              <DealRow key={item.id} startup={item} onAssignTask={handleAssignWorkflowItem} />
            ))}
          </tbody>
        </table>
        {!loading && startups.length === 0 && (
          <div className="text-xs text-slate-500 text-center py-12">No active application profiles currently recorded in database.</div>
        )}
      </div>
    </div>
  );
};

export default AIKnowledgeBase;