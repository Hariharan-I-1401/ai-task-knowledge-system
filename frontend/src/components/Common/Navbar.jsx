import React from 'react';
import { User as UserIcon } from 'lucide-react';

const Navbar = () => {
  // SAFE PARSING NET
  let user = null;
  try {
    const userString = localStorage.getItem('user');
    if (userString && userString !== "undefined") {
      user = JSON.parse(userString);
    }
  } catch (err) {
    console.error("Local storage sync error inside navbar context:", err);
  }

  const userEmail = user?.email || 'authenticated@fsv.capital';

  return (
    <header className="h-16 border-b border-slate-900 bg-[#0B0F19]/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-40 w-full">
      <div className="text-xs font-medium text-slate-400">
        System Node Active: <span className="text-emerald-400 font-bold">Online</span>
      </div>

      {/* Profile Context Display */}
      <div className="flex items-center space-x-3">
        <div className="flex flex-col text-right">
          <span className="text-xs font-semibold text-white">
            {user?.name || "System Operator"}
          </span>
          <span className="text-[10px] text-slate-500 font-medium tracking-tight">
            {userEmail}
          </span>
        </div>
        
        <div className="h-9 w-9 rounded-xl bg-[#131B2E] border border-slate-800 flex items-center justify-center text-blue-400 shadow-inner">
          <UserIcon className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;