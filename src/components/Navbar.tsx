import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Scissors, User, LogOut, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Scissors className="w-6 h-6 text-primary" />
            <span className="font-heading text-xl font-bold">BarberTime</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/barbers" className="text-foreground hover:text-primary transition-colors font-medium">
              {t('nav.findBarbers')}
            </Link>
            <Link to="/how-it-works" className="text-foreground hover:text-primary transition-colors font-medium">
              {t('nav.howItWorks')}
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="uppercase text-xs font-semibold">{language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')} className="gap-2">
                  🇬🇧 English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('nl')} className="gap-2">
                  🇳🇱 Nederlands
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.firstName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>{t('nav.myAccount')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    {t('nav.profile')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">{t('nav.login')}</Link>
                </Button>
                <Button variant="barber" asChild>
                  <Link to="/register">{t('nav.signUp')}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t">
            <Link
              to="/barbers"
              className="block px-4 py-2 hover:bg-muted/50 rounded-lg transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.findBarbers')}
            </Link>
            <Link
              to="/how-it-works"
              className="block px-4 py-2 hover:bg-muted/50 rounded-lg transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.howItWorks')}
            </Link>
            <div className="px-4 py-2 flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4" />
              <button 
                onClick={() => setLanguage('en')} 
                className={`px-2 py-1 rounded ${language === 'en' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              >
                🇬🇧 EN
              </button>
              <button 
                onClick={() => setLanguage('nl')} 
                className={`px-2 py-1 rounded ${language === 'nl' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              >
                🇳🇱 NL
              </button>
            </div>
            <div className="pt-4 space-y-2">
              {isAuthenticated && user ? (
                <>
                  <div className="px-4 py-2 border-b">
                    <p className="font-semibold">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      {t('nav.profile')}
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('nav.logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>{t('nav.login')}</Link>
                  </Button>
                  <Button variant="barber" className="w-full" asChild>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>{t('nav.signUp')}</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
export { Navbar };
