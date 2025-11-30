import api from '@/lib/api';

// Types
export interface CustomerSummary {
  upcomingAppointments: number;
  completedVisits: number;
  favoriteBarbers: number;
  reviewsGiven: number;
  pendingReviews: number;
}

export interface FavoriteBarber {
  id: string;
  shopName: string;
  city: string;
  rating: number;
  reviewCount: number;
  profileImage?: string;
}

export interface PendingReview {
  appointmentId: string;
  barberId: string;
  barberName: string;
  serviceName: string;
  date: string;
}

export interface MyReview {
  id: string;
  barberId: string;
  barberName: string;
  rating: number;
  comment: string;
  createdAt: string;
  barberReply?: string;
  barberReplyDate?: string;
}

// Customer API methods
export const customerService = {
  // Get profile summary stats
  getSummary: async (): Promise<CustomerSummary> => {
    return api.get<CustomerSummary>('/customers/profile/summary');
  },

  // Get favorite barbers
  getFavorites: async (): Promise<FavoriteBarber[]> => {
    return api.get<FavoriteBarber[]>('/customers/favorites');
  },

  // Add barber to favorites
  addFavorite: async (barberId: string): Promise<void> => {
    return api.post<void>(`/customers/favorites/${barberId}`);
  },

  // Remove barber from favorites
  removeFavorite: async (barberId: string): Promise<void> => {
    return api.delete<void>(`/customers/favorites/${barberId}`);
  },

  // Get pending reviews
  getPendingReviews: async (): Promise<PendingReview[]> => {
    return api.get<PendingReview[]>('/customers/pending-reviews');
  },

  // Get my reviews
  getMyReviews: async (): Promise<MyReview[]> => {
    return api.get<MyReview[]>('/reviews/my');
  },

  // Create review
  createReview: async (data: { appointmentId: string; rating: number; comment: string }): Promise<void> => {
    return api.post<void>('/reviews', data);
  },
};

export default customerService;
