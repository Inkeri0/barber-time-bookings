import api from '@/lib/api';

export type TimePreference = 'morning' | 'afternoon' | 'evening' | 'any';
export type WaitlistStatus = 'waiting' | 'offered' | 'accepted' | 'declined' | 'expired';

export interface WaitlistEntry {
  id: string;
  barberId: string;
  barberName: string;
  barberImage?: string;
  serviceId: string;
  serviceName: string;
  preferredDate?: string;
  timePreference: TimePreference;
  flexibilityDays: number;
  status: WaitlistStatus;
  offeredSlot?: {
    date: string;
    time: string;
    expiresAt: string;
  };
  createdAt: string;
}

export interface WaitlistBarberEntry extends WaitlistEntry {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  priority: 'normal' | 'high' | 'vip';
}

export const waitlistService = {
  // Customer endpoints
  join: async (data: {
    barberId: string;
    serviceId: string;
    preferredDate?: string;
    timePreference: TimePreference;
    flexibilityDays: number;
  }): Promise<WaitlistEntry> => {
    return api.post<WaitlistEntry>('/waitlist/join', data);
  },

  getMyEntries: async (): Promise<WaitlistEntry[]> => {
    return api.get<WaitlistEntry[]>('/waitlist/my');
  },

  updateEntry: async (id: string, data: Partial<WaitlistEntry>): Promise<WaitlistEntry> => {
    return api.put<WaitlistEntry>(`/waitlist/${id}`, data);
  },

  cancelEntry: async (id: string): Promise<void> => {
    return api.delete(`/waitlist/${id}`);
  },

  respondToOffer: async (id: string, accept: boolean): Promise<{ message: string; appointmentId?: string }> => {
    return api.post(`/waitlist/respond`, { id, accept });
  },

  // Barber endpoints
  getBarberWaitlist: async (): Promise<WaitlistBarberEntry[]> => {
    return api.get<WaitlistBarberEntry[]>('/waitlist/barber');
  },

  offerSlot: async (entryId: string, date: string, time: string): Promise<{ message: string }> => {
    return api.post('/waitlist/offer', { entryId, date, time });
  },

  setPriority: async (entryId: string, priority: 'normal' | 'high' | 'vip'): Promise<void> => {
    return api.put(`/waitlist/${entryId}/priority`, { priority });
  },
};

export default waitlistService;
