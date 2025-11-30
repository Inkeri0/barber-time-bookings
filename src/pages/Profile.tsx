import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Star, Heart, Clock, MapPin, Scissors } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import customerService, { CustomerSummary, FavoriteBarber, PendingReview, MyReview } from '@/services/customer.service';
import appointmentService, { Appointment } from '@/services/appointment.service';

const Profile = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [summary, setSummary] = useState<CustomerSummary | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [favorites, setFavorites] = useState<FavoriteBarber[]>([]);
  const [myReviews, setMyReviews] = useState<MyReview[]>([]);
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
  
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<PendingReview | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const [cancelAppointmentId, setCancelAppointmentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      const [summaryData, upcomingData, pastData, favoritesData, reviewsData, pendingData] = await Promise.all([
        customerService.getSummary(),
        appointmentService.getMyAppointments('upcoming'),
        appointmentService.getMyAppointments('past'),
        customerService.getFavorites(),
        customerService.getMyReviews(),
        customerService.getPendingReviews(),
      ]);

      setSummary(summaryData);
      setUpcomingAppointments(upcomingData);
      setPastAppointments(pastData);
      setFavorites(favoritesData);
      setMyReviews(reviewsData);
      setPendingReviews(pendingData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!cancelAppointmentId) return;

    try {
      await appointmentService.cancelAppointment(cancelAppointmentId);
      toast({
        title: 'Success',
        description: 'Appointment cancelled successfully',
      });
      setCancelAppointmentId(null);
      loadProfileData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel appointment',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveFavorite = async (barberId: string) => {
    try {
      await customerService.removeFavorite(barberId);
      setFavorites(favorites.filter(f => f.id !== barberId));
      toast({
        title: 'Success',
        description: 'Removed from favorites',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove from favorites',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedReview || rating === 0) {
      toast({
        title: 'Error',
        description: 'Please select a rating',
        variant: 'destructive',
      });
      return;
    }

    try {
      await customerService.createReview({
        appointmentId: selectedReview.appointmentId,
        rating,
        comment,
      });
      
      toast({
        title: 'Success',
        description: 'Review submitted successfully',
      });
      
      setIsReviewDialogOpen(false);
      setSelectedReview(null);
      setRating(0);
      setComment('');
      loadProfileData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        variant: 'destructive',
      });
    }
  };

  const openReviewDialog = (review: PendingReview) => {
    setSelectedReview(review);
    setRating(0);
    setComment('');
    setIsReviewDialogOpen(true);
  };

  const getStatusBadge = (appointment: Appointment) => {
    if (appointment.paymentStatus === 'fully_paid') {
      return <Badge className="bg-green-500">Paid</Badge>;
    } else if (appointment.paymentStatus === 'deposit_paid') {
      return <Badge className="bg-blue-500">50% Paid</Badge>;
    } else {
      return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-heading font-bold">{user?.firstName} {user?.lastName}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
              <p className="text-sm text-muted-foreground">Member since {format(new Date(user?.createdAt || new Date()), 'MMMM yyyy')}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{summary?.upcomingAppointments || 0}</div>
                  <div className="text-sm text-muted-foreground">Upcoming</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{summary?.completedVisits || 0}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{summary?.favoriteBarbers || 0}</div>
                  <div className="text-sm text-muted-foreground">Favorites</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{summary?.reviewsGiven || 0}</div>
                  <div className="text-sm text-muted-foreground">Reviews</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{summary?.pendingReviews || 0}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="appointments">
              <Calendar className="w-4 h-4 mr-2" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Heart className="w-4 h-4 mr-2" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <Star className="w-4 h-4 mr-2" />
              My Reviews
            </TabsTrigger>
            <TabsTrigger value="pending">
              <Clock className="w-4 h-4 mr-2" />
              Pending Reviews
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            {/* Upcoming Appointments */}
            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">Upcoming Appointments</h2>
              {upcomingAppointments.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No upcoming appointments</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {upcomingAppointments.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-heading font-bold text-lg">{appointment.shopName}</h3>
                              {getStatusBadge(appointment)}
                            </div>
                            <p className="text-muted-foreground mb-1">{appointment.serviceName}</p>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(appointment.date), 'EEEE, MMMM d, yyyy')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {appointment.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {appointment.address}, {appointment.city}
                              </span>
                            </div>
                            <p className="text-sm mt-2">
                              <span className="font-semibold">Total: €{appointment.price}</span>
                              {appointment.paymentStatus === 'deposit_paid' && (
                                <span className="text-muted-foreground"> (€{appointment.remainingAmount} remaining)</span>
                              )}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => navigate(`/barbers/${appointment.barberId}`)}>
                              View Barber
                            </Button>
                            <Button variant="destructive" onClick={() => setCancelAppointmentId(appointment.id)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Past Appointments */}
            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">Past Appointments</h2>
              {pastAppointments.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No past appointments</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {pastAppointments.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-heading font-bold text-lg">{appointment.shopName}</h3>
                              <Badge variant={appointment.status === 'completed' ? 'default' : 'secondary'}>
                                {appointment.status === 'completed' ? 'Completed' : appointment.status === 'no_show' ? 'No Show' : 'Cancelled'}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-1">{appointment.serviceName}</p>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                              <span>{format(new Date(appointment.date), 'MMMM d, yyyy')}</span>
                              <span>•</span>
                              <span>€{appointment.price}</span>
                            </div>
                          </div>
                          {appointment.status === 'completed' && (
                            <Button variant="outline" onClick={() => navigate(`/barbers/${appointment.barberId}`)}>
                              Book Again
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            {favorites.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <Heart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No favorite barbers yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((barber) => (
                  <Card key={barber.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-0">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-barber-red/10 flex items-center justify-center relative">
                        {barber.profileImage ? (
                          <img src={barber.profileImage} alt={barber.shopName} className="w-full h-full object-cover" />
                        ) : (
                          <Scissors className="w-16 h-16 text-primary/30" />
                        )}
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute top-2 right-2"
                          onClick={() => handleRemoveFavorite(barber.id)}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </Button>
                      </div>
                      <div className="p-4" onClick={() => navigate(`/barbers/${barber.id}`)}>
                        <h3 className="font-heading font-bold text-lg mb-1">{barber.shopName}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{barber.city}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{barber.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground text-sm">({barber.reviewCount})</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Reviews Tab */}
          <TabsContent value="reviews">
            {myReviews.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No reviews yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myReviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg font-heading">{review.barberName}</CardTitle>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(review.createdAt), 'MMMM d, yyyy')}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{review.comment}</p>
                      {review.barberReply && (
                        <div className="bg-muted p-4 rounded-lg">
                          <p className="font-semibold text-sm mb-1">Barber's Reply:</p>
                          <p className="text-sm">{review.barberReply}</p>
                          {review.barberReplyDate && (
                            <p className="text-xs text-muted-foreground mt-2">
                              {format(new Date(review.barberReplyDate), 'MMMM d, yyyy')}
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Pending Reviews Tab */}
          <TabsContent value="pending">
            {pendingReviews.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No pending reviews</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pendingReviews.map((review) => (
                  <Card key={review.appointmentId}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="font-heading font-bold text-lg mb-1">{review.barberName}</h3>
                          <p className="text-muted-foreground mb-1">{review.serviceName}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(review.date), 'MMMM d, yyyy')}
                          </p>
                        </div>
                        <Button onClick={() => openReviewDialog(review)}>
                          Write Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience with {selectedReview?.barberName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Comment</label>
              <Textarea
                placeholder="Tell us about your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReview}>Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={!!cancelAppointmentId} onOpenChange={() => setCancelAppointmentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? Depending on the cancellation policy, you may receive a full or partial refund.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep It</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelAppointment}>Yes, Cancel</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;
