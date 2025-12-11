import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ChevronLeft, CreditCard, Wallet, CheckCircle2, 
  Calendar, MapPin, ArrowRight, Tag
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Car, Addon } from '@/types';

interface BookingConfirmPageProps {
  user?: { name: string; role: 'customer' | 'admin' } | null;
  onLogout?: () => void;
}

interface BookingState {
  car: Car;
  startDate: Date;
  endDate: Date;
  addons: Addon[];
  total: number;
}

export function BookingConfirmPage({ user, onLogout }: BookingConfirmPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as BookingState | null;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const { car, startDate, endDate, addons, total } = state;
  const discount = promoApplied ? total * 0.1 : 0;
  const finalTotal = total - discount;

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'drive10') {
      setPromoApplied(true);
      toast({
        title: "Promo applied!",
        description: "10% discount has been applied to your booking.",
      });
    } else {
      toast({
        title: "Invalid code",
        description: "The promo code you entered is not valid.",
        variant: "destructive",
      });
    }
  };

  const handlePayment = () => {
    if (!termsAccepted) {
      toast({
        title: "Accept terms",
        description: "Please accept the terms and conditions to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Booking confirmed!",
        description: "Your booking has been successfully placed.",
      });
      navigate('/booking/success', {
        state: {
          bookingId: `BK${Date.now()}`,
          car,
          startDate,
          endDate,
          total: finalTotal,
        },
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={onLogout} />

      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link to={`/cars/${car.id}`}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Car
            </Link>
          </Button>

          <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-3 space-y-6">
              {/* Booking Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Booking Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-16 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={car.images[0]}
                        alt={car.model}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{car.brand} {car.model}</p>
                      <p className="text-sm text-muted-foreground">{car.year} • {car.transmission}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Pickup</p>
                        <p className="text-sm font-medium">{format(new Date(startDate), 'PPP')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Return</p>
                        <p className="text-sm font-medium">{format(new Date(endDate), 'PPP')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'card' | 'wallet')}>
                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-border cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Credit/Debit Card</p>
                          <p className="text-xs text-muted-foreground">Pay securely with your card</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-border cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Wallet className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Digital Wallet</p>
                          <p className="text-xs text-muted-foreground">Apple Pay, Google Pay</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Cardholder Name</Label>
                        <Input id="name" placeholder="John Doe" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Promo Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Promo Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoApplied}
                    />
                    <Button
                      variant="outline"
                      onClick={applyPromoCode}
                      disabled={promoApplied || !promoCode}
                    >
                      {promoApplied ? <CheckCircle2 className="h-4 w-4 text-success" /> : 'Apply'}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Try code: DRIVE10 for 10% off
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <Card className="sticky top-24 shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Car rental</span>
                      <span>${total - addons.reduce((s, a) => s + a.price, 0)}</span>
                    </div>
                    {addons.length > 0 && (
                      <>
                        {addons.map((addon) => (
                          <div key={addon.id} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{addon.name}</span>
                            <span>${addon.price}</span>
                          </div>
                        ))}
                      </>
                    )}
                    {promoApplied && (
                      <div className="flex justify-between text-sm text-success">
                        <span>Promo discount (10%)</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex items-start gap-2 pt-4">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    />
                    <label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer">
                      I agree to the Terms of Service, Privacy Policy, and Cancellation Policy
                    </label>
                  </div>

                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      'Processing...'
                    ) : (
                      <>
                        Pay ${finalTotal.toFixed(2)}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
