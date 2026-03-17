// apps/client/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({ id: decoded.sub, name: decoded.name, email: decoded.email, role: decoded.role });
      } catch (e) {
        localStorage.removeItem('accessToken');
      }
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (data: any) => {
    localStorage.setItem('accessToken', data.accessToken);
    const decoded: any = jwtDecode(data.accessToken);
    setUser({ id: decoded.sub, name: decoded.name, email: decoded.email, role: decoded.role });
  };

  const login = async (email: string, password: string) => {
    const { data } = await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
    handleAuthSuccess(data);
    const decoded: any = jwtDecode(data.accessToken);
    return { id: decoded.sub, name: decoded.name, email: decoded.email, role: decoded.role };
  };

  const register = async (userData: any) => {
    const { data } = await axios.post('/api/auth/register', userData, { withCredentials: true });
    handleAuthSuccess(data);
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } catch (e) {
      // ignore network/logout errors
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('selectedPack');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
