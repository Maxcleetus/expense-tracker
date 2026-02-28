import { createContext, useContext, useMemo, useState } from 'react';
import http from '../api/http';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const setSession = (sessionData) => {
    localStorage.setItem('token', sessionData.token);
    localStorage.setItem('user', JSON.stringify(sessionData.user));
    setUser(sessionData.user);
  };

  const login = async (credentials) => {
    const response = await http.post('/auth/login', credentials);
    setSession(response.data.data);
  };

  const register = async (payload) => {
    const response = await http.post('/auth/register', payload);
    setSession(response.data.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
