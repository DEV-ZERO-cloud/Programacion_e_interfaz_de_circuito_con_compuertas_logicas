import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('pqr_token');
    const savedUser = localStorage.getItem('pqr_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      getMe()
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('pqr_token');
          localStorage.removeItem('pqr_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = (token, userData) => {
    localStorage.setItem('pqr_token', token);
    localStorage.setItem('pqr_user', JSON.stringify(userData));
    setUser(userData);
  };

  const signOut = () => {
    localStorage.removeItem('pqr_token');
    localStorage.removeItem('pqr_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
