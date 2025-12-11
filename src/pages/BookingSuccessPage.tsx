import { useLocation, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Calendar, Download, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Car } from '@/types';

interface BookingSuccessPageProps {
  user?: { name: string; role: 'customer' | 'admin' } | null;
  onLogout?: () => void;
}

interface SuccessState {
  bookingId: string;
  car: Car;
  startDate: Date;
  endDate: Date;
  total: number;
}

export function BookingSuccessPage({ user, onLogout }: BookingSuccessPageProps) {
  const location = useLocation();
  const state = location.state as SuccessState | null;

  if (!state) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={onLogout} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">No booking data</h1>
            <Button asChild>
              <Link to="/cars">Browse Cars</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const { bookingId, car, startDate, endDate, total } = state;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={onLogout} />

      <main className="flex-1 py-16">
        <div className="container max-w-2xl">
          <div className="text-center mb-8 animate-fade-up">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Your reservation has been successfully placed
            </p>
          </div>

          <Card className="shadow-card animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6 space-y-6">
              <div className="text-center pb-4 border-b border-border">
                <p className="text-sm text-muted-foreground">Booking Reference</p>
                <p className="text-2xl font-mono font-bold">{bookingId}</p>
              </div>

              <div className="flex gap-4">
                <div className="w-32 h-20 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={car.images[0]}
                    alt={car.model}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-lg">{car.brand} {car.model}</p>
                  <p className="text-sm text-muted-foreground">
                    {car.year} • {car.type} • {car.transmission}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Pickup</span>
                  </div>
                  <p className="font-medium">{format(new Date(startDate), 'PPP')}</p>
                  <p className="text-sm text-muted-foreground">10:00 AM</p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Return</span>
                  </div>
                  <p className="font-medium">{format(new Date(endDate), 'PPP')}</p>
                  <p className="text-sm text-muted-foreground">10:00 AM</p>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-border">
                <span className="text-muted-foreground">Total Paid</span>
                <span className="text-2xl font-bold">${total.toFixed(2)}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
                <Button variant="secondary" className="flex-1" asChild>
                  <Link to="/bookings">
                    View My Bookings
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-sm text-muted-foreground mb-4">
              A confirmation email has been sent to your email address
            </p>
            <Button variant="ghost" asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
