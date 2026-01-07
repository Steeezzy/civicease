import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  officerName: string;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [officerName, setOfficerName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('civicease_auth');
    if (auth) {
      const data = JSON.parse(auth);
      setIsAuthenticated(true);
      setOfficerName(data.name);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    // Password validation
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    // Simulate authentication (replace with real auth later)
    // For demo: any valid email/password combination works
    const name = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
    
    localStorage.setItem('civicease_auth', JSON.stringify({ 
      email, 
      name: `Officer ${name}` 
    }));
    
    setIsAuthenticated(true);
    setOfficerName(`Officer ${name}`);
    navigate('/dashboard');
    
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('civicease_auth');
    setIsAuthenticated(false);
    setOfficerName('');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, officerName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
