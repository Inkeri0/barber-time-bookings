import api from '@/lib/api';

export interface StudentStatus {
  isVerified: boolean;
  university?: string;
  verifiedAt?: string;
  email?: string;
  discountPercentage: number;
}

export interface StudentDiscount {
  available: boolean;
  firstTimeDiscount: number;
  ongoingDiscount: number;
}

export const studentService = {
  getStatus: async (): Promise<StudentStatus> => {
    return api.get<StudentStatus>('/students/status');
  },

  requestVerification: async (email: string, university: string): Promise<{ message: string; expiresAt: string }> => {
    return api.post('/students/verify/request', { email, university });
  },

  confirmVerification: async (email: string, code: string): Promise<{ verified: boolean; message: string }> => {
    return api.post('/students/verify/confirm', { email, code });
  },

  getDiscount: async (): Promise<StudentDiscount> => {
    return api.get<StudentDiscount>('/students/discount');
  },
};

export default studentService;
