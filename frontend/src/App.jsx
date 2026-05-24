import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Common/Sidebar';
import Navbar from './components/Common/Navbar';
import Auth from './pages/Auth';
import AdminDashboard from './pages/Dashboard';      
import AIKnowledgeBase from './pages/AIKnowledgeBase'; 
import TaskManager from './pages/TaskManager';
import SemanticSearch from './pages/SemanticSearch';
import Apply from './pages/Apply'; 
import ProtectedRoute from './components/Common/ProtectedRoute';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Authentication Gateway */}
        <Route path="/login" element={<Auth />} />

        {/* Master Portal Layout Wrapper with Protected Access Controls */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <div className="flex bg-[#0B0F19] min-h-screen text-white font-sans antialiased">
                {/* 1. Global Left Navigation Drawer */}
                <Sidebar />
                
                {/* 2. Main Content View Panel */}
                <div className="flex-1 flex flex-col min-w-0">
                  <Navbar />
                  <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    <Routes>
                      {/* Dashboard & Analytics View Maps */}
                      <Route path="/dashboard" element={<AdminDashboard />} />
                      {/* 🟢 FIXED: Linked the analytics route to your new Analytics component */}
                      <Route path="/analytics" element={<Analytics />} />
                      
                      {/* Database & Application Tables */}
                      <Route path="/pipeline" element={<AIKnowledgeBase />} />
                      <Route path="/tasks" element={<TaskManager />} />
                      
                      {/* AI Search Engine Routing */}
                      <Route path="/search" element={<SemanticSearch />} />
                      
                      {/* Intake form routing links now point directly to your Apply component layout matrix */}
                      <Route path="/apply" element={<Apply />} />

                      {/* Root Fallback Catchment */}
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;