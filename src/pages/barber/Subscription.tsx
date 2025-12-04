import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { subscriptionService, SubscriptionPlan, Subscription as SubscriptionType, Invoice, PlanFeatures } from '@/services/subscription.service';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Crown, Zap, Star, Clock, Download, AlertTriangle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

// Helper to convert features object to displayable array
const getFeaturesList = (features: PlanFeatures, t: (key: string) => string): string[] => {
  const list: string[] = [];

  // Appointments
  if (features.maxAppointmentsPerMonth === -1) {
    list.push(t('subscription.feature.unlimitedAppointments'));
  } else {
    list.push(`${features.maxAppointmentsPerMonth} ${t('subscription.feature.appointmentsMonth')}`);
  }

  // Services
  if (features.maxServices === -1) {
    list.push(t('subscription.feature.unlimitedServices'));
  } else {
    list.push(`${features.maxServices} ${t('subscription.feature.services')}`);
  }

  // Boolean features
  if (features.promotions) list.push(t('subscription.feature.promos'));
  if (features.waitlist) list.push(t('subscription.feature.waitlist'));
  if (features.loyaltyProgram) list.push(t('subscription.feature.loyalty'));
  if (features.prioritySupport) list.push(t('subscription.feature.prioritySupport'));
  if (features.productSales) list.push(t('subscription.feature.productSales'));
  if (features.socialMediaPosting) list.push(t('subscription.feature.socialMedia'));
  if (features.customBranding) list.push(t('subscription.feature.customBranding'));
  if (features.analytics === 'advanced') list.push(t('subscription.feature.advancedAnalytics'));

  return list;
};

// Mock data for development (matching backend format)
const mockPlans: SubscriptionPlan[] = [
  {
    id: 'free_trial',
    name: 'Free Trial',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: {
      maxServices: 5,
      maxAppointmentsPerMonth: 50,
      analytics: 'basic',
      loyaltyProgram: false,
      socialMediaPosting: false,
      productSales: false,
      prioritySupport: false,
      customBranding: false,
      promotions: false,
      waitlist: false,
    },
    isPopular: false,
  },
  {
    id: 'basic',
    name: 'Basic',
    monthlyPrice: 19,
    yearlyPrice: 190,
    features: {
      maxServices: 10,
      maxAppointmentsPerMonth: 150,
      analytics: 'basic',
      loyaltyProgram: false,
      socialMediaPosting: false,
      productSales: false,
      prioritySupport: false,
      customBranding: false,
      promotions: true,
      waitlist: true,
    },
    isPopular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: {
      maxServices: 25,
      maxAppointmentsPerMonth: 500,
      analytics: 'advanced',
      loyaltyProgram: true,
      socialMediaPosting: false,
      productSales: false,
      prioritySupport: true,
      customBranding: true,
      promotions: true,
      waitlist: true,
    },
    isPopular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    monthlyPrice: 49,
    yearlyPrice: 490,
    features: {
      maxServices: -1,
      maxAppointmentsPerMonth: -1,
      analytics: 'advanced',
      loyaltyProgram: true,
      socialMediaPosting: true,
      productSales: true,
      prioritySupport: true,
      customBranding: true,
      promotions: true,
      waitlist: true,
    },
    isPopular: false,
  },
];

const mockSubscription: SubscriptionType = {
  id: 'sub_1',
  planId: 'free_trial',
  plan: mockPlans[0],
  status: 'active',
  billingCycle: 'monthly',
  currentPeriodStart: '2024-11-01',
  currentPeriodEnd: '2024-12-31',
  trialEndsAt: '2024-12-31',
  appointmentsUsed: 23,
  appointmentsLimit: 50,
};

const mockInvoices: Invoice[] = [
  { id: 'inv_1', amount: 0, status: 'paid', createdAt: '2024-11-01', paidAt: '2024-11-01', description: 'Free Trial - November 2024', downloadUrl: '#' },
];

