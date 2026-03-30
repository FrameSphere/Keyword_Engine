import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('keylens_token');
    if (!token) { setLoading(false); return; }
    api.auth.me()
      .then(d => setUser(d.user))
      .catch(() => localStorage.removeItem('keylens_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const d = await api.auth.login(email, password);
    localStorage.setItem('keylens_token', d.token);
    setUser(d.user);
    return d;
  };

  const register = async (email, password) => {
    const d = await api.auth.register(email, password);
    localStorage.setItem('keylens_token', d.token);
    setUser(d.user);
    return d;
  };

  const logout = async () => {
    await api.auth.logout().catch(() => {});
    localStorage.removeItem('keylens_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
