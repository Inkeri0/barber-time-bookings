import api from '@/lib/api';

export interface ReferralCode {
  referralCode: string;
  shareLink: string;
  successfulReferrals: number;
  pendingReferrals: number;
  progressToFreeHaircut: number;
  referralsNeededForFreeHaircut: number;
  creditBalance: number;
  // Mapped properties for UI compatibility
  code?: string;
  shareUrl?: string;
  totalReferrals?: number;
  completedReferrals?: number;
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
    const data = await api.get<ReferralCode>('/referrals/my-code');
    // Map to UI-friendly names
    return {
      ...data,
      code: data.referralCode,
      shareUrl: data.shareLink,
      totalReferrals: data.successfulReferrals + data.pendingReferrals,
      completedReferrals: data.successfulReferrals,
    };
  },

  applyCode: async (code: string): Promise<{ message: string; discount?: number }> => {
    return api.post('/referrals/apply', { code });
  },

  getMyReferrals: async (): Promise<Referral[]> => {
    const data = await api.get<{ referrals: Referral[]; pagination: unknown }>('/referrals/my-referrals');
    return data.referrals || [];
  },

  getRewards: async (): Promise<ReferralReward[]> => {
    const data = await api.get<{ available: ReferralReward[]; used: ReferralReward[]; totalAvailableValue: number }>('/referrals/rewards');
    return [...(data.available || []), ...(data.used || []).map(r => ({ ...r, isRedeemed: true }))];
  },

  useReward: async (rewardId: string): Promise<{ message: string }> => {
    return api.post(`/referrals/rewards/use`, { rewardId });
  },

  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    try {
      return await api.get<LeaderboardEntry[]>('/referrals/leaderboard');
    } catch {
      // Return empty array if leaderboard fails
      return [];
    }
  },
};

export default referralService;
