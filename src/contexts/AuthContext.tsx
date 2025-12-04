import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User, LoginResponse, OtpVerifyResponse } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (data: {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: 'customer' | 'barber';
  }) => Promise<LoginResponse>;
  requestOtp: (email: string) => Promise<{ message: string; expiresAt: string }>;
  verifyOtp: (email: string, code: string) => Promise<OtpVerifyResponse>;
  completeOtpRegistration: (
    email: string,
    code: string,
    firstName: string,
    lastName: string,
    phone?: string,
    role?: 'customer' | 'barber'
  ) => Promise<LoginResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      const storedUser = authService.getStoredUser();
      if (storedUser && authService.isAuthenticated()) {
        try {
          // Verify token is still valid
          const profile = await authService.getProfile();
          setUser(profile);
        } catch {
          // Token is invalid or expired
          authService.logout();
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setUser(response.user);
    return response;
  };

  const register = async (data: {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: 'customer' | 'barber';
  }) => {
    const response = await authService.register(data);
    setUser(response.user);
    return response;
  };

  const requestOtp = async (email: string) => {
    return authService.requestOtp(email);
  };

  const verifyOtp = async (email: string, code: string) => {
    const response = await authService.verifyOtp(email, code);
    if (response.user) {
      setUser(response.user);
    }
    return response;
  };

  const completeOtpRegistration = async (
    email: string,
    code: string,
    firstName: string,
    lastName: string,
    phone?: string,
    role: 'customer' | 'barber' = 'customer'
  ) => {
    const response = await authService.completeOtpRegistration(
      email,
      code,
      firstName,
      lastName,
      phone,
      role
    );
    setUser(response.user);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        requestOtp,
        verifyOtp,
        completeOtpRegistration,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
