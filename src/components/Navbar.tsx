import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scissors, Menu, User } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-8 h-10 barber-stripes rounded-sm"></div>
              <Scissors className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">
              BarberTime
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/barbers" className="text-foreground hover:text-primary transition-smooth font-medium">
              Find Barbers
            </Link>
            <Link to="/how-it-works" className="text-foreground hover:text-primary transition-smooth font-medium">
              How It Works
            </Link>
            <Link to="/join-barber" className="text-foreground hover:text-primary transition-smooth font-medium">
              Join as Barber
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="barber" size="sm">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-accent/10 rounded-lg transition-smooth"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-3">
              <Link
                to="/barbers"
                className="px-4 py-2 hover:bg-accent/10 rounded-lg transition-smooth font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Find Barbers
              </Link>
              <Link
                to="/how-it-works"
                className="px-4 py-2 hover:bg-accent/10 rounded-lg transition-smooth font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                to="/join-barber"
                className="px-4 py-2 hover:bg-accent/10 rounded-lg transition-smooth font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Join as Barber
              </Link>
              <div className="flex flex-col gap-2 px-4 pt-3 border-t mt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="barber" className="w-full" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
