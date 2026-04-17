import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          const rawData = res.data.data;
          const userData = rawData.user ? { ...rawData.user, ...rawData } : rawData;
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  // Satu endpoint login universal — backend mendeteksi role dari DB
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, role } = res.data.data;
    localStorage.setItem('token', token);
    const userRes = await api.get('/auth/me');
    
    // Tangani inkonsistensi backend: jika ada nested 'user', ambil isi dalamnya
    const rawData = userRes.data.data;
    const userData = rawData.user ? { ...rawData.user, ...rawData } : rawData;
    
    setUser(userData);
    return { user: userData, role };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
