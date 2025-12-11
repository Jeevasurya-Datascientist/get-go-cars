import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockBookings, mockCars } from '@/data/mockData';
import { Calendar, Clock, MapPin, ChevronRight, Car } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface BookingsPageProps {
  user?: { name: string; role: 'customer' | 'admin' } | null;
  onLogout?: () => void;
}

export function BookingsPage({ user, onLogout }: BookingsPageProps) {
  const [activeTab, setActiveTab] = useState('all');

  const getCarDetails = (carId: string) => {
    return mockCars.find((car) => car.id === carId);
  };

  const statusColors = {
    pending: 'bg-warning/10 text-warning border-warning/20',
    confirmed: 'bg-success/10 text-success border-success/20',
    active: 'bg-primary/10 text-primary border-primary/20',
    completed: 'bg-muted text-muted-foreground border-muted',
    cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  const filteredBookings = mockBookings.filter((booking) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return ['pending', 'confirmed'].includes(booking.status);
    if (activeTab === 'active') return booking.status === 'active';
    if (activeTab === 'completed') return booking.status === 'completed';
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={onLogout} />

      <main className="flex-1 py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
            <p className="text-muted-foreground">View and manage your car rentals</p>
          </div>

          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All ({mockBookings.length})</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredBookings.length === 0 ? (
                <Card>
                  <CardContent className="py-16 text-center">
                    <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No bookings found</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't made any bookings yet.
                    </p>
                    <Button variant="secondary" asChild>
                      <Link to="/cars">Browse Cars</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredBookings.map((booking) => {
                  const car = getCarDetails(booking.carId);
                  if (!car) return null;

                  return (
                    <Card key={booking.id} className="hover:shadow-card-hover transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                          <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden bg-muted">
                            <img
                              src={car.images[0]}
                              alt={car.model}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 space-y-4">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Booking #{booking.id}
                                </p>
                                <h3 className="text-lg font-semibold">
                                  {car.brand} {car.model}
                                </h3>
                              </div>
                              <Badge
                                variant="outline"
                                className={cn("capitalize", statusColors[booking.status])}
                              >
                                {booking.status}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-6 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  {format(new Date(booking.startDate), 'PP')} -{' '}
                                  {format(new Date(booking.endDate), 'PP')}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                              <div>
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-xl font-bold">${booking.totalPrice}</p>
                              </div>
                              <Button variant="outline" asChild>
                                <Link to={`/bookings/${booking.id}`}>
                                  View Details
                                  <ChevronRight className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
