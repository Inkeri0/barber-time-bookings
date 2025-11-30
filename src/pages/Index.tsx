import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Scissors, Clock, Calendar, Star, Search, MapPin, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-barber.jpg";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Modern barbershop interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70"></div>
        </div>

        {/* Decorative barber stripe */}
        <div className="absolute top-0 right-0 w-32 h-full barber-stripes opacity-20"></div>

        {/* Content */}
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Book Your Barber in <span className="text-cream">Seconds</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Find professional barbers near you. Book instantly. Pay seamlessly. Get the perfect cut every time.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-xl p-2 shadow-glow flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2 px-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Enter your city or barber name" 
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Link to="/barbers" className="sm:w-auto">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  <Search className="w-5 h-5" />
                  Find Barbers
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 mt-8 text-white/90">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-cream fill-cream" />
                <span className="font-semibold">500+ Barbers</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cream" />
                <span className="font-semibold">10,000+ Bookings</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-cream" />
                <span className="font-semibold">24/7 Booking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get your perfect haircut in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-card group-hover:shadow-glow transition-smooth">
                  <Search className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-barber-red text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Find Your Barber</h3>
              <p className="text-muted-foreground">
                Browse professional barbers in your area. Check reviews, services, and prices.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-card group-hover:shadow-glow transition-smooth">
                  <Calendar className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-barber-red text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Book Your Slot</h3>
              <p className="text-muted-foreground">
                Choose your service, pick a convenient time, and secure your booking instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-card group-hover:shadow-glow transition-smooth">
                  <Scissors className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-barber-red text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Get Your Cut</h3>
              <p className="text-muted-foreground">
                Show up at your time, get the perfect cut, and pay the rest at the shop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 barber-stripes"></div>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
            Ready to Find Your Perfect Barber?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust BarberTime for their grooming needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/barbers">
              <Button variant="barber" size="lg" className="w-full sm:w-auto">
                Browse Barbers
              </Button>
            </Link>
            <Link to="/join-barber">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto bg-white/10 border-white text-white hover:bg-white hover:text-primary backdrop-blur-sm"
              >
                I'm a Barber
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Stats */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-display font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Professional Barbers</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-primary mb-2">4.9</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
