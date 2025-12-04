import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Barbers from "./pages/Barbers";
import BarberProfile from "./pages/BarberProfile";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";
import Subscription from "./pages/barber/Subscription";
import StudentVerification from "./pages/StudentVerification";
import Referrals from "./pages/Referrals";
import Loyalty from "./pages/Loyalty";
import LoyaltySettings from "./pages/barber/LoyaltySettings";
import Analytics from "./pages/barber/Analytics";
import Waitlist from "./pages/Waitlist";
import Promotions from "./pages/barber/Promotions";
import Shop from "./pages/Shop";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/barbers" element={<Barbers />} />
              <Route path="/barbers/:barberId" element={<BarberProfile />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              {/* New Feature Routes */}
              <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
              <Route path="/student-verification" element={<ProtectedRoute><StudentVerification /></ProtectedRoute>} />
              <Route path="/referrals" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />
              <Route path="/loyalty" element={<ProtectedRoute><Loyalty /></ProtectedRoute>} />
              <Route path="/barber/loyalty" element={<ProtectedRoute><LoyaltySettings /></ProtectedRoute>} />
              <Route path="/barber/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/waitlist" element={<ProtectedRoute><Waitlist /></ProtectedRoute>} />
              <Route path="/barber/promotions" element={<ProtectedRoute><Promotions /></ProtectedRoute>} />
              <Route path="/shop/:barberId" element={<Shop />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
