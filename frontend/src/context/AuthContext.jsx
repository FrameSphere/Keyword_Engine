import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('keyscope_token');
    if (!token) { setLoading(false); return; }
    api.auth.me()
      .then(d => setUser(d.user))
      .catch(() => localStorage.removeItem('keyscope_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const d = await api.auth.login(email, password);
    localStorage.setItem('keyscope_token', d.token);
    setUser(d.user);
    return d;
  };

  const register = async (email, password) => {
    const d = await api.auth.register(email, password);
    localStorage.setItem('keyscope_token', d.token);
    setUser(d.user);
    return d;
  };

  // Called after OAuth exchange returns a token
  const loginWithToken = (token, user) => {
    localStorage.setItem('keyscope_token', token);
    setUser(user);
  };

  const logout = async () => {
    await api.auth.logout().catch(() => {});
    localStorage.removeItem('keyscope_token');
    setUser(null);
  };

  // Plan im State aktualisieren (nach Upgrade/Downgrade)
  const refreshUser = async () => {
    try {
      const d = await api.auth.me();
      setUser(d.user);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithToken, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