const Subscription = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [yearlyBilling, setYearlyBilling] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  // Queries with mock data fallback
  const { data: plans = mockPlans, isLoading: plansLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: subscriptionService.getPlans,
    retry: false,
    staleTime: 1000 * 60 * 10,
  });

  const { data: currentSubscription = mockSubscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['current-subscription'],
    queryFn: subscriptionService.getCurrentSubscription,
    retry: false,
  });

  const { data: invoices = mockInvoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: subscriptionService.getInvoices,
    retry: false,
  });

  // Mutations
  const subscribeMutation = useMutation({
    mutationFn: ({ planId, billingCycle }: { planId: string; billingCycle: 'monthly' | 'yearly' }) =>
      subscriptionService.subscribe(planId, billingCycle),
    onSuccess: (data) => {
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        queryClient.invalidateQueries({ queryKey: ['current-subscription'] });
        toast({ title: t('subscription.success'), description: data.message });
      }
    },
    onError: () => {
      toast({ title: t('common.error'), variant: 'destructive' });
    },
  });

  const changePlanMutation = useMutation({
    mutationFn: ({ planId, billingCycle }: { planId: string; billingCycle: 'monthly' | 'yearly' }) =>
      subscriptionService.changePlan(planId, billingCycle),
    onSuccess: (data) => {
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        queryClient.invalidateQueries({ queryKey: ['current-subscription'] });
        toast({ title: t('subscription.planChanged'), description: data.message });
      }
    },
    onError: () => {
      toast({ title: t('common.error'), variant: 'destructive' });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: subscriptionService.cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-subscription'] });
      setCancelDialogOpen(false);
      toast({ title: t('subscription.cancelled') });
    },
    onError: () => {
      toast({ title: t('common.error'), variant: 'destructive' });
    },
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      active: { variant: 'default', label: t('subscription.statusActive') },
      cancelled: { variant: 'secondary', label: t('subscription.statusCancelled') },
      expired: { variant: 'destructive', label: t('subscription.statusExpired') },
      past_due: { variant: 'destructive', label: t('subscription.statusPastDue') },
    };
    const config = variants[status] || { variant: 'outline', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPlanIcon = (name: string) => {
    const normalizedName = name.toLowerCase().replace(' ', '_');
    switch (normalizedName) {
      case 'free_trial': return <Clock className="h-6 w-6" />;
      case 'basic': return <Zap className="h-6 w-6" />;
      case 'pro': return <Star className="h-6 w-6" />;
      case 'premium': return <Crown className="h-6 w-6" />;
      default: return <Zap className="h-6 w-6" />;
    }
  };

  // Helper to get plan translation key from name
  const getPlanTranslationKey = (name: string) => {
    const normalizedName = name.toLowerCase().replace(' ', '_');
    return `subscription.plan.${normalizedName}`;
  };

  const trialDaysRemaining = currentSubscription?.trialEndsAt
    ? Math.max(0, differenceInDays(new Date(currentSubscription.trialEndsAt), new Date()))
    : 0;

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (currentSubscription?.planId === plan.id) return;
    setSelectedPlan(plan);
    
    const billingCycle = yearlyBilling ? 'yearly' : 'monthly';
    if (currentSubscription?.planId === 'free_trial') {
      subscribeMutation.mutate({ planId: plan.id, billingCycle });
    } else {
      changePlanMutation.mutate({ planId: plan.id, billingCycle });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{t('subscription.title')}</h1>
          <p className="text-muted-foreground mb-8">{t('subscription.subtitle')}</p>

          <Tabs defaultValue="plans" className="space-y-6">
            <TabsList>
              <TabsTrigger value="plans">{t('subscription.plans')}</TabsTrigger>
              <TabsTrigger value="invoices">{t('subscription.invoices')}</TabsTrigger>
            </TabsList>

            <TabsContent value="plans" className="space-y-6">
              {/* Current Plan Status */}
              {subscriptionLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : currentSubscription && (
                <Card className="border-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getPlanIcon(currentSubscription.plan.name)}
                        <div>
                          <CardTitle className="capitalize">{t(`subscription.plan.${currentSubscription.plan.name}`)}</CardTitle>
                          <CardDescription>{t('subscription.currentPlan')}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(currentSubscription.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {currentSubscription.trialEndsAt && trialDaysRemaining > 0 && (
                        <div className="bg-amber-500/10 rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">{t('subscription.trialRemaining')}</p>
                          <p className="text-2xl font-bold text-amber-600">{trialDaysRemaining} {t('subscription.days')}</p>
                        </div>
                      )}
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">{t('subscription.appointmentsUsed')}</p>
                        <p className="text-2xl font-bold">
                          {currentSubscription.appointmentsUsed} / {currentSubscription.appointmentsLimit || '∞'}
                        </p>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">{t('subscription.nextBilling')}</p>
                        <p className="text-lg font-semibold">
                          {format(new Date(currentSubscription.currentPeriodEnd), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  {currentSubscription.status === 'active' && currentSubscription.plan.name !== 'free_trial' && (
                    <CardFooter>
                      <Button variant="outline" onClick={() => setCancelDialogOpen(true)}>
                        {t('subscription.cancelPlan')}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              )}

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4">
                <Label htmlFor="billing-toggle" className={!yearlyBilling ? 'font-semibold' : ''}>
                  {t('subscription.monthly')}
                </Label>
                <Switch
                  id="billing-toggle"
                  checked={yearlyBilling}
                  onCheckedChange={setYearlyBilling}
                />
                <Label htmlFor="billing-toggle" className={yearlyBilling ? 'font-semibold' : ''}>
                  {t('subscription.yearly')}
                  <Badge variant="secondary" className="ml-2">{t('subscription.save2Months')}</Badge>
                </Label>
              </div>

              {/* Plan Cards */}
              {plansLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-96" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {plans.map((plan) => {
                    const isCurrent = currentSubscription?.planId === plan.id;
                    const price = yearlyBilling ? plan.yearlyPrice : plan.monthlyPrice;
                    const isPopular = plan.isPopular || plan.name === 'Pro';
                    const featuresList = getFeaturesList(plan.features, t);

                    return (
                      <Card key={plan.id} className={`relative ${isPopular ? 'border-primary shadow-lg' : ''} ${isCurrent ? 'ring-2 ring-primary' : ''}`}>
                        {isPopular && (
                          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                            {t('subscription.popular')}
                          </Badge>
                        )}
                        <CardHeader className="text-center">
                          <div className="mx-auto mb-2 text-primary">{getPlanIcon(plan.name)}</div>
                          <CardTitle>{t(getPlanTranslationKey(plan.name)) || plan.name}</CardTitle>
                          <div className="mt-4">
                            <span className="text-4xl font-bold">€{price}</span>
                            {plan.id !== 'free_trial' && (
                              <span className="text-muted-foreground">/{yearlyBilling ? t('subscription.year') : t('subscription.month')}</span>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {featuresList.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500 shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                            {/* Show what's not included */}
                            {!plan.features.promotions && <li className="flex items-center gap-2 text-muted-foreground"><X className="h-4 w-4" /><span className="text-sm">{t('subscription.feature.promos')}</span></li>}
                            {!plan.features.loyaltyProgram && <li className="flex items-center gap-2 text-muted-foreground"><X className="h-4 w-4" /><span className="text-sm">{t('subscription.feature.loyalty')}</span></li>}
                            {!plan.features.productSales && <li className="flex items-center gap-2 text-muted-foreground"><X className="h-4 w-4" /><span className="text-sm">{t('subscription.feature.productSales')}</span></li>}
                          </ul>
                        </CardContent>
                        <CardFooter>
                          <Button
                            className="w-full"
                            variant={isCurrent ? 'outline' : isPopular ? 'default' : 'secondary'}
                            disabled={isCurrent || subscribeMutation.isPending || changePlanMutation.isPending}
                            onClick={() => handleSelectPlan(plan)}
                          >
                            {isCurrent ? t('subscription.currentPlan') : t('subscription.selectPlan')}
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="invoices">
              <Card>
                <CardHeader>
                  <CardTitle>{t('subscription.invoiceHistory')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {invoicesLoading ? (
                    <Skeleton className="h-48" />
                  ) : invoices.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">{t('subscription.noInvoices')}</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('subscription.invoiceDate')}</TableHead>
                          <TableHead>{t('subscription.invoiceDescription')}</TableHead>
                          <TableHead>{t('subscription.invoiceAmount')}</TableHead>
                          <TableHead>{t('subscription.invoiceStatus')}</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell>{format(new Date(invoice.createdAt), 'MMM d, yyyy')}</TableCell>
                            <TableCell>{invoice.description}</TableCell>
                            <TableCell>€{invoice.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant={invoice.status === 'paid' ? 'default' : invoice.status === 'pending' ? 'secondary' : 'destructive'}>
                                {invoice.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {invoice.downloadUrl && (
                                <Button variant="ghost" size="sm" asChild>
                                  <a href={invoice.downloadUrl} download>
                                    <Download className="h-4 w-4" />
                                  </a>
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Cancel Subscription Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {t('subscription.cancelTitle')}
            </DialogTitle>
            <DialogDescription>{t('subscription.cancelDescription')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              {t('subscription.keepPlan')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? t('common.loading') : t('subscription.confirmCancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Subscription;
