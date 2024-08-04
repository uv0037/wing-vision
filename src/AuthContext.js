import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username')); // Added for username

  const login = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username); // Save username to localStorage
    setToken(token);
    setUsername(username); // Set username in state
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username'); // Remove username from localStorage
    setToken(null);
    setUsername(null); // Clear username in state
  };

  return (
    <AuthContext.Provider value={{ token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
