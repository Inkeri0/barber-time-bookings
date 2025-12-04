import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { referralService, ReferralCode, Referral, ReferralReward, LeaderboardEntry } from '@/services/referral.service';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Copy, Share2, Gift, Users, Trophy, Check, Scissors } from 'lucide-react';
import { format } from 'date-fns';

// Mock data
const mockCode: ReferralCode = {
  code: 'JOHN2024',
  shareUrl: 'https://barbertime.nl/join/JOHN2024',
  totalReferrals: 7,
  completedReferrals: 5,
};

const mockReferrals: Referral[] = [
  { id: '1', referredEmail: 'friend1@email.com', status: 'completed', createdAt: '2024-10-15', completedAt: '2024-10-20' },
  { id: '2', referredEmail: 'friend2@email.com', status: 'completed', createdAt: '2024-10-18', completedAt: '2024-10-25' },
  { id: '3', referredEmail: 'friend3@email.com', status: 'pending', createdAt: '2024-11-01' },
  { id: '4', referredEmail: 'friend4@email.com', status: 'completed', createdAt: '2024-11-05', completedAt: '2024-11-10' },
  { id: '5', referredEmail: 'friend5@email.com', status: 'expired', createdAt: '2024-09-01' },
];

const mockRewards: ReferralReward[] = [
  { id: '1', type: 'discount', value: 5, description: '5% discount earned', isRedeemed: true },
  { id: '2', type: 'discount', value: 5, description: '5% discount earned', isRedeemed: false, expiresAt: '2025-01-01' },
  { id: '3', type: 'discount', value: 5, description: '5% discount earned', isRedeemed: false, expiresAt: '2025-02-01' },
];

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Mike S.', referrals: 45, isCurrentUser: false },
  { rank: 2, name: 'Sarah L.', referrals: 38, isCurrentUser: false },
  { rank: 3, name: 'Tom B.', referrals: 32, isCurrentUser: false },
  { rank: 4, name: 'You', referrals: 5, isCurrentUser: true },
  { rank: 5, name: 'Emma K.', referrals: 4, isCurrentUser: false },
];

const Referrals = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);

  const { data: code = mockCode, isLoading: codeLoading } = useQuery({
    queryKey: ['referral-code'],
    queryFn: referralService.getMyCode,
    retry: false,
  });

  const { data: referrals = mockReferrals } = useQuery({
    queryKey: ['my-referrals'],
    queryFn: referralService.getMyReferrals,
    retry: false,
  });

  const { data: rewards = mockRewards } = useQuery({
    queryKey: ['referral-rewards'],
    queryFn: referralService.getRewards,
    retry: false,
  });

  const { data: leaderboard = mockLeaderboard } = useQuery({
    queryKey: ['referral-leaderboard'],
    queryFn: referralService.getLeaderboard,
    retry: false,
  });

  const redeemMutation = useMutation({
    mutationFn: (rewardId: string) => referralService.useReward(rewardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referral-rewards'] });
      toast({ title: t('referral.rewardRedeemed') });
    },
    onError: () => {
      toast({ title: t('common.error'), variant: 'destructive' });
    },
  });

  const copyCode = () => {
    navigator.clipboard.writeText(code.shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: t('referral.copied') });
  };

  const shareCode = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Join BarberTime',
        text: t('referral.shareText'),
        url: code.shareUrl,
      });
    } else {
      copyCode();
    }
  };

  const progressToFreeHaircut = (code.completedReferrals / 10) * 100;

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
      pending: { variant: 'secondary', label: t('referral.statusPending') },
      completed: { variant: 'default', label: t('referral.statusCompleted') },
      expired: { variant: 'destructive', label: t('referral.statusExpired') },
    };
    const c = config[status] || { variant: 'secondary', label: status };
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{t('referral.title')}</h1>
          <p className="text-muted-foreground mb-8">{t('referral.subtitle')}</p>

          {/* Referral Code Card */}
          {codeLoading ? (
            <Skeleton className="h-48 mb-6" />
          ) : (
            <Card className="mb-6 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  {t('referral.yourCode')}
                </CardTitle>
                <CardDescription>{t('referral.shareDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 bg-muted rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold tracking-wider">{code.code}</p>
                    <p className="text-sm text-muted-foreground mt-1">{code.shareUrl}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={copyCode} variant="outline">
                      {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {copied ? t('referral.copied') : t('referral.copy')}
                    </Button>
                    <Button onClick={shareCode}>
                      <Share2 className="h-4 w-4 mr-2" />
                      {t('referral.share')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress to Free Haircut */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scissors className="h-5 w-5" />
                {t('referral.freeHaircut')}
              </CardTitle>
              <CardDescription>{t('referral.freeHaircutDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{code.completedReferrals} / 10 {t('referral.referrals')}</span>
                  <span>€30 {t('referral.value')}</span>
                </div>
                <Progress value={progressToFreeHaircut} className="h-3" />
                {code.completedReferrals >= 10 && (
                  <p className="text-green-500 font-medium">{t('referral.claimFree')}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="referrals" className="space-y-6">
            <TabsList>
              <TabsTrigger value="referrals">
                <Users className="h-4 w-4 mr-2" />
                {t('referral.myReferrals')}
              </TabsTrigger>
              <TabsTrigger value="rewards">
                <Gift className="h-4 w-4 mr-2" />
                {t('referral.rewards')}
              </TabsTrigger>
              <TabsTrigger value="leaderboard">
                <Trophy className="h-4 w-4 mr-2" />
                {t('referral.leaderboard')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="referrals">
              <Card>
                <CardHeader>
                  <CardTitle>{t('referral.myReferrals')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {referrals.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">{t('referral.noReferrals')}</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('referral.email')}</TableHead>
                          <TableHead>{t('referral.status')}</TableHead>
                          <TableHead>{t('referral.date')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {referrals.map((ref) => (
                          <TableRow key={ref.id}>
                            <TableCell>{ref.referredEmail}</TableCell>
                            <TableCell>{getStatusBadge(ref.status)}</TableCell>
                            <TableCell>{format(new Date(ref.createdAt), 'MMM d, yyyy')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rewards">
              <Card>
                <CardHeader>
                  <CardTitle>{t('referral.rewards')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {rewards.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">{t('referral.noRewards')}</p>
                  ) : (
                    <div className="space-y-4">
                      {rewards.map((reward) => (
                        <div key={reward.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium">{reward.description}</p>
                            {reward.expiresAt && (
                              <p className="text-sm text-muted-foreground">
                                {t('referral.expires')}: {format(new Date(reward.expiresAt), 'MMM d, yyyy')}
                              </p>
                            )}
                          </div>
                          {reward.isRedeemed ? (
                            <Badge variant="secondary">{t('referral.redeemed')}</Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => redeemMutation.mutate(reward.id)}
                              disabled={redeemMutation.isPending}
                            >
                              {t('referral.redeem')}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leaderboard">
              <Card>
                <CardHeader>
                  <CardTitle>{t('referral.leaderboard')}</CardTitle>
                  <CardDescription>{t('referral.leaderboardDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {leaderboard.map((entry) => (
                      <div
                        key={entry.rank}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          entry.isCurrentUser ? 'bg-primary/10 border border-primary' : 'bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`text-2xl font-bold ${entry.rank <= 3 ? 'text-amber-500' : ''}`}>
                            #{entry.rank}
                          </span>
                          <span className="font-medium">{entry.name}</span>
                          {entry.isCurrentUser && <Badge>{t('referral.you')}</Badge>}
                        </div>
                        <span className="font-semibold">{entry.referrals} {t('referral.referrals')}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Referrals;
