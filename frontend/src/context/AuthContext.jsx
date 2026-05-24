import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('token');
    const savedUserStr = localStorage.getItem('user');
    
    // Check if both elements are present and not corrupted strings
    if (savedToken && savedUserStr && savedUserStr !== "undefined") {
      try {
        return JSON.parse(savedUserStr);
      } catch (e) {
        console.error("Failed parsing user context session cache data:", e);
        return null;
      }
    }
    return null;
  });

  // Updated login function to receive the complete nested user packet from FastAPI
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Instantly commit the data to React state so components update without a reload
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};