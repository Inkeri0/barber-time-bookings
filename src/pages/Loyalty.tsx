import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { loyaltyService, LoyaltyMembership, LoyaltyTransaction, LoyaltyReward } from '@/services/loyalty.service';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Crown, Star, Gift, History, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

// Mock data
const mockMemberships: LoyaltyMembership[] = [
  {
    id: '1',
    barberId: 'b1',
    barberName: 'Classic Cuts Amsterdam',
    barberImage: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=100',
    tier: 'gold',
    points: 450,
    nextTierPoints: 600,
    discountPercentage: 10,
    hasPriorityBooking: true,
  },
  {
    id: '2',
    barberId: 'b2',
    barberName: 'Modern Barber Rotterdam',
    barberImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=100',
    tier: 'silver',
    points: 180,
    nextTierPoints: 300,
    discountPercentage: 5,
    hasPriorityBooking: false,
  },
];

const mockTransactions: LoyaltyTransaction[] = [
  { id: '1', type: 'earned', points: 25, description: 'Haircut service', createdAt: '2024-11-15' },
  { id: '2', type: 'bonus', points: 50, description: 'Welcome bonus', createdAt: '2024-11-01' },
  { id: '3', type: 'earned', points: 35, description: 'Haircut + Beard trim', createdAt: '2024-10-20' },
  { id: '4', type: 'redeemed', points: -100, description: '10% discount redeemed', createdAt: '2024-10-15' },
];

const mockRewards: LoyaltyReward[] = [
  { id: '1', name: 'Free Beard Trim', description: 'Get a free beard trim with your next haircut', pointsCost: 200, type: 'free_service', value: 15 },
  { id: '2', name: '20% Off', description: '20% off any service', pointsCost: 300, type: 'discount', value: 20 },
  { id: '3', name: 'Premium Pomade', description: 'Free premium pomade product', pointsCost: 400, type: 'product', value: 25 },
];

const tierColors = {
  bronze: 'text-amber-700 bg-amber-100',
  silver: 'text-gray-600 bg-gray-200',
  gold: 'text-yellow-600 bg-yellow-100',
  platinum: 'text-purple-600 bg-purple-100',
};

const tierThresholds = { bronze: 0, silver: 100, gold: 300, platinum: 600 };

const Loyalty = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: memberships = mockMemberships, isLoading } = useQuery({
    queryKey: ['loyalty-memberships'],
    queryFn: loyaltyService.getAllMemberships,
    retry: false,
  });

  const redeemMutation = useMutation({
    mutationFn: ({ barberId, rewardId }: { barberId: string; rewardId: string }) =>
      loyaltyService.redeemReward(barberId, rewardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-memberships'] });
      toast({ title: t('loyalty.rewardRedeemed') });
    },
    onError: () => {
      toast({ title: t('common.error'), variant: 'destructive' });
    },
  });

  const getTierProgress = (membership: LoyaltyMembership) => {
    const currentTierMin = tierThresholds[membership.tier];
    const range = membership.nextTierPoints - currentTierMin;
    const progress = membership.points - currentTierMin;
    return Math.min(100, (progress / range) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{t('loyalty.title')}</h1>
          <p className="text-muted-foreground mb-8">{t('loyalty.subtitle')}</p>

          {/* Tier Benefits Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                {t('loyalty.tierBenefits')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['bronze', 'silver', 'gold', 'platinum'] as const).map((tier) => (
                  <div key={tier} className={`rounded-lg p-4 ${tierColors[tier]}`}>
                    <p className="font-semibold capitalize">{t(`loyalty.tier.${tier}`)}</p>
                    <p className="text-sm">{tierThresholds[tier]}+ {t('loyalty.points')}</p>
                    <p className="text-xs mt-2">
                      {tier === 'bronze' && t('loyalty.bronzeBenefit')}
                      {tier === 'silver' && '5% ' + t('loyalty.discount')}
                      {tier === 'gold' && '10% + ' + t('loyalty.priority')}
                      {tier === 'platinum' && '15% + ' + t('loyalty.allBenefits')}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {memberships.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Crown className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('loyalty.noMemberships')}</h3>
                <p className="text-muted-foreground mb-4">{t('loyalty.noMembershipsDesc')}</p>
                <Button asChild>
                  <Link to="/barbers">{t('loyalty.findBarbers')}</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {memberships.map((membership) => (
                <Card key={membership.id}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={membership.barberImage} />
                        <AvatarFallback>{membership.barberName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Link to={`/barbers/${membership.barberId}`} className="hover:underline">
                            {membership.barberName}
                          </Link>
                          <Badge className={tierColors[membership.tier]}>
                            {t(`loyalty.tier.${membership.tier}`)}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {membership.discountPercentage}% {t('loyalty.discount')}
                          {membership.hasPriorityBooking && ` • ${t('loyalty.priority')}`}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">{membership.points}</p>
                        <p className="text-sm text-muted-foreground">{t('loyalty.points')}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{t('loyalty.nextTier')}</span>
                        <span>{membership.nextTierPoints} {t('loyalty.points')}</span>
                      </div>
                      <Progress value={getTierProgress(membership)} />
                    </div>

                    <Tabs defaultValue="rewards">
                      <TabsList className="w-full">
                        <TabsTrigger value="rewards" className="flex-1">
                          <Gift className="h-4 w-4 mr-2" />
                          {t('loyalty.rewards')}
                        </TabsTrigger>
                        <TabsTrigger value="history" className="flex-1">
                          <History className="h-4 w-4 mr-2" />
                          {t('loyalty.history')}
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="rewards" className="mt-4">
                        <div className="grid gap-3">
                          {mockRewards.map((reward) => (
                            <div key={reward.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div>
                                <p className="font-medium">{reward.name}</p>
                                <p className="text-sm text-muted-foreground">{reward.description}</p>
                              </div>
                              <Button
                                size="sm"
                                disabled={membership.points < reward.pointsCost || redeemMutation.isPending}
                                onClick={() => redeemMutation.mutate({ barberId: membership.barberId, rewardId: reward.id })}
                              >
                                {reward.pointsCost} {t('loyalty.pts')}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      <TabsContent value="history" className="mt-4">
                        <div className="space-y-2">
                          {mockTransactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div>
                                <p className="font-medium">{tx.description}</p>
                                <p className="text-sm text-muted-foreground">
                                  {format(new Date(tx.createdAt), 'MMM d, yyyy')}
                                </p>
                              </div>
                              <span className={`font-semibold ${tx.points > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {tx.points > 0 ? '+' : ''}{tx.points}
                              </span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Loyalty;
