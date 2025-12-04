import api from '@/lib/api';

export interface ReferralCode {
  code: string;
  shareUrl: string;
  totalReferrals: number;
  completedReferrals: number;
}

export interface Referral {
  id: string;
  referredEmail: string;
  status: 'pending' | 'completed' | 'expired';
  createdAt: string;
  completedAt?: string;
}

export interface ReferralReward {
  id: string;
  type: 'discount' | 'free_haircut' | 'subscription_discount';
  value: number;
  description: string;
  isRedeemed: boolean;
  expiresAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  referrals: number;
  isCurrentUser: boolean;
}

export const referralService = {
  getMyCode: async (): Promise<ReferralCode> => {
    return api.get<ReferralCode>('/referrals/my-code');
  },

  applyCode: async (code: string): Promise<{ message: string; discount?: number }> => {
    return api.post('/referrals/apply', { code });
  },

  getMyReferrals: async (): Promise<Referral[]> => {
    return api.get<Referral[]>('/referrals/my-referrals');
  },

  getRewards: async (): Promise<ReferralReward[]> => {
    return api.get<ReferralReward[]>('/referrals/rewards');
  },

  useReward: async (rewardId: string): Promise<{ message: string }> => {
    return api.post(`/referrals/rewards/use`, { rewardId });
  },

  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    return api.get<LeaderboardEntry[]>('/referrals/leaderboard');
  },
};

export default referralService;
