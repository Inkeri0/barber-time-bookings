import api from '@/lib/api';

// Types
export interface Appointment {
  id: string;
  barberId: string;
  barberName: string;
  shopName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  price: number;
  depositPaid: number;
  remainingAmount: number;
  status: 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  paymentStatus: 'pending' | 'deposit_paid' | 'fully_paid';
  address: string;
  city: string;
}

// Appointment API methods
export const appointmentService = {
  // Get my appointments
  getMyAppointments: async (status: 'upcoming' | 'past'): Promise<Appointment[]> => {
    return api.get<Appointment[]>(`/appointments/my?status=${status}`);
  },

  // Cancel appointment
  cancelAppointment: async (appointmentId: string): Promise<void> => {
    return api.post<void>(`/appointments/${appointmentId}/cancel`);
  },

  // Get appointment details
  getAppointment: async (appointmentId: string): Promise<Appointment> => {
    return api.get<Appointment>(`/appointments/${appointmentId}`);
  },
};

export default appointmentService;
