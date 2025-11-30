import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Search, Calendar, Scissors, Star, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero py-16 md:py-24">
          <div className="absolute top-0 left-0 w-full h-2 barber-stripes"></div>
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              How BarberTime Works
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Book your perfect haircut in three simple steps
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-16">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/2">
                  <div className="relative inline-block mb-4">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                      <Search className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-barber-red text-white rounded-full flex items-center justify-center font-bold text-xl">
                      1
                    </div>
                  </div>
                  <h2 className="text-3xl font-display font-bold mb-4">Find Your Barber</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Browse through hundreds of professional barbers in your area. Filter by location, 
                    specialty, price, and ratings. Read reviews from real customers to find the perfect 
                    match for your style.
                  </p>
                </div>
                <div className="md:w-1/2 bg-muted rounded-2xl p-8 aspect-square flex items-center justify-center">
                  <Search className="w-32 h-32 text-primary" />
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
                <div className="md:w-1/2">
                  <div className="relative inline-block mb-4">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-barber-red text-white rounded-full flex items-center justify-center font-bold text-xl">
                      2
                    </div>
                  </div>
                  <h2 className="text-3xl font-display font-bold mb-4">Book Your Time Slot</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Choose your preferred service, pick a convenient date and time that works for you. 
                    See real-time availability and secure your spot instantly. You can choose to pay 
                    the full amount or just a 50% deposit upfront.
                  </p>
                </div>
                <div className="md:w-1/2 bg-muted rounded-2xl p-8 aspect-square flex items-center justify-center">
                  <Calendar className="w-32 h-32 text-primary" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/2">
                  <div className="relative inline-block mb-4">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                      <Scissors className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-barber-red text-white rounded-full flex items-center justify-center font-bold text-xl">
                      3
                    </div>
                  </div>
                  <h2 className="text-3xl font-display font-bold mb-4">Get Your Perfect Cut</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Show up at your scheduled time and enjoy your service. If you paid the 50% deposit, 
                    simply pay the remaining amount at the shop. After your appointment, leave a review 
                    to help other customers.
                  </p>
                </div>
                <div className="md:w-1/2 bg-muted rounded-2xl p-8 aspect-square flex items-center justify-center">
                  <Scissors className="w-32 h-32 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-center mb-12">Why Choose BarberTime?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display font-bold text-xl mb-2">Save Time</h3>
                <p className="text-muted-foreground">
                  No more waiting in line. Book online 24/7 and show up at your exact time slot.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display font-bold text-xl mb-2">Secure Payments</h3>
                <p className="text-muted-foreground">
                  Safe and secure payment processing. Choose to pay in full or just a deposit.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display font-bold text-xl mb-2">Verified Reviews</h3>
                <p className="text-muted-foreground">
                  Read honest reviews from verified customers to make the best choice.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-display font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust BarberTime for their grooming needs.
            </p>
            <Link to="/barbers">
              <Button variant="barber" size="lg">
                Find Your Barber Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
