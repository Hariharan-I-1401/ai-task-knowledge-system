import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ShieldCheck } from 'lucide-react';
import api from '../services/api';
// SAFELY IMPORT AUTHCONTEXT: Points straight to your unified authorization engine
import { AuthContext } from '../context/AuthContext.jsx'; 

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegistering ? '/auth/register' : '/auth/login';
    
    // Dynamically inject role_name parameter to satisfy backend schema validations
    const payload = isRegistering 
      ? { ...formData, role_name: "User" } 
      : formData;

    try {
      const response = await api.post(endpoint, payload);
      console.log("Raw Server Authentication Response:", response.data);
      
      // 1. REGISTRATION SUCCESS LOOP: Handle success message response without crashing on missing tokens
      if (isRegistering) {
        alert("Registration Successful! Redirecting you to sign in securely.");
        setIsRegistering(false); // Seamlessly toggle form context back to Login View
        setError('');
        setFormData(prev => ({ ...prev, password: '' })); // Flush out password field for safety
        return; // Halt block execution here
      }

      // 2. LOGIN PROCESS LOOP: Only runs during standard authentication phases
      const token = response.data?.access_token;
      
      if (!token) {
        throw new Error("The server payload did not include a valid access_token string.");
      }

      // NORMALIZE PAYLOAD: Read the flat "User" or "Admin" string directly from your server
      const serverRoleString = response.data?.role || "User"; 
      
      // Structure the user payload safely to support your navbar/sidebar filters
      const userData = {
        name: formData.name || "System Operator",
        email: formData.email,
        role: {
          name: serverRoleString 
        }
      };

      // Push credentials straight into your state manager wrapper
      login(token, userData);
      
      // Transition dynamically to your system statistics layout grid
      navigate('/dashboard');
    } catch (err) {
      console.error("Detailed Authentication Processing Failure:", err);
      
      let backendErrorMessage = 'Authentication credentials verification rejected.';
      const detail = err.response?.data?.detail;

      // DEFENSIVE ERROR PARSER: Safely unpack flat strings or structured FastAPI validation objects
      if (detail) {
        if (typeof detail === 'string') {
          backendErrorMessage = detail;
        } else if (Array.isArray(detail)) {
          // Flatten Pydantic arrays into clear text labels: "password: field required"
          backendErrorMessage = detail
            .map(errObj => `${errObj.loc[errObj.loc.length - 1] || 'field'}: ${errObj.msg}`)
            .join(', ');
        } else if (typeof detail === 'object') {
          backendErrorMessage = detail.msg || JSON.stringify(detail);
        }
      } else if (err.message) {
        backendErrorMessage = err.message;
      }

      setError(backendErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#131B2E] border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">FSV Capital Portal</h1>
          <p className="text-xs text-slate-400">Sign in to access your venture deal space</p>
        </div>

        {error && (
          <div className="text-xs text-red-400 bg-red-500/5 p-3 rounded-xl border border-red-500/10 flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-red-400 shrink-0" />
            <span className="first-letter:uppercase">{error}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {isRegistering && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe"
                  className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl pl-12 pr-4 py-3 text-xs font-medium text-white outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="operator@fsv.capital"
                className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl pl-12 pr-4 py-3 text-xs font-medium text-white outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                required
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••••••"
                className="w-full bg-[#0B0F19] border border-slate-800 focus:border-blue-500 rounded-xl pl-12 pr-4 py-3 text-xs font-medium text-white outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/10 mt-2"
          >
            {loading ? "Verifying Credentials..." : isRegistering ? "Create Institutional Account" : "Sign In Securely"}
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            {isRegistering ? "Already have an account? Sign in here" : "Don't have an account? Sign up here"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Auth;