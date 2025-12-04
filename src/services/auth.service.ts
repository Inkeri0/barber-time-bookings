import api from '@/lib/api';

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'customer' | 'barber' | 'admin';
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface OtpRequestResponse {
  message: string;
  expiresAt: string;
}

export interface OtpVerifyResponse {
  verified: boolean;
  needsRegistration: boolean;
  email: string;
  message: string;
  accessToken?: string;
  user?: User;
}

export interface RegisterData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'customer' | 'barber';
}

// Auth API methods
export const authService = {
  // Email + Password login
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    if (response.accessToken) {
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  // Register new user
  register: async (data: RegisterData): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/register', data);
    if (response.accessToken) {
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  // Request OTP code
  requestOtp: async (email: string): Promise<OtpRequestResponse> => {
    return api.post<OtpRequestResponse>('/auth/otp/request', { email });
  },

  // Verify OTP code
  verifyOtp: async (email: string, code: string): Promise<OtpVerifyResponse> => {
    const response = await api.post<OtpVerifyResponse>('/auth/otp/verify', { email, code });
    if (response.accessToken) {
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  // Complete OTP registration (for new users)
  completeOtpRegistration: async (
    email: string,
    code: string,
    firstName: string,
    lastName: string,
    phone?: string,
    role: 'customer' | 'barber' = 'customer'
  ): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/otp/complete-registration', {
      email,
      code,
      firstName,
      lastName,
      phone,
      role,
    });
    if (response.accessToken) {
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    return api.get<User>('/auth/profile');
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user is logged in
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Get stored user
  getStoredUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get stored token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
};

export default authService;