import api from '@/lib/api';

export type PromoType = 'last_minute' | 'seasonal' | 'flash_sale' | 'bundle';
export type DiscountType = 'percentage' | 'fixed';

export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: PromoType;
  discountType: DiscountType;
  discountValue: number;
  code?: string;
  validFrom: string;
  validTo: string;
  serviceIds?: string[];
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface PromotionStats {
  totalUses: number;
  totalRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
}

export interface PublicPromotion {
  id: string;
  name: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  code?: string;
  validTo: string;
  applicableServices?: string[];
}

export const promotionService = {
  // Barber endpoints
  create: async (data: Omit<Promotion, 'id' | 'usageCount' | 'createdAt'>): Promise<Promotion> => {
    return api.post<Promotion>('/promotions', data);
  },

  createLastMinute: async (data: {
    discountValue: number;
    discountType: DiscountType;
    validHours: number;
    serviceIds?: string[];
  }): Promise<Promotion> => {
    return api.post<Promotion>('/promotions/last-minute', data);
  },

  getMyPromotions: async (): Promise<Promotion[]> => {
    return api.get<Promotion[]>('/promotions/my');
  },

  update: async (id: string, data: Partial<Promotion>): Promise<Promotion> => {
    return api.put<Promotion>(`/promotions/${id}`, data);
  },

  toggle: async (id: string): Promise<Promotion> => {
    return api.post<Promotion>(`/promotions/${id}/toggle`);
  },

  delete: async (id: string): Promise<void> => {
    return api.delete(`/promotions/${id}`);
  },

  getStats: async (id: string): Promise<PromotionStats> => {
    return api.get<PromotionStats>(`/promotions/${id}/stats`);
  },

  // Public endpoints
  getBarberPromotions: async (barberId: string): Promise<PublicPromotion[]> => {
    return api.get<PublicPromotion[]>(`/promotions/barber/${barberId}`);
  },

  applyCode: async (code: string, serviceId: string): Promise<{ valid: boolean; discount: number; message: string }> => {
    return api.post('/promotions/apply', { code, serviceId });
  },
};

export default promotionService;
