import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Layers, 
  CheckSquare, 
  Search, 
  BarChart3, 
  LogOut, 
  ShieldAlert 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // SAFE PARSING NET: Eliminates any chance of an "undefined" string layout crash
  let user = null;
  try {
    const userString = localStorage.getItem('user');
    if (userString && userString !== "undefined") {
      user = JSON.parse(userString);
    }
  } catch (err) {
    console.error("Local storage sync error inside sidebar context:", err);
  }
  
  const userRole = user?.role?.name || 'User';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: Layers,
      allowedRoles: ["Admin", "Founder"]
    },
    {
      name: "Workflow Queue",
      path: "/tasks",
      icon: CheckSquare,
      allowedRoles: ["Admin"]
    },
    {
      name: "Semantic Search",
      path: "/search",
      icon: Search,
      allowedRoles: ["Admin"]
    },
    {
      name: "Analytics Center",
      path: "/analytics",
      icon: BarChart3,
      allowedRoles: ["Admin"]
    }
  ];

  return (
    <aside className="w-64 bg-[#0B0F19] min-h-screen border-r border-slate-900 flex flex-col justify-between p-5">
      <div className="space-y-8">
        {/* Brand Header */}
        <div className="flex items-center space-x-3 px-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white tracking-wider text-sm shadow-lg shadow-blue-500/20">
            FSV
          </div>
          <span className="font-bold text-sm tracking-wide text-white uppercase">
            Knowledge Engine
          </span>
        </div>

        {/* Dynamic Role Indicator Badge */}
        <div className="mx-2 p-3 rounded-xl bg-[#131B2E] border border-slate-800 flex items-center space-x-2.5">
          <ShieldAlert className="h-4 w-4 text-blue-400" />
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400 font-medium">Security Scope</span>
            <span className="text-xs font-bold text-white tracking-wide">{userRole}</span>
          </div>
        </div>

        {/* Filtered Navigation Links */}
        <nav className="space-y-1.5">
          {links
            .filter(link => link.allowedRoles.includes(userRole))
            .map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                      : "text-slate-400 hover:bg-[#131B2E] hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.name}</span>
                </Link>
              );
          })}
        </nav>
      </div>

      {/* System Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:bg-red-500/5 hover:text-red-400 border border-transparent hover:border-red-500/10 transition-all duration-150"
      >
        <LogOut className="h-4 w-4" />
        <span>Exit System</span>
      </button>
    </aside>
  );
};

export default Sidebar;