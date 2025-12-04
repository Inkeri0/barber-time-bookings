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

export const analyticsService = {
  getDashboard: async (timeRange: TimeRange, startDate?: string, endDate?: string): Promise<AnalyticsDashboard> => {
    const params = new URLSearchParams({ timeRange });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return api.get<AnalyticsDashboard>(`/analytics/dashboard?${params.toString()}`);
  },

  getRevenueTrend: async (timeRange: TimeRange): Promise<RevenueTrend[]> => {
    return api.get<RevenueTrend[]>(`/analytics/revenue/trend?timeRange=${timeRange}`);
  },
};

export default analyticsService;
