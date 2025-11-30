import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Scissors } from "lucide-react";

const Login = () => {
  const { login, requestOtp, verifyOtp, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Password login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // OTP login state
  const [otpEmail, setOtpEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: t('common.success'),
        description: t('login.codeSent'),
      });
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('login.error'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!otpEmail) return;

    setIsLoading(true);

    try {
      await requestOtp(otpEmail);
      setOtpSent(true);
      setOtpTimer(300); // 5 minutes
      toast({
        title: t('common.success'),
        description: t('login.codeSent'),
      });
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('login.error'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      toast({
        title: t('common.error'),
        description: t('login.enterCode'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await verifyOtp(otpEmail, otpCode);
      
      if (response.needsRegistration) {
        navigate('/register', { state: { email: otpEmail, otpCode } });
      } else {
        toast({
          title: t('common.success'),
          description: t('login.codeSent'),
        });
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('login.invalidCode'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12 bg-muted/30">
        <div className="w-full max-w-md">
          <Card className="max-w-md w-full shadow-glow">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                  <Scissors className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-3xl font-display">{t('login.title')}</CardTitle>
              <CardDescription>{t('login.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="password" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="password">{t('login.emailPassword')}</TabsTrigger>
                  <TabsTrigger value="otp">{t('login.passwordless')}</TabsTrigger>
                </TabsList>

                {/* Password Login */}
                <TabsContent value="password">
                  <form onSubmit={handlePasswordLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('login.email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t('login.emailPlaceholder')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">{t('login.password')}</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="text-right">
                      <Link
                        to="/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        {t('login.forgotPassword')}
                      </Link>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading} variant="barber">
                      {isLoading ? t('common.loading') : t('login.loginButton')}
                    </Button>
                  </form>
                </TabsContent>

                {/* OTP Login */}
                <TabsContent value="otp">
                  {!otpSent ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="otp-email">{t('login.email')}</Label>
                        <Input
                          id="otp-email"
                          type="email"
                          placeholder={t('login.emailPlaceholder')}
                          value={otpEmail}
                          onChange={(e) => setOtpEmail(e.target.value)}
                          required
                        />
                      </div>

                      <Button
                        onClick={handleSendOtp}
                        className="w-full"
                        disabled={isLoading || !otpEmail}
                        variant="barber"
                      >
                        {isLoading ? t('common.loading') : t('login.sendCode')}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>{t('login.enterCode')}</Label>
                        <div className="flex justify-center">
                          <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
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
                        {otpTimer > 0 && (
                          <p className="text-sm text-center text-muted-foreground">
                            {t('login.code')}: {formatTime(otpTimer)}
                          </p>
                        )}
                      </div>

                      <Button
                        onClick={handleVerifyOtp}
                        className="w-full"
                        disabled={isLoading || otpCode.length !== 6}
                        variant="barber"
                      >
                        {isLoading ? t('common.loading') : t('login.verify')}
                      </Button>

                      {otpTimer === 0 && (
                        <Button
                          onClick={() => {
                            setOtpSent(false);
                            setOtpCode("");
                          }}
                          variant="ghost"
                          className="w-full"
                        >
                          {t('login.resend')}
                        </Button>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">{t('login.noAccount')} </span>
                <Link to="/register" className="text-primary hover:underline font-medium">
                  {t('login.signUpHere')}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
