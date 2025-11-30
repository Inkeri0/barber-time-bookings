import { Link } from "react-router-dom";
import { Scissors } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <div className="w-8 h-10 barber-stripes rounded-sm"></div>
                <Scissors className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-display font-bold">BarberTime</span>
            </div>
            <p className="text-primary-foreground/80 max-w-sm">
              Book your perfect haircut in seconds. Connect with professional barbers in your area.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/barbers" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  Find Barbers
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/join-barber" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  Become a Barber
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-display font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} BarberTime. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
