import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { analyticsService, AnalyticsDashboard, TimeRange, RevenueTrend } from '@/services/analytics.service';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DollarSign, Calendar, TrendingUp, TrendingDown, Users, Star } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';

// Mock data
const mockDashboard: AnalyticsDashboard = {
  revenue: { total: 4250, online: 3200, inShop: 850, pending: 200, changePercent: 12.5 },
  appointments: { total: 156, completed: 142, cancelled: 10, noShow: 4, completionRate: 91, cancellationRate: 6.4, noShowRate: 2.6, changePercent: 8 },
  servicePopularity: [
    { serviceName: 'Haircut', count: 85, revenue: 2125, percentage: 55 },
    { serviceName: 'Beard Trim', count: 42, revenue: 630, percentage: 27 },
    { serviceName: 'Haircut + Beard', count: 18, revenue: 810, percentage: 12 },
    { serviceName: 'Hot Towel Shave', count: 11, revenue: 385, percentage: 6 },
  ],
  hourlyDistribution: [
    { hour: 9, count: 12 }, { hour: 10, count: 18 }, { hour: 11, count: 22 }, { hour: 12, count: 15 },
    { hour: 13, count: 8 }, { hour: 14, count: 20 }, { hour: 15, count: 25 }, { hour: 16, count: 20 },
    { hour: 17, count: 16 }, { hour: 18, count: 10 },
  ],
  weeklyDistribution: [
    { day: 'Mon', count: 18 }, { day: 'Tue', count: 22 }, { day: 'Wed', count: 28 },
    { day: 'Thu', count: 20 }, { day: 'Fri', count: 35 }, { day: 'Sat', count: 33 }, { day: 'Sun', count: 0 },
  ],
  topCustomers: [
    { id: '1', name: 'John Doe', visits: 12, totalSpent: 420, lastVisit: '2024-11-15' },
    { id: '2', name: 'Mike Smith', visits: 10, totalSpent: 350, lastVisit: '2024-11-12' },
    { id: '3', name: 'Tom Brown', visits: 8, totalSpent: 280, lastVisit: '2024-11-10' },
  ],
  recentReviews: [
    { id: '1', customerName: 'John D.', rating: 5, comment: 'Best haircut ever!', createdAt: '2024-11-15' },
    { id: '2', customerName: 'Sarah M.', rating: 4, comment: 'Great service, will come back.', createdAt: '2024-11-14' },
  ],
};

const mockTrend: RevenueTrend[] = [
  { date: '2024-11-01', revenue: 180 }, { date: '2024-11-02', revenue: 220 },
  { date: '2024-11-03', revenue: 0 }, { date: '2024-11-04', revenue: 150 },
  { date: '2024-11-05', revenue: 280 }, { date: '2024-11-06', revenue: 320 },
  { date: '2024-11-07', revenue: 190 }, { date: '2024-11-08', revenue: 250 },
  { date: '2024-11-09', revenue: 300 }, { date: '2024-11-10', revenue: 0 },
  { date: '2024-11-11', revenue: 180 }, { date: '2024-11-12', revenue: 220 },
  { date: '2024-11-13', revenue: 260 }, { date: '2024-11-14', revenue: 340 },
  { date: '2024-11-15', revenue: 360 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

const Analytics = () => {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState<TimeRange>('last_30_days');

  const { data: dashboard = mockDashboard, isLoading } = useQuery({
    queryKey: ['analytics-dashboard', timeRange],
    queryFn: () => analyticsService.getDashboard(timeRange),
    retry: false,
  });

  const { data: revenueTrend = mockTrend } = useQuery({
    queryKey: ['revenue-trend', timeRange],
    queryFn: () => analyticsService.getRevenueTrend(timeRange),
    retry: false,
  });

  const StatCard = ({ title, value, subValue, change, icon: Icon }: { title: string; value: string; subValue?: string; change?: number; icon: React.ElementType }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
        {change !== undefined && (
          <div className={`flex items-center text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {Math.abs(change)}% {t('analytics.vsPrevious')}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">{t('analytics.title')}</h1>
              <p className="text-muted-foreground">{t('analytics.subtitle')}</p>
            </div>
            <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
              <SelectTrigger className="w-48 mt-4 md:mt-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">{t('analytics.today')}</SelectItem>
                <SelectItem value="last_7_days">{t('analytics.last7Days')}</SelectItem>
                <SelectItem value="last_30_days">{t('analytics.last30Days')}</SelectItem>
                <SelectItem value="this_month">{t('analytics.thisMonth')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatCard
              title={t('analytics.totalRevenue')}
              value={`€${dashboard.revenue.total}`}
              subValue={`${t('analytics.online')}: €${dashboard.revenue.online} | ${t('analytics.inShop')}: €${dashboard.revenue.inShop}`}
              change={dashboard.revenue.changePercent}
              icon={DollarSign}
            />
            <StatCard
              title={t('analytics.appointments')}
              value={dashboard.appointments.total.toString()}
              subValue={`${dashboard.appointments.completed} ${t('analytics.completed')}`}
              change={dashboard.appointments.changePercent}
              icon={Calendar}
            />
            <StatCard
              title={t('analytics.completionRate')}
              value={`${dashboard.appointments.completionRate}%`}
              subValue={`${dashboard.appointments.noShowRate}% ${t('analytics.noShow')}`}
              icon={TrendingUp}
            />
            <StatCard
              title={t('analytics.avgRating')}
              value="4.8"
              subValue={`${dashboard.recentReviews.length} ${t('analytics.newReviews')}`}
              icon={Star}
            />
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">{t('analytics.overview')}</TabsTrigger>
              <TabsTrigger value="services">{t('analytics.services')}</TabsTrigger>
              <TabsTrigger value="customers">{t('analytics.customers')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Revenue Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('analytics.revenueTrend')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueTrend}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" tickFormatter={(v) => format(new Date(v), 'MMM d')} className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip formatter={(value) => [`€${value}`, t('analytics.revenue')]} />
                        <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Hourly & Weekly Distribution */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('analytics.hourlyDist')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dashboard.hourlyDistribution}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="hour" tickFormatter={(v) => `${v}:00`} className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip />
                          <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('analytics.weeklyDist')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dashboard.weeklyDistribution}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="day" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip />
                          <Bar dataKey="count" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="services">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('analytics.servicePopularity')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dashboard.servicePopularity}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            dataKey="count"
                            nameKey="serviceName"
                            label={({ serviceName, percentage }) => `${serviceName}: ${percentage}%`}
                          >
                            {dashboard.servicePopularity.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('analytics.serviceRevenue')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboard.servicePopularity.map((service, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                            <span>{service.serviceName}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">€{service.revenue}</p>
                            <p className="text-xs text-muted-foreground">{service.count} {t('analytics.bookings')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="customers">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('analytics.topCustomers')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('analytics.customer')}</TableHead>
                          <TableHead>{t('analytics.visits')}</TableHead>
                          <TableHead>{t('analytics.spent')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dashboard.topCustomers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{customer.name[0]}</AvatarFallback>
                                </Avatar>
                                {customer.name}
                              </div>
                            </TableCell>
                            <TableCell>{customer.visits}</TableCell>
                            <TableCell>€{customer.totalSpent}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('analytics.recentReviews')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboard.recentReviews.map((review) => (
                        <div key={review.id} className="p-4 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{review.customerName}</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                          <p className="text-xs text-muted-foreground mt-2">{format(new Date(review.createdAt), 'MMM d, yyyy')}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analytics;
