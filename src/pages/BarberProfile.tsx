import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  MapPin, Star, Clock, Euro, Phone, Mail, Calendar, 
  CheckCircle, Award, Scissors 
} from "lucide-react";

// Mock data - will be replaced with API
const mockBarber = {
  id: 1,
  name: "Classic Cuts Amsterdam",
  barberName: "Marco Rodriguez",
  bio: "Professional barber with 10+ years of experience. Specializing in modern fades, classic cuts, and beard grooming. Trained in London and Amsterdam.",
  city: "Amsterdam",
  address: "Kalverstraat 123, 1012 Amsterdam",
  phone: "+31 20 123 4567",
  email: "marco@classiccuts.nl",
  rating: 4.8,
  reviewCount: 234,
  coverImage: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&h=400&fit=crop",
  profileImage: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&h=200&fit=crop",
  specialties: ["Fade", "Beard", "Classic", "Hot Towel"],
  workingHours: {
    monday: "9:00 AM - 6:00 PM",
    tuesday: "9:00 AM - 6:00 PM",
    wednesday: "9:00 AM - 6:00 PM",
    thursday: "9:00 AM - 8:00 PM",
    friday: "9:00 AM - 8:00 PM",
    saturday: "10:00 AM - 4:00 PM",
    sunday: "Closed",
  },
  services: [
    {
      id: 1,
      name: "Classic Haircut",
      description: "Traditional scissor cut with styling",
      duration: 30,
      price: 25,
    },
    {
      id: 2,
      name: "Fade Cut",
      description: "Modern fade with sharp lines",
      duration: 45,
      price: 30,
    },
    {
      id: 3,
      name: "Beard Trim & Shape",
      description: "Professional beard grooming and styling",
      duration: 20,
      price: 15,
    },
    {
      id: 4,
      name: "Full Service",
      description: "Haircut + beard trim + hot towel",
      duration: 60,
      price: 45,
    },
  ],
  reviews: [
    {
      id: 1,
      customerName: "John D.",
      rating: 5,
      comment: "Best fade I've ever had! Marco is a true professional.",
      date: "2024-01-15",
      barberReply: "Thank you John! Always a pleasure.",
    },
    {
      id: 2,
      customerName: "Alex M.",
      rating: 5,
      comment: "Great atmosphere and excellent service. Highly recommend!",
      date: "2024-01-10",
      barberReply: null,
    },
    {
      id: 3,
      customerName: "David K.",
      rating: 4,
      comment: "Good cut, friendly service. Will come back.",
      date: "2024-01-05",
      barberReply: "Thanks David! Looking forward to seeing you again.",
    },
  ],
};

const BarberProfile = () => {
  const { barberId } = useParams();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("services");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Cover Image */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={mockBarber.coverImage}
            alt="Barber shop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <div className="relative -mt-20 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={mockBarber.profileImage}
                  alt={mockBarber.barberName}
                  className="w-32 h-32 rounded-2xl border-4 border-background shadow-card"
                />
                <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2">
                  <CheckCircle className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="bg-card p-6 rounded-xl shadow-card">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h1 className="text-3xl font-display font-bold mb-1">{mockBarber.name}</h1>
                      <p className="text-lg text-muted-foreground">by {mockBarber.barberName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold">{mockBarber.rating}</span>
                      <span className="text-muted-foreground">({mockBarber.reviewCount} reviews)</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">{mockBarber.bio}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {mockBarber.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{mockBarber.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>{mockBarber.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger value="services" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                <Scissors className="w-4 h-4 mr-2" />
                Services
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                <Star className="w-4 h-4 mr-2" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="hours" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                <Clock className="w-4 h-4 mr-2" />
                Hours
              </TabsTrigger>
            </TabsList>

            {/* Services Tab */}
            <TabsContent value="services" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockBarber.services.map((service) => (
                  <Card key={service.id} className="hover:shadow-card transition-smooth">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-display font-bold text-lg">{service.name}</h3>
                        <span className="text-2xl font-bold text-primary">€{service.price}</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration} minutes</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {mockBarber.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold">{review.customerName}</p>
                          <p className="text-sm text-muted-foreground">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3">{review.comment}</p>
                      {review.barberReply && (
                        <>
                          <Separator className="my-3" />
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm font-semibold mb-1">Response from {mockBarber.barberName}</p>
                            <p className="text-sm text-muted-foreground">{review.barberReply}</p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Hours Tab */}
            <TabsContent value="hours" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {Object.entries(mockBarber.workingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between items-center py-2 border-b last:border-0">
                        <span className="font-medium capitalize">{day}</span>
                        <span className={hours === "Closed" ? "text-muted-foreground" : "text-foreground"}>
                          {hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Sticky Book Button */}
      <div className="sticky bottom-0 p-4 bg-background border-t shadow-lg md:hidden">
        <Link to={`/book/${barberId}`}>
          <Button variant="barber" size="lg" className="w-full">
            <Calendar className="w-5 h-5 mr-2" />
            Book Appointment
          </Button>
        </Link>
      </div>

      {/* Desktop Book Button */}
      <div className="hidden md:block fixed bottom-8 right-8 z-50">
        <Link to={`/book/${barberId}`}>
          <Button variant="barber" size="lg" className="shadow-glow">
            <Calendar className="w-5 h-5 mr-2" />
            Book Now
          </Button>
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default BarberProfile;
