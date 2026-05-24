import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Filter, CheckCircle2, Circle, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Admin Assignment form states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Safely grab current role from context cookie models
  const userString = localStorage.getItem('user');
  const loggedInUser = userString ? JSON.parse(userString) : null;
  const isAdmin = loggedInUser?.role?.name === 'Admin' || loggedInUser?.role?.name === 'Founder';

  const loadSystemTaskLedger = async () => {
    setLoading(true);
    try {
      const response = await api.get('/tasks', {
        params: filterStatus ? { status: filterStatus } : {}
      });
      setTasks(response.data || []);
    } catch (err) {
      console.error("Task subsystem extraction fault:", err);
      setError("Failed to synchronize active task network parameters.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSystemTaskLedger();
  }, [filterStatus]);

  const handleCreateTaskSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !assigneeId.trim()) return;

    setSubmitting(true);
    try {
      await api.post('/tasks', null, {
        params: {
          title: newTitle.trim(),
          description: newDesc.trim(),
          assigned_to_id: parseInt(assigneeId)
        }
      });
      setNewTitle('');
      setNewDesc('');
      setAssigneeId('');
      loadSystemTaskLedger(); 
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to assign task parameters.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTaskStateHandshake = async (taskId, currentStatus) => {
    const targetStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      await api.patch(`/tasks/${taskId}/status`, null, {
        params: { new_status: targetStatus }
      });
      loadSystemTaskLedger();
    } catch (err) {
      console.error("Failed to alter task row matrix execution states:", err);
    }
  };

  return (
    <div className="p-8 space-y-8 text-white min-h-screen max-w-6xl mx-auto">
      
      {/* Structural Header Section */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight flex items-center space-x-2">
            <ClipboardList className="h-5 w-5 text-blue-500" />
            <span>Task Management Controls</span>
          </h1>
          <p className="text-xs text-slate-400">
            {isAdmin ? "Admin Console: Construct requirements and assign worker tracks." : "Operator Workspace: Manage and complete assignments."}
          </p>
        </div>

        {/* Dynamic Filter Row Toggle UI */}
        <div className="flex items-center space-x-2 bg-[#131B2E] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-400">
          <Filter className="h-3.5 w-3.5" />
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent text-white outline-none font-medium pr-2 cursor-pointer"
          >
            <option value="">All Operational Scopes</option>
            <option value="Pending">Pending Status</option>
            <option value="Completed">Completed Status</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: ADMIN ASSIGNMENT PANEL */}
        {isAdmin && (
          <form onSubmit={handleCreateTaskSubmit} className="bg-[#131B2E] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl lg:col-span-1">
            <h2 className="text-sm font-bold tracking-wide flex items-center space-x-2 text-blue-400 uppercase">
              <Plus className="h-4 w-4" />
              <span>Assign New Task</span>
            </h2>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Task Title</label>
              <input required type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Audit Pitch Deck Document Matrix" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
              <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Provide functional expectations..." rows="3" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none resize-none" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operator Target ID</label>
              <input required type="number" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} placeholder="e.g. 2" className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none" />
            </div>

            <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/10 mt-2">
              {submitting ? "Deploying Parameters..." : "Deploy Active Task"}
            </button>
          </form>
        )}

        {/* RIGHT COLUMN: LIVE DATA MATRIX VIEW LIST */}
        <div className={`space-y-4 ${isAdmin ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {loading ? (
            <div className="flex justify-center py-16 text-slate-500 space-x-2 text-xs">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              <span>Synchronizing active task ledger matrices...</span>
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-800 text-center rounded-2xl text-slate-500 text-xs italic">
              No tasks matched current criteria.
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`bg-[#131B2E] border border-slate-800/60 rounded-xl p-5 flex items-start space-x-4 hover:border-slate-700 transition-all shadow-md ${task.status === 'Completed' ? 'opacity-60' : ''}`}
                >
                  <button 
                    type="button" 
                    onClick={() => toggleTaskStateHandshake(task.id, task.status)}
                    className="mt-0.5 shrink-0 text-slate-500 hover:text-blue-400 transition-colors"
                  >
                    {task.status === 'Completed' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-400 animate-in fade-in zoom-in-50 duration-150" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-600 hover:text-slate-400" />
                    )}
                  </button>

                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className={`text-sm font-bold text-white tracking-tight ${task.status === 'Completed' ? 'line-through text-slate-500' : ''}`}>
                      {task.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                      {task.description}
                    </p>
                    <div className="flex items-center space-x-3 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <span>Task Link: #{task.id}</span>
                      <span>•</span>
                      <span>Assigned Node: User ID {task.assigned_to}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TaskManager;