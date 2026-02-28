import { createContext, useContext, useMemo, useState } from 'react';
import http from '../api/http';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('admin_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (credentials) => {
    const response = await http.post('/auth/login', credentials);
    const session = response.data.data;

    if (session.user.role !== 'admin') {
      throw new Error('This account is not an admin account');
    }

    localStorage.setItem('admin_token', session.token);
    localStorage.setItem('admin_user', JSON.stringify(session.user));
    setAdmin(session.user);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdmin(null);
  };

  const value = useMemo(() => ({ admin, login, logout }), [admin]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
