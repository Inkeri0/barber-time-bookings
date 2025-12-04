import api from '@/lib/api';

export type TimeRange = 'today' | 'last_7_days' | 'last_30_days' | 'this_month' | 'custom';

export interface RevenueStats {
  total: number;
  online: number;
  inShop: number;
  pending: number;
  changePercent: number;
}

export interface AppointmentStats {
  total: number;
  completed: number;
  cancelled: number;
  noShow: number;
  completionRate: number;
  cancellationRate: number;
  noShowRate: number;
  changePercent: number;
}

export interface ServicePopularity {
  serviceName: string;
  count: number;
  revenue: number;
  percentage: number;
}

export interface HourlyDistribution {
  hour: number;
  count: number;
}

export interface WeeklyDistribution {
  day: string;
  count: number;
}

export interface TopCustomer {
  id: string;
  name: string;
  visits: number;
  totalSpent: number;
  lastVisit: string;
}

export interface RecentReview {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface RevenueTrend {
  date: string;
  revenue: number;
}

export interface AnalyticsDashboard {
  revenue: RevenueStats;
  appointments: AppointmentStats;
  servicePopularity: ServicePopularity[];
  hourlyDistribution: HourlyDistribution[];
  weeklyDistribution: WeeklyDistribution[];
  topCustomers: TopCustomer[];
  recentReviews: RecentReview[];
}

// Backend response types (different from frontend types)
interface BackendDashboardResponse {
  revenue: {
    totalRevenue: string;
    paidOnline: string;
    paidInShop: string;
    pendingInShop: string;
    averagePerAppointment: string;
    appointmentCount: number;
    revenueChange: string;
    trend: string;
  };
  appointments: {
    total: number;
    completed: number;
    cancelled: number;
    noShow: number;
    pending: number;
    completionRate: string;
    cancellationRate: string;
    noShowRate: string;
  };
  services: Array<{
    serviceName: string;
    count: number;
    revenue: string;
    percentage: number;
  }>;
  customers: {
    uniqueCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    loyaltyMembers: number;
    retentionRate: number;
    averageVisits: number;
  };
  hourlyDistribution: {
    distribution: Array<{ hour: number; count: number; label: string }>;
    peakHour: string;
    peakHourCount: number;
  };
  weeklyDistribution: {
    distribution: Array<{ dayOfWeek: number; dayName: string; count: number; revenue: string }>;
    busiestDay: string;
    busiestDayCount: number;
  };
  recentReviews: Array<{
    id: string;
    rating: number;
    comment: string;
    customerName: string;
    createdAt: string;
  }>;
  topCustomers: Array<{
    id: string;
    name: string;
    visits: number;
    totalSpent: string;
    lastVisit: string;
  }>;
}

export const analyticsService = {
  getDashboard: async (timeRange: TimeRange, startDate?: string, endDate?: string): Promise<AnalyticsDashboard> => {
    const params = new URLSearchParams({ timeRange });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await api.get<BackendDashboardResponse>(`/analytics/dashboard?${params.toString()}`);

    // Transform backend response to frontend format
    return {
      revenue: {
        total: parseFloat(response.revenue?.totalRevenue || '0'),
        online: parseFloat(response.revenue?.paidOnline || '0'),
        inShop: parseFloat(response.revenue?.paidInShop || '0'),
        pending: parseFloat(response.revenue?.pendingInShop || '0'),
        changePercent: parseFloat(response.revenue?.revenueChange || '0'),
      },
      appointments: {
        total: response.appointments?.total || 0,
        completed: response.appointments?.completed || 0,
        cancelled: response.appointments?.cancelled || 0,
        noShow: response.appointments?.noShow || 0,
        completionRate: parseFloat(response.appointments?.completionRate || '0'),
        cancellationRate: parseFloat(response.appointments?.cancellationRate || '0'),
        noShowRate: parseFloat(response.appointments?.noShowRate || '0'),
        changePercent: 0, // Backend doesn't provide this
      },
      servicePopularity: (response.services || []).map(s => ({
        serviceName: s.serviceName,
        count: s.count,
        revenue: parseFloat(s.revenue || '0'),
        percentage: s.percentage,
      })),
      hourlyDistribution: (response.hourlyDistribution?.distribution || []).map(h => ({
        hour: h.hour,
        count: h.count,
      })),
      weeklyDistribution: (response.weeklyDistribution?.distribution || []).map(w => ({
        day: w.dayName?.substring(0, 3) || '',
        count: w.count,
      })),
      topCustomers: (response.topCustomers || []).map(c => ({
        id: c.id,
        name: c.name,
        visits: c.visits,
        totalSpent: parseFloat(c.totalSpent || '0'),
        lastVisit: c.lastVisit,
      })),
      recentReviews: (response.recentReviews || []).map(r => ({
        id: r.id,
        customerName: r.customerName,
        rating: r.rating,
        comment: r.comment || '',
        createdAt: r.createdAt,
      })),
    };
  },

  getRevenueTrend: async (timeRange: TimeRange): Promise<RevenueTrend[]> => {
    try {
      const response = await api.get<RevenueTrend[]>(`/analytics/revenue/trend?timeRange=${timeRange}`);
      return response || [];
    } catch {
      return [];
    }
  },
};

export default analyticsService;
