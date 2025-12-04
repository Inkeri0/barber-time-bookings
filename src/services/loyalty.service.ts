import api from '@/lib/api';

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface LoyaltyMembership {
  id: string;
  barberId: string;
  barberName: string;
  barberImage?: string;
  tier: LoyaltyTier;
  points: number;
  nextTierPoints: number;
  discountPercentage: number;
  hasPriorityBooking: boolean;
}

export interface LoyaltyTransaction {
  id: string;
  type: 'earned' | 'redeemed' | 'expired' | 'bonus';
  points: number;
  description: string;
  createdAt: string;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'free_service' | 'product';
  value: number;
}

export interface LoyaltySettings {
  isEnabled: boolean;
  pointsPerEuro: number;
  welcomeBonus: number;
  tierThresholds: {
    silver: number;
    gold: number;
    platinum: number;
  };
  rewards: LoyaltyReward[];
}

export interface LoyaltyMember {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  tier: LoyaltyTier;
  points: number;
  totalSpent: number;
  lastVisit: string;
}

export const loyaltyService = {
  // Customer endpoints
  getMembership: async (barberId: string): Promise<LoyaltyMembership> => {
    return api.get<LoyaltyMembership>(`/loyalty/membership/${barberId}`);
  },

  getAllMemberships: async (): Promise<LoyaltyMembership[]> => {
    return api.get<LoyaltyMembership[]>('/loyalty/memberships');
  },

  getTransactions: async (barberId: string): Promise<LoyaltyTransaction[]> => {
    return api.get<LoyaltyTransaction[]>(`/loyalty/transactions/${barberId}`);
  },

  getRewards: async (barberId: string): Promise<LoyaltyReward[]> => {
    return api.get<LoyaltyReward[]>(`/loyalty/rewards/${barberId}`);
  },

  redeemPoints: async (barberId: string, points: number): Promise<{ discount: number; message: string }> => {
    return api.post('/loyalty/redeem-points', { barberId, points });
  },

  redeemReward: async (barberId: string, rewardId: string): Promise<{ message: string }> => {
    return api.post('/loyalty/redeem-reward', { barberId, rewardId });
  },

  // Barber endpoints
  getSettings: async (): Promise<LoyaltySettings> => {
    return api.get<LoyaltySettings>('/loyalty/settings');
  },

  updateSettings: async (settings: Partial<LoyaltySettings>): Promise<LoyaltySettings> => {
    return api.put<LoyaltySettings>('/loyalty/settings', settings);
  },

  getMembers: async (): Promise<LoyaltyMember[]> => {
    return api.get<LoyaltyMember[]>('/loyalty/members');
  },

  createReward: async (reward: Omit<LoyaltyReward, 'id'>): Promise<LoyaltyReward> => {
    return api.post<LoyaltyReward>('/loyalty/rewards', reward);
  },

  updateReward: async (id: string, reward: Partial<LoyaltyReward>): Promise<LoyaltyReward> => {
    return api.put<LoyaltyReward>(`/loyalty/rewards/${id}`, reward);
  },

  deleteReward: async (id: string): Promise<void> => {
    return api.delete(`/loyalty/rewards/${id}`);
  },

  adjustPoints: async (memberId: string, points: number, reason: string): Promise<void> => {
    return api.post(`/loyalty/members/${memberId}/adjust`, { points, reason });
  },
};

export default loyaltyService;
