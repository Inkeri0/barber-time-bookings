import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { promotionService, Promotion, PromoType, DiscountType } from '@/services/promotion.service';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Zap, Pause, Play, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const mockPromos: Promotion[] = [
  { id: '1', name: 'Summer Sale', description: '20% off all services', type: 'seasonal', discountType: 'percentage', discountValue: 20, validFrom: '2024-11-01', validTo: '2024-12-31', usageCount: 45, isActive: true, createdAt: '2024-10-15' },
  { id: '2', name: 'Last Minute Deal', description: '€5 off today only', type: 'last_minute', discountType: 'fixed', discountValue: 5, validFrom: '2024-11-15', validTo: '2024-11-15', usageCount: 8, isActive: true, createdAt: '2024-11-15' },
];

const Promotions = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newPromo, setNewPromo] = useState<Partial<Promotion>>({ type: 'seasonal', discountType: 'percentage', isActive: true });

  const { data: promotions = mockPromos } = useQuery({
    queryKey: ['my-promotions'],
    queryFn: promotionService.getMyPromotions,
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Promotion, 'id' | 'usageCount' | 'createdAt'>) => promotionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-promotions'] });
      setCreateDialogOpen(false);
      toast({ title: t('promo.created') });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => promotionService.toggle(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-promotions'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => promotionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-promotions'] });
      toast({ title: t('promo.deleted') });
    },
  });

  const lastMinuteMutation = useMutation({
    mutationFn: () => promotionService.createLastMinute({ discountValue: 15, discountType: 'percentage', validHours: 4 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-promotions'] });
      toast({ title: t('promo.lastMinuteCreated') });
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">{t('promo.title')}</h1>
              <p className="text-muted-foreground">{t('promo.subtitle')}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => lastMinuteMutation.mutate()}>
                <Zap className="h-4 w-4 mr-2" />{t('promo.lastMinute')}
              </Button>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />{t('promo.create')}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {promotions.map((promo) => (
              <Card key={promo.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {promo.name}
                      <Badge variant={promo.isActive ? 'default' : 'secondary'}>
                        {promo.isActive ? t('promo.active') : t('promo.paused')}
                      </Badge>
                      <Badge variant="outline">{promo.type}</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{promo.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => toggleMutation.mutate(promo.id)}>
                      {promo.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(promo.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-6 text-sm">
                    <div><span className="text-muted-foreground">{t('promo.discount')}:</span> {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `€${promo.discountValue}`}</div>
                    <div><span className="text-muted-foreground">{t('promo.uses')}:</span> {promo.usageCount}{promo.usageLimit ? `/${promo.usageLimit}` : ''}</div>
                    <div><span className="text-muted-foreground">{t('promo.valid')}:</span> {format(new Date(promo.validFrom), 'MMM d')} - {format(new Date(promo.validTo), 'MMM d, yyyy')}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t('promo.createNew')}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('promo.name')}</Label>
              <Input value={newPromo.name || ''} onChange={(e) => setNewPromo({ ...newPromo, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t('promo.description')}</Label>
              <Input value={newPromo.description || ''} onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('promo.discountType')}</Label>
                <Select value={newPromo.discountType} onValueChange={(v) => setNewPromo({ ...newPromo, discountType: v as DiscountType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">{t('promo.percentage')}</SelectItem>
                    <SelectItem value="fixed">{t('promo.fixed')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('promo.discountValue')}</Label>
                <Input type="number" value={newPromo.discountValue || ''} onChange={(e) => setNewPromo({ ...newPromo, discountValue: Number(e.target.value) })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={() => createMutation.mutate(newPromo as Omit<Promotion, 'id' | 'usageCount' | 'createdAt'>)}>{t('common.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Promotions;
