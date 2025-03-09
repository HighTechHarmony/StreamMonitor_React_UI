import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';

export interface AuthContextType {
    isLoggedIn: boolean;
    isLoading: boolean;
    user: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (username: string, password: string) => {
    await axios.post('/auth/login', { username, password }, { withCredentials: true });
    setUser(username);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await axios.post('/auth/logout', {}, { withCredentials: true });
    setUser(null);
    setIsLoggedIn(false);
  };

  const register = async (username: string, password: string) => {
    await axios.post('/auth/register', { username, password }, { withCredentials: true });
    setUser(username);
  };

  useEffect(() => {
    // Check for existing session
    axios.get('/auth/me', { withCredentials: true })
      .then((response: { data: string }) => {
        // console.log('/auth/me response:', response.data);
        setUser(response.data);        
        setIsLoggedIn(true);
      })
      .catch((error: any) => {
        if (error.response && error.response.status === 401) {
          console.log('No session found');
          setUser(null);
          setIsLoggedIn(false);
        } else {
          console.error('Failed to check session', error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{  isLoading, isLoggedIn, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );

};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
