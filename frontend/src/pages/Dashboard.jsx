import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, CheckCircle, BarChart3, 
  Database, Landmark, Layers, TrendingUp 
} from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Admin stats state
  const [stats, setStats] = useState({
    total_startups: 0,
    total_tasks: 0,
    task_completion_rate: 0,
    total_users: 0,
    sector_distribution: {}
  });

  // Dedicated state to safely hold a user's individual submitted application
  const [myApplication, setMyApplication] = useState(null);
  
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const isAdmin = user?.role?.name === 'Admin' || user?.role?.name === 'Founder';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      // Safely ask the backend for "my" application using the auth token
      api.get(`/startups/my-application`)
        .then(res => {
          // Success! The database found the application. Populate the dashboard cards.
          setMyApplication(res.data);
          // 🟢 FIXED: Use user.id safely to set the cache flag
          localStorage.setItem(`has_applied_${user.id}`, 'true');
        })
        .catch(err => {
          // If the database returns 404 Not Found, they truly haven't applied!
          if (err.response && err.response.status === 404) {
            navigate('/apply');
          } else {
            console.error("Error pulling application review snapshot:", err);
          }
        });

    } else {
      // Admin dashboard analytics pulling logic
      api.get('/admin/stats')
        .then(res => {
          if (!res.data.error) {
            setStats(res.data);
          }
        })
        .catch(err => console.error("Metrics engine polling error:", err));
    }
  }, [user, isAdmin, navigate]); 

  return (
    <div className="p-8 space-y-6 text-white max-w-6xl mx-auto min-h-screen">
      
      {/* Structural Header block area */}
      <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
            <LayoutDashboard className="h-6 w-6 text-blue-500" />
            <span>{isAdmin ? "Admin Analytics Control Center" : "Founder Workspace"}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Welcome back, {user?.name || user?.email || "Operator"}.
          </p>
        </div>
        
        {isAdmin && (
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl self-start md:self-auto">
            <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">Data Sync Live</span>
          </div>
        )}
      </div>

      {/* RENDER MODE A: STANDARD USER INTERCEPT VIEW */}
      {!isAdmin ? (
        <div className="space-y-6 max-w-2xl mx-auto mt-6 animate-in fade-in duration-300">
          
          {/* Main review notification status card */}
          <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-6 text-center space-y-3 shadow-xl">
            <CheckCircle className="h-8 w-8 text-green-400 mx-auto" />
            <h2 className="text-base font-bold text-white">Application Under Review</h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
              Your startup application has been successfully submitted and is currently being vectorized and analyzed by the FSV pipeline. Please monitor your workspace for pipeline updates.
            </p>
          </div>

          {/* Immutable Review Panel mapping data directly from startups.py */}
          <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white tracking-tight">Your Submitted Venture Profile</h3>
              <p className="text-[11px] text-slate-500">Structured ledger snapshot of your active registration fields.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="bg-[#0B0F19] border border-slate-800/60 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Company Name</span>
                <p className="text-xs font-semibold text-slate-200">{myApplication?.name || "Loading parameters..."}</p>
              </div>

              <div className="bg-[#0B0F19] border border-slate-800/60 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Target Sector Cluster</span>
                <p className="text-xs font-semibold text-blue-400">{myApplication?.sector || "Loading parameters..."}</p>
              </div>

              <div className="bg-[#0B0F19] border border-slate-800/60 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Capital Ask Amount</span>
                {/* 🟢 FIXED: Checks if data loaded, allowing $0 to render perfectly */}
                <p className="text-xs font-bold text-emerald-400">
                  {myApplication ? `$${myApplication.funding_ask.toLocaleString()} USD` : "Loading parameters..."}
                </p>
              </div>

              <div className="bg-[#0B0F19] border border-slate-800/60 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Operational Stage</span>
                <p className="text-xs font-semibold text-purple-400">{myApplication?.stage || "Loading parameters..."}</p>
              </div>
            </div>

            {/* Document link validation line tracker */}
            <div className="bg-[#0B0F19] border border-slate-800/60 p-4 rounded-xl flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Primary Secure Asset</span>
                <p className="text-xs font-mono text-slate-300">{myApplication?.pitch_deck || "Processing stream..."}</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Vaulted Secure</span>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* RENDER MODE B: ADMIN EXECUTIVE TELEMETRY BLOCKS */
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Dashboard Summary Statistics Cards Row Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-[#131B2E] border border-slate-800 rounded-xl p-5 flex items-center space-x-4">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20"><Layers className="h-5 w-5 text-blue-400" /></div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Startups</p>
                <h3 className="text-xl font-bold mt-0.5">{stats.total_startups || 0}</h3>
              </div>
            </div>

            <div className="bg-[#131B2E] border border-slate-800 rounded-xl p-5 flex items-center space-x-4">
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20"><Landmark className="h-5 w-5 text-amber-400" /></div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Tasks</p>
                <h3 className="text-xl font-bold mt-0.5">{stats.total_tasks || 0}</h3>
              </div>
            </div>

            <div className="bg-[#131B2E] border border-slate-800 rounded-xl p-5 flex items-center space-x-4">
              <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20"><Database className="h-5 w-5 text-purple-400" /></div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Task Completion</p>
                <h3 className="text-xl font-bold mt-0.5">{stats.task_completion_rate || 0}%</h3>
              </div>
            </div>

            <div className="bg-[#131B2E] border border-slate-800 rounded-xl p-5 flex items-center space-x-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20"><TrendingUp className="h-5 w-5 text-emerald-400" /></div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Operators</p>
                <h3 className="text-xl font-bold text-emerald-400 mt-0.5">{stats.total_users || 0}</h3>
              </div>
            </div>

          </div>

          {/* Extended Metrics Layout Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Box Component Column: Distribution Allocation Bars */}
            <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                <span>Sector Focus Distribution</span>
              </h3>
              <div className="space-y-4 pt-2">
                {Object.keys(stats.sector_distribution || {}).length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No historical startup sector allocations committed yet.</p>
                ) : (
                  Object.entries(stats.sector_distribution).map(([sector, count]) => {
                    const percentage = stats.total_startups > 0 ? (count / stats.total_startups) * 100 : 0;
                    return (
                      <div key={sector} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-200">{sector}</span>
                          <span className="text-slate-400">{count} Active</span>
                        </div>
                        <div className="w-full bg-[#0B0F19] h-2 rounded-full overflow-hidden border border-slate-900">
                          <div 
                            className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Box Component Column: Real-time Context Analytics Pipeline Log Panel */}
            <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-6 lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Database className="h-4 w-4 text-purple-500" />
                <span>Active Knowledge Pipeline Stream</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The institutional text-embedding models are actively indexing flat record parameters directly into multi-dimensional space matrices. Pipeline queries match vector records via semantic clustering models.
              </p>
              
              <div className="p-4 bg-[#0B0F19] border border-slate-800 rounded-xl space-y-1.5 font-mono text-[11px] text-slate-500 mt-2">
                <div className="flex justify-between text-slate-600">
                  <span>[INTAKE THREADS ACTIVE]</span>
                  <span>UVICORN PID: 9300</span>
                </div>
                <p className="text-blue-400">&gt;&gt; Listening for multithread streams at endpoint /api/startups/apply</p>
                <p className="text-emerald-400">&gt;&gt; FAISS structural index clusters state unified completely</p>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default Dashboard;