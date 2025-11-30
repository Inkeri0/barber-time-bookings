import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Search, SlidersHorizontal } from "lucide-react";

// Mock data - will be replaced with API calls
const mockBarbers = [
  {
    id: 1,
    name: "Classic Cuts Amsterdam",
    barberName: "Marco Rodriguez",
    city: "Amsterdam",
    rating: 4.8,
    reviewCount: 234,
    startingPrice: 25,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop",
    specialties: ["Fade", "Beard", "Classic"],
  },
  {
    id: 2,
    name: "The Gentleman's Room",
    barberName: "James Wilson",
    city: "Rotterdam",
    rating: 4.9,
    reviewCount: 189,
    startingPrice: 30,
    image: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=400&h=400&fit=crop",
    specialties: ["Executive", "Hot Towel", "Beard"],
  },
  {
    id: 3,
    name: "Fresh Fades Utrecht",
    barberName: "Ahmed Hassan",
    city: "Utrecht",
    rating: 4.7,
    reviewCount: 156,
    startingPrice: 22,
    image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=400&fit=crop",
    specialties: ["Modern", "Fade", "Kids"],
  },
  {
    id: 4,
    name: "Barber Bros",
    barberName: "Tom van den Berg",
    city: "Amsterdam",
    rating: 4.6,
    reviewCount: 201,
    startingPrice: 28,
    image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=400&fit=crop",
    specialties: ["Fade", "Buzz Cut", "Beard"],
  },
];

const Barbers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <div className="bg-primary text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Find Your Barber</h1>
            <p className="text-primary-foreground/90 text-lg">
              Browse {mockBarbers.length}+ professional barbers in your area
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="border-b bg-background sticky top-16 z-40 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* City Filter */}
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-full md:w-48">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="amsterdam">Amsterdam</SelectItem>
                  <SelectItem value="rotterdam">Rotterdam</SelectItem>
                  <SelectItem value="utrecht">Utrecht</SelectItem>
                  <SelectItem value="den-haag">Den Haag</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Barber Grid */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockBarbers.map((barber) => (
              <Link key={barber.id} to={`/barbers/${barber.id}`}>
                <Card className="overflow-hidden hover:shadow-glow transition-smooth group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={barber.image}
                      alt={barber.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                    />
                    <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-card">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm">{barber.rating}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-display font-bold text-lg mb-1">{barber.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">by {barber.barberName}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{barber.city}</span>
                      <span className="text-muted-foreground/50">•</span>
                      <span>{barber.reviewCount} reviews</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {barber.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <span className="text-xs text-muted-foreground">Starting from</span>
                        <p className="text-xl font-bold text-primary">€{barber.startingPrice}</p>
                      </div>
                      <Button variant="barber" size="sm">
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination would go here */}
          <div className="mt-12 flex justify-center">
            <Button variant="outline">Load More Barbers</Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Barbers;
