import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CarCard } from '@/components/CarCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { mockCars } from '@/data/mockData';
import { ArrowRight, Search, Shield, Clock, Award, Star, ChevronRight } from 'lucide-react';
import heroCarImage from '@/assets/hero-car.jpg';

interface IndexPageProps {
  user?: { name: string; role: 'customer' | 'admin' } | null;
  onLogout?: () => void;
}

export default function Index({ user, onLogout }: IndexPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const featuredCars = mockCars.filter(car => car.status === 'available').slice(0, 4);

  const features = [
    { icon: Shield, title: 'Fully Insured', description: 'All rentals include comprehensive insurance coverage' },
    { icon: Clock, title: '24/7 Support', description: 'Round-the-clock customer service for any assistance' },
    { icon: Award, title: 'Premium Fleet', description: 'Handpicked selection of luxury and performance vehicles' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={onLogout} />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-hero overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[60%] h-[80%] hidden lg:block">
          <img
            src={heroCarImage}
            alt="Luxury sports car"
            className="w-full h-full object-contain object-right animate-float"
          />
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-2xl space-y-8">
            <div className="space-y-4 animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium">
                <Star className="h-4 w-4 fill-secondary" />
                Premium Car Rental Service
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
                Drive Your Dreams <br />
                <span className="text-gradient">Today</span>
              </h1>
              <p className="text-lg text-primary-foreground/70 max-w-lg">
                Experience luxury and performance with our curated fleet of premium vehicles. 
                From sports cars to SUVs, find the perfect ride for any occasion.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by brand or model..."
                  className="pl-12 h-14 bg-background/95 border-0 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="hero" size="xl" asChild>
                <Link to="/cars">
                  Browse Cars
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <div>
                <p className="text-3xl font-bold text-primary-foreground">50+</p>
                <p className="text-sm text-primary-foreground/60">Vehicles</p>
              </div>
              <div className="w-px h-12 bg-primary-foreground/20" />
              <div>
                <p className="text-3xl font-bold text-primary-foreground">10k+</p>
                <p className="text-sm text-primary-foreground/60">Happy Customers</p>
              </div>
              <div className="w-px h-12 bg-primary-foreground/20" />
              <div>
                <p className="text-3xl font-bold text-primary-foreground">4.9</p>
                <p className="text-sm text-primary-foreground/60">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                  <feature.icon className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Vehicles</h2>
              <p className="text-muted-foreground">Hand-picked selection of our finest cars</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link to="/cars">
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link to="/cars">View All Cars</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-hero">
        <div className="container text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground">
              Ready to Hit the Road?
            </h2>
            <p className="text-lg text-primary-foreground/70">
              Join thousands of satisfied customers who trust DriveElite for their premium car rental needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/cars">
                  Browse Our Fleet
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/auth">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
