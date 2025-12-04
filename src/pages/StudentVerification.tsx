import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { studentService, StudentStatus } from '@/services/student.service';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, CheckCircle, Mail, Percent, Clock } from 'lucide-react';

const universities = [
  { id: 'uva', name: 'University of Amsterdam (UvA)' },
  { id: 'vu', name: 'Vrije Universiteit Amsterdam' },
  { id: 'utwente', name: 'University of Twente' },
  { id: 'tudelft', name: 'TU Delft' },
  { id: 'tue', name: 'TU Eindhoven' },
  { id: 'maastricht', name: 'Maastricht University' },
  { id: 'leiden', name: 'Leiden University' },
  { id: 'utrecht', name: 'Utrecht University' },
  { id: 'groningen', name: 'University of Groningen' },
  { id: 'radboud', name: 'Radboud University' },
  { id: 'tilburg', name: 'Tilburg University' },
  { id: 'erasmus', name: 'Erasmus University Rotterdam' },
];

const mockStatus: StudentStatus = {
  isVerified: false,
  discountPercentage: 0,
};

const StudentVerification = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const { data: status = mockStatus, isLoading } = useQuery({
    queryKey: ['student-status'],
    queryFn: studentService.getStatus,
    retry: false,
  });

  const requestMutation = useMutation({
    mutationFn: () => studentService.requestVerification(email, university),
    onSuccess: (data) => {
      setExpiresAt(data.expiresAt);
      setStep('verify');
      toast({ title: t('student.codeSent') });
    },
    onError: () => {
      toast({ title: t('common.error'), variant: 'destructive' });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: () => studentService.confirmVerification(email, otp),
    onSuccess: (data) => {
      if (data.verified) {
        queryClient.invalidateQueries({ queryKey: ['student-status'] });
        toast({ title: t('student.verified') });
      } else {
        toast({ title: t('student.invalidCode'), variant: 'destructive' });
      }
    },
    onError: () => {
      toast({ title: t('common.error'), variant: 'destructive' });
    },
  });

  const isValidEmail = email.endsWith('.edu') || email.endsWith('.nl') || email.includes('.edu.');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-96 max-w-2xl mx-auto" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{t('student.title')}</h1>
          <p className="text-muted-foreground mb-8">{t('student.subtitle')}</p>

          {status.isVerified ? (
            <Card className="border-green-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {t('student.verifiedTitle')}
                      <Badge variant="default" className="bg-green-500">{t('student.verified')}</Badge>
                    </CardTitle>
                    <CardDescription>{status.university}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{t('student.verifiedEmail')}</span>
                    </div>
                    <p className="font-medium">{status.email}</p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Percent className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{t('student.discount')}</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">{status.discountPercentage}% {t('student.off')}</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-amber-500/10 rounded-lg">
                  <h4 className="font-semibold mb-2">{t('student.discountInfo')}</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• {t('student.firstTime')}: 20% {t('student.off')}</li>
                    <li>• {t('student.ongoing')}: 10% {t('student.off')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{t('student.verifyTitle')}</CardTitle>
                    <CardDescription>{t('student.verifyDesc')}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {step === 'form' ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="university">{t('student.selectUniversity')}</Label>
                      <Select value={university} onValueChange={setUniversity}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('student.selectUniversity')} />
                        </SelectTrigger>
                        <SelectContent>
                          {universities.map((uni) => (
                            <SelectItem key={uni.id} value={uni.id}>{uni.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('student.universityEmail')}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="student@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {email && !isValidEmail && (
                        <p className="text-sm text-destructive">{t('student.invalidEmail')}</p>
                      )}
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <h4 className="font-semibold mb-2">{t('student.benefits')}</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• {t('student.firstTime')}: 20% {t('student.off')}</li>
                        <li>• {t('student.ongoing')}: 10% {t('student.off')}</li>
                      </ul>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => requestMutation.mutate()}
                      disabled={!email || !university || !isValidEmail || requestMutation.isPending}
                    >
                      {requestMutation.isPending ? t('common.loading') : t('student.sendCode')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-4">{t('student.enterCode')}</p>
                      <p className="text-sm mb-2">{email}</p>
                      {expiresAt && (
                        <div className="flex items-center justify-center gap-2 text-sm text-amber-600">
                          <Clock className="h-4 w-4" />
                          {t('student.codeExpires')}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => verifyMutation.mutate()}
                      disabled={otp.length !== 6 || verifyMutation.isPending}
                    >
                      {verifyMutation.isPending ? t('common.loading') : t('student.verify')}
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => setStep('form')}
                    >
                      {t('common.back')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentVerification;
