import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { loyaltyService, LoyaltySettings, LoyaltyMember, LoyaltyReward } from '@/services/loyalty.service';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Settings, Users, Gift, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

// Mock data
const mockSettings: LoyaltySettings = {
  isEnabled: true,
  pointsPerEuro: 1,
  welcomeBonus: 50,
  tierThresholds: { silver: 100, gold: 300, platinum: 600 },
  rewards: [
    { id: '1', name: 'Free Beard Trim', description: 'Free beard trim', pointsCost: 200, type: 'free_service', value: 15 },
    { id: '2', name: '20% Off', description: '20% discount', pointsCost: 300, type: 'discount', value: 20 },
  ],
};

const mockMembers: LoyaltyMember[] = [
  { id: '1', customerId: 'c1', customerName: 'John Doe', customerEmail: 'john@email.com', tier: 'gold', points: 450, totalSpent: 890, lastVisit: '2024-11-15' },
  { id: '2', customerId: 'c2', customerName: 'Jane Smith', customerEmail: 'jane@email.com', tier: 'silver', points: 180, totalSpent: 340, lastVisit: '2024-11-10' },
  { id: '3', customerId: 'c3', customerName: 'Mike Brown', customerEmail: 'mike@email.com', tier: 'bronze', points: 50, totalSpent: 75, lastVisit: '2024-11-01' },
];

const tierColors = {
  bronze: 'bg-amber-100 text-amber-700',
  silver: 'bg-gray-200 text-gray-700',
  gold: 'bg-yellow-100 text-yellow-700',
  platinum: 'bg-purple-100 text-purple-700',
};

const LoyaltySettingsPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<LoyaltySettings>(mockSettings);
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false);
  const [newReward, setNewReward] = useState<Partial<LoyaltyReward>>({ type: 'discount' });
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<LoyaltyMember | null>(null);
  const [adjustPoints, setAdjustPoints] = useState('');
  const [adjustReason, setAdjustReason] = useState('');

  const { data: fetchedSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['loyalty-settings'],
    queryFn: loyaltyService.getSettings,
    retry: false,
  });

  const { data: members = mockMembers, isLoading: membersLoading } = useQuery({
    queryKey: ['loyalty-members'],
    queryFn: loyaltyService.getMembers,
    retry: false,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: Partial<LoyaltySettings>) => loyaltyService.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-settings'] });
      toast({ title: t('loyalty.settingsSaved') });
    },
    onError: () => {
      toast({ title: t('common.error'), variant: 'destructive' });
    },
  });

  const createRewardMutation = useMutation({
    mutationFn: (reward: Omit<LoyaltyReward, 'id'>) => loyaltyService.createReward(reward),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-settings'] });
      setRewardDialogOpen(false);
      setNewReward({ type: 'discount' });
      toast({ title: t('loyalty.rewardCreated') });
    },
    onError: () => {
      toast({ title: t('common.error'), variant: 'destructive' });
    },
  });

  const deleteRewardMutation = useMutation({
    mutationFn: (id: string) => loyaltyService.deleteReward(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-settings'] });
      toast({ title: t('loyalty.rewardDeleted') });
    },
    onError: () => {
      toast({ title: t('common.error'), variant: 'destructive' });
    },
  });

  const adjustPointsMutation = useMutation({
    mutationFn: ({ memberId, points, reason }: { memberId: string; points: number; reason: string }) =>
      loyaltyService.adjustPoints(memberId, points, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-members'] });
      setAdjustDialogOpen(false);
      setSelectedMember(null);
      setAdjustPoints('');
      setAdjustReason('');
      toast({ title: t('loyalty.pointsAdjusted') });
    },
    onError: () => {
      toast({ title: t('common.error'), variant: 'destructive' });
    },
  });

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(settings);
  };

  const handleCreateReward = () => {
    if (newReward.name && newReward.pointsCost && newReward.type) {
      createRewardMutation.mutate(newReward as Omit<LoyaltyReward, 'id'>);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{t('loyalty.settingsTitle')}</h1>
          <p className="text-muted-foreground mb-8">{t('loyalty.settingsSubtitle')}</p>

          <Tabs defaultValue="settings" className="space-y-6">
            <TabsList>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-2" />
                {t('loyalty.settings')}
              </TabsTrigger>
              <TabsTrigger value="rewards">
                <Gift className="h-4 w-4 mr-2" />
                {t('loyalty.rewards')}
              </TabsTrigger>
              <TabsTrigger value="members">
                <Users className="h-4 w-4 mr-2" />
                {t('loyalty.members')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings">
              {settingsLoading ? (
                <Skeleton className="h-96" />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('loyalty.programSettings')}</CardTitle>
                    <CardDescription>{t('loyalty.programSettingsDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>{t('loyalty.enableProgram')}</Label>
                        <p className="text-sm text-muted-foreground">{t('loyalty.enableProgramDesc')}</p>
                      </div>
                      <Switch
                        checked={settings.isEnabled}
                        onCheckedChange={(checked) => setSettings({ ...settings, isEnabled: checked })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t('loyalty.pointsPerEuro')}</Label>
                        <Input
                          type="number"
                          value={settings.pointsPerEuro}
                          onChange={(e) => setSettings({ ...settings, pointsPerEuro: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t('loyalty.welcomeBonus')}</Label>
                        <Input
                          type="number"
                          value={settings.welcomeBonus}
                          onChange={(e) => setSettings({ ...settings, welcomeBonus: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">{t('loyalty.tierThresholds')}</Label>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">{t('loyalty.tier.silver')}</Label>
                          <Input
                            type="number"
                            value={settings.tierThresholds.silver}
                            onChange={(e) => setSettings({
                              ...settings,
                              tierThresholds: { ...settings.tierThresholds, silver: Number(e.target.value) }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">{t('loyalty.tier.gold')}</Label>
                          <Input
                            type="number"
                            value={settings.tierThresholds.gold}
                            onChange={(e) => setSettings({
                              ...settings,
                              tierThresholds: { ...settings.tierThresholds, gold: Number(e.target.value) }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">{t('loyalty.tier.platinum')}</Label>
                          <Input
                            type="number"
                            value={settings.tierThresholds.platinum}
                            onChange={(e) => setSettings({
                              ...settings,
                              tierThresholds: { ...settings.tierThresholds, platinum: Number(e.target.value) }
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleSaveSettings} disabled={updateSettingsMutation.isPending}>
                      {updateSettingsMutation.isPending ? t('common.loading') : t('common.save')}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="rewards">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{t('loyalty.rewardsCatalog')}</CardTitle>
                    <CardDescription>{t('loyalty.rewardsCatalogDesc')}</CardDescription>
                  </div>
                  <Button onClick={() => setRewardDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('loyalty.addReward')}
                  </Button>
                </CardHeader>
                <CardContent>
                  {settings.rewards.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">{t('loyalty.noRewards')}</p>
                  ) : (
                    <div className="space-y-3">
                      {settings.rewards.map((reward) => (
                        <div key={reward.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium">{reward.name}</p>
                            <p className="text-sm text-muted-foreground">{reward.description}</p>
                            <Badge variant="outline" className="mt-1">{reward.pointsCost} points</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteRewardMutation.mutate(reward.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="members">
              <Card>
                <CardHeader>
                  <CardTitle>{t('loyalty.membersList')}</CardTitle>
                  <CardDescription>{t('loyalty.membersListDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  {membersLoading ? (
                    <Skeleton className="h-48" />
                  ) : members.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">{t('loyalty.noMembers')}</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('loyalty.customer')}</TableHead>
                          <TableHead>{t('loyalty.tier')}</TableHead>
                          <TableHead>{t('loyalty.points')}</TableHead>
                          <TableHead>{t('loyalty.totalSpent')}</TableHead>
                          <TableHead>{t('loyalty.lastVisit')}</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {members.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{member.customerName}</p>
                                <p className="text-sm text-muted-foreground">{member.customerEmail}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={tierColors[member.tier]}>{member.tier}</Badge>
                            </TableCell>
                            <TableCell>{member.points}</TableCell>
                            <TableCell>€{member.totalSpent}</TableCell>
                            <TableCell>{format(new Date(member.lastVisit), 'MMM d, yyyy')}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedMember(member);
                                  setAdjustDialogOpen(true);
                                }}
                              >
                                {t('loyalty.adjustPoints')}
                              </Button>
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

      {/* Add Reward Dialog */}
      <Dialog open={rewardDialogOpen} onOpenChange={setRewardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('loyalty.addReward')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('loyalty.rewardName')}</Label>
              <Input
                value={newReward.name || ''}
                onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('loyalty.rewardDescription')}</Label>
              <Input
                value={newReward.description || ''}
                onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('loyalty.rewardType')}</Label>
              <Select
                value={newReward.type}
                onValueChange={(value) => setNewReward({ ...newReward, type: value as LoyaltyReward['type'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount">{t('loyalty.typeDiscount')}</SelectItem>
                  <SelectItem value="free_service">{t('loyalty.typeFreeService')}</SelectItem>
                  <SelectItem value="product">{t('loyalty.typeProduct')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('loyalty.pointsCost')}</Label>
                <Input
                  type="number"
                  value={newReward.pointsCost || ''}
                  onChange={(e) => setNewReward({ ...newReward, pointsCost: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('loyalty.rewardValue')}</Label>
                <Input
                  type="number"
                  value={newReward.value || ''}
                  onChange={(e) => setNewReward({ ...newReward, value: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRewardDialogOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleCreateReward} disabled={createRewardMutation.isPending}>
              {createRewardMutation.isPending ? t('common.loading') : t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adjust Points Dialog */}
      <Dialog open={adjustDialogOpen} onOpenChange={setAdjustDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('loyalty.adjustPoints')} - {selectedMember?.customerName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('loyalty.pointsToAdjust')}</Label>
              <Input
                type="number"
                placeholder="+50 or -25"
                value={adjustPoints}
                onChange={(e) => setAdjustPoints(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('loyalty.reason')}</Label>
              <Input
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder={t('loyalty.reasonPlaceholder')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustDialogOpen(false)}>{t('common.cancel')}</Button>
            <Button
              onClick={() => {
                if (selectedMember && adjustPoints) {
                  adjustPointsMutation.mutate({
                    memberId: selectedMember.id,
                    points: Number(adjustPoints),
                    reason: adjustReason,
                  });
                }
              }}
              disabled={adjustPointsMutation.isPending}
            >
              {adjustPointsMutation.isPending ? t('common.loading') : t('common.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default LoyaltySettingsPage;
