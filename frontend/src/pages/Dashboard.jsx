import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Safely parse the logged-in user from local storage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const isAdmin = user?.role?.name === 'Admin' || user?.role?.name === 'Founder';

  useEffect(() => {
    // 1. Kick out unauthenticated users
    if (!user) {
      navigate('/login');
      return;
    }

    // 2. FORCED ONBOARDING: If it's a Standard User, check if they have applied
    if (!isAdmin) {
      const hasApplied = localStorage.getItem(`has_applied_${user.id}`);
      if (!hasApplied) {
        navigate('/apply'); // Instantly bounce new accounts to the form!
      }
    }
  }, [user, isAdmin, navigate]);

  return (
    <div className="p-8 space-y-6 text-white max-w-6xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
          <LayoutDashboard className="h-6 w-6 text-blue-500" />
          <span>{isAdmin ? "Admin Analytics Control Center" : "Founder Workspace"}</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Welcome back, {user?.name || user?.email || "Operator"}. 
        </p>
      </div>

      {!isAdmin ? (
        <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-xl">
          <CheckCircle className="h-10 w-10 text-green-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Application Under Review</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Your startup application has been successfully submitted and is currently being vectorized and analyzed by the FSV pipeline. Please monitor the Task Manager for updates.
          </p>
        </div>
      ) : (
        <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-xl">
          <h2 className="text-lg font-bold text-white">Admin Dashboard</h2>
          <p className="text-xs text-slate-400">
            System analytics and pipeline tracking will be rendered here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;