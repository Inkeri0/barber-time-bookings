import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { waitlistService, WaitlistEntry, TimePreference } from '@/services/waitlist.service';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Clock, CalendarIcon, Check, X, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const mockEntries: WaitlistEntry[] = [
  { id: '1', barberId: 'b1', barberName: 'Classic Cuts', serviceId: 's1', serviceName: 'Haircut', timePreference: 'afternoon', flexibilityDays: 3, status: 'waiting', createdAt: '2024-11-10' },
  { id: '2', barberId: 'b2', barberName: 'Modern Barber', serviceId: 's2', serviceName: 'Beard Trim', timePreference: 'morning', flexibilityDays: 5, status: 'offered', offeredSlot: { date: '2024-11-20', time: '10:30', expiresAt: '2024-11-18T18:00:00' }, createdAt: '2024-11-08' },
];

const Waitlist = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [timePreference, setTimePreference] = useState<TimePreference>('any');
  const [flexibility, setFlexibility] = useState([3]);

  const { data: entries = mockEntries } = useQuery({
    queryKey: ['waitlist-entries'],
    queryFn: waitlistService.getMyEntries,
    retry: false,
  });

  const respondMutation = useMutation({
    mutationFn: ({ id, accept }: { id: string; accept: boolean }) => waitlistService.respondToOffer(id, accept),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['waitlist-entries'] });
      toast({ title: data.message });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => waitlistService.cancelEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist-entries'] });
      toast({ title: t('waitlist.cancelled') });
    },
  });

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      waiting: { variant: 'secondary', label: t('waitlist.statusWaiting') },
      offered: { variant: 'default', label: t('waitlist.statusOffered') },
      accepted: { variant: 'default', label: t('waitlist.statusAccepted') },
      declined: { variant: 'outline', label: t('waitlist.statusDeclined') },
      expired: { variant: 'destructive', label: t('waitlist.statusExpired') },
    };
    const c = config[status] || { variant: 'secondary', label: status };
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">{t('waitlist.title')}</h1>
              <p className="text-muted-foreground">{t('waitlist.subtitle')}</p>
            </div>
            <Button onClick={() => setJoinDialogOpen(true)}>{t('waitlist.joinNew')}</Button>
          </div>

          {entries.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t('waitlist.noEntries')}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <Card key={entry.id} className={entry.status === 'offered' ? 'border-primary' : ''}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{entry.barberName}</CardTitle>
                        <CardDescription>{entry.serviceName}</CardDescription>
                      </div>
                      {getStatusBadge(entry.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span><Clock className="h-4 w-4 inline mr-1" />{t(`waitlist.time.${entry.timePreference}`)}</span>
                      <span>{entry.flexibilityDays} {t('waitlist.daysFlexible')}</span>
                    </div>
                    {entry.status === 'offered' && entry.offeredSlot && (
                      <div className="bg-primary/10 rounded-lg p-4 mb-4">
                        <p className="font-semibold">{t('waitlist.slotOffered')}</p>
                        <p>{format(new Date(entry.offeredSlot.date), 'EEEE, MMM d')} at {entry.offeredSlot.time}</p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" onClick={() => respondMutation.mutate({ id: entry.id, accept: true })}>
                            <Check className="h-4 w-4 mr-1" />{t('waitlist.accept')}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => respondMutation.mutate({ id: entry.id, accept: false })}>
                            <X className="h-4 w-4 mr-1" />{t('waitlist.decline')}
                          </Button>
                        </div>
                      </div>
                    )}
                    {entry.status === 'waiting' && (
                      <Button variant="ghost" size="sm" onClick={() => cancelMutation.mutate(entry.id)}>
                        {t('waitlist.cancel')}
                      </Button>
                    )}
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

export default Waitlist;
