import api from '@/lib/api';

// Types - matches backend response
export interface PlanFeatures {
  maxServices: number;
  maxAppointmentsPerMonth: number;
  analytics: 'basic' | 'advanced';
  loyaltyProgram: boolean;
  socialMediaPosting: boolean;
  productSales: boolean;
  prioritySupport: boolean;
  customBranding: boolean;
  promotions: boolean;
  waitlist: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlySavings?: number;
  features: PlanFeatures;
  isPopular?: boolean;
}

export interface Subscription {
  id: string;
  planId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  billingCycle: 'monthly' | 'yearly';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt?: string;
  cancelledAt?: string;
  appointmentsUsed: number;
  appointmentsLimit: number | null;
}

export interface Invoice {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  createdAt: string;
  paidAt?: string;
  downloadUrl?: string;
  description: string;
}

export interface SubscribeResponse {
  subscription?: Subscription;
  paymentUrl?: string;
  message: string;
}

interface InvoicesResponse {
  invoices: Invoice[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Subscription API methods
export const subscriptionService = {
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    return api.get<SubscriptionPlan[]>('/subscriptions/plans');
  },

  getCurrentSubscription: async (): Promise<Subscription> => {
    return api.get<Subscription>('/subscriptions/my');
  },

  subscribe: async (planId: string, billingCycle: 'monthly' | 'yearly'): Promise<SubscribeResponse> => {
    return api.post<SubscribeResponse>('/subscriptions/subscribe', { planId, billingCycle });
  },

  changePlan: async (planId: string, billingCycle: 'monthly' | 'yearly'): Promise<SubscribeResponse> => {
    return api.put<SubscribeResponse>('/subscriptions/change-plan', { planId, billingCycle });
  },

  cancelSubscription: async (): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/subscriptions/cancel');
  },

  getInvoices: async (): Promise<Invoice[]> => {
    const response = await api.get<InvoicesResponse>('/subscriptions/invoices');
    return response.invoices || [];
  },
};

export default subscriptionService;
