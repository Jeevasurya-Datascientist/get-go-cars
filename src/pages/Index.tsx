import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CarCard } from '@/components/CarCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArrowRight, Shield, Clock, Award, Star, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Car as CarType } from '@/types';

interface IndexPageProps {
  user?: { name: string; role: 'customer' | 'admin' } | null;
  onLogout?: () => void;
}

export default function Index({ user, onLogout }: IndexPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch featured cars (latest 4 available)
  const { data: featuredCars = [] } = useQuery({
    queryKey: ['featured-cars'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;

      return data.map((car: any) => ({
        ...car,
        pricePerDay: car.price_per_day,
        fuelType: car.fuel_type,
        images: car.images || [],
        features: car.features || []
      })) as CarType[];
    }
  });

  const features = [
    {
      icon: Shield,
      title: 'Fully Insured',
      description: 'Every rental comes with comprehensive insurance coverage. Drive with total peace of mind.',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Our dedicated concierge team is always available to assist you, day or night.',
    },
    {
      icon: Award,
      title: 'Premium Fleet',
      description: 'Access an exclusive collection of high-end vehicles maintained to showroom standards.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary/20">
      <Navbar user={user} onLogout={onLogout} />

      {/* Hero Section - Dark & Premium */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-[#0a0a0a] text-white">
        {/* Abstract Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-primary/20 blur-[120px] opacity-40 mix-blend-screen" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[150px] opacity-30 mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        </div>

        <div className="container relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium text-gray-300">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span>#1 Luxury Car Rental Service</span>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9]">
              Drive the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 animate-shimmer bg-[length:200%_auto]">Extraordinary</span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-400 max-w-lg leading-relaxed font-light">
              Unleash your journey with our curated collection of luxury and sports cars. Unmatched performance, undeniable style.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <Button size="xl" className="h-16 px-10 text-xl rounded-full bg-[#facc15] hover:bg-[#eab308] text-black shadow-[0_0_40px_-10px_rgba(250,204,21,0.5)] hover:scale-105 transition-all duration-300 font-bold tracking-wide" asChild>
                <Link to="/cars">
                  Browse Fleet <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>

              <Button size="xl" variant="outline" className="h-16 px-10 text-xl rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md hover:scale-105 transition-all duration-300 font-medium" asChild>
                <Link to="/bookings">
                  My Bookings
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-8 text-base text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#facc15]" />
                <span>Instant Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#facc15]" />
                <span>Fully Insured</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative lg:h-[700px] flex items-center justify-center animate-slide-in-right">
            {/* Spotlight Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(closest-side,rgba(234,179,8,0.15),transparent)] blur-3xl -z-10 rounded-full" />

            <div className="relative z-10 w-[120%] hover:scale-[1.02] transition-transform duration-700 ease-out">
              <img
                src="https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=2070&auto=format&fit=crop"
                alt="White Lamborghini"
                className="w-full h-auto object-cover rounded-[2.5rem] border border-white/10 shadow-2xl drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[50%] bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl -z-10 rounded-full" />
          </div>
        </div>
      </section>


      {/* Trusted Brands Marquee */}
      <section className="bg-black border-y border-white/10 py-10 overflow-hidden">
        <div className="relative w-full max-w-7xl mx-auto px-4">
          <div className="flex overflow-hidden group">
            <div className="flex space-x-20 animate-marquee whitespace-nowrap items-center">
              {[
                { name: 'BMW', url: 'https://cdn.simpleicons.org/bmw' },
                { name: 'Mercedes', url: 'https://cdn.simpleicons.org/mercedes' },
                { name: 'Audi', url: 'https://cdn.simpleicons.org/audi' },
                { name: 'Porsche', url: 'https://cdn.simpleicons.org/porsche' },
                { name: 'Tesla', url: 'https://cdn.simpleicons.org/tesla' },
                { name: 'Land Rover', url: 'https://cdn.simpleicons.org/landrover' },
                { name: 'Range Rover', url: 'https://cdn.simpleicons.org/landrover' },
                { name: 'Ferrari', url: 'https://cdn.simpleicons.org/ferrari' },
                { name: 'Lamborghini', url: 'https://cdn.simpleicons.org/lamborghini' },
                { name: 'Bentley', url: 'https://cdn.simpleicons.org/bentley' },
                { name: 'Rolls Royce', url: 'https://cdn.simpleicons.org/rollsroyce' },
                { name: 'Aston Martin', url: 'https://cdn.simpleicons.org/astonmartin' },
                { name: 'Jaguar', url: 'https://cdn.simpleicons.org/jaguar' },
                { name: 'Lexus', url: 'https://cdn.simpleicons.org/lexus' },
                { name: 'McLaren', url: 'https://cdn.simpleicons.org/mclaren' },
                { name: 'Bugatti', url: 'https://cdn.simpleicons.org/bugatti' },
                { name: 'Maserati', url: 'https://cdn.simpleicons.org/maserati' },
                { name: 'Jeep', url: 'https://cdn.simpleicons.org/jeep' },
                { name: 'Volvo', url: 'https://cdn.simpleicons.org/volvo' },
                { name: 'Toyota', url: 'https://cdn.simpleicons.org/toyota' },
                { name: 'Honda', url: 'https://cdn.simpleicons.org/honda' },
                { name: 'Ford', url: 'https://cdn.simpleicons.org/ford' },
                { name: 'Chevrolet', url: 'https://cdn.simpleicons.org/chevrolet' },
                { name: 'Nissan', url: 'https://cdn.simpleicons.org/nissan' },
                { name: 'Volkswagen', url: 'https://cdn.simpleicons.org/volkswagen' },
                { name: 'Hyundai', url: 'https://cdn.simpleicons.org/hyundai' },
                { name: 'Kia', url: 'https://cdn.simpleicons.org/kia' },
                { name: 'Mazda', url: 'https://cdn.simpleicons.org/mazda' },
                { name: 'Mahindra', url: 'https://cdn.simpleicons.org/mahindra' },
                { name: 'Maruti Suzuki', url: 'https://cdn.simpleicons.org/marutisuzuki' },
                { name: 'Tata', url: 'https://cdn.simpleicons.org/tatamotors' },
                { name: 'Citroen', url: 'https://cdn.simpleicons.org/citroen' },
                { name: 'Alfa Romeo', url: 'https://cdn.simpleicons.org/alfaromeo' },
                { name: 'Genesis', url: 'https://cdn.simpleicons.org/genesis' },
                { name: 'Infiniti', url: 'https://cdn.simpleicons.org/infiniti' },
                { name: 'Acura', url: 'https://cdn.simpleicons.org/acura' },
                { name: 'Maybach', url: 'https://cdn.simpleicons.org/maybach' },
                { name: 'Lincoln', url: 'https://cdn.simpleicons.org/lincoln' },
                { name: 'Cadillac', url: 'https://cdn.simpleicons.org/cadillac' },
                { name: 'DS Automobiles', url: 'https://cdn.simpleicons.org/dsautomobiles' },
                { name: 'Hummer', url: 'https://cdn.simpleicons.org/hummer' },
                { name: 'GMC', url: 'https://cdn.simpleicons.org/gmc' },
                { name: 'Dodge', url: 'https://cdn.simpleicons.org/dodge' },
                { name: 'RAM Trucks', url: 'https://cdn.simpleicons.org/ram' },
                { name: 'Subaru', url: 'https://cdn.simpleicons.org/subaru' },
                { name: 'Lucid Motors', url: 'https://cdn.simpleicons.org/lucidmotors' },
                { name: 'Rivian', url: 'https://cdn.simpleicons.org/rivian' },
                { name: 'Polestar', url: 'https://cdn.simpleicons.org/polestar' },
                { name: 'NIO', url: 'https://cdn.simpleicons.org/nio' },
                { name: 'BYD', url: 'https://cdn.simpleicons.org/byd' },
                { name: 'Xpeng', url: 'https://cdn.simpleicons.org/xpeng' },
                { name: 'Fisker', url: 'https://cdn.simpleicons.org/fisker' },
                { name: 'VinFast', url: 'https://cdn.simpleicons.org/vinfast' },
                { name: 'Force Motors', url: 'https://cdn.simpleicons.org/forcemotors' },
                { name: 'Ashok Leyland', url: 'https://cdn.simpleicons.org/ashokleyland' },
                { name: 'Eicher', url: 'https://cdn.simpleicons.org/eicher' },
                { name: 'MG Motor India', url: 'https://cdn.simpleicons.org/mg' }
              ].map((brand, i) => (
                <div key={i} className="flex items-center justify-center min-w-[100px] h-20 cursor-default group/brand px-4">
                  <img
                    src={brand.url}
                    alt={brand.name}
                    onError={(e) => {
                      const target = e.currentTarget;
                      // Fallback to Google Favicon if SimpleIcons fails
                      let domain = brand.name.toLowerCase().replace(/ /g, '') + '.com';
                      if (brand.name === 'Mercedes') domain = 'mercedes-benz.com';
                      if (brand.name === 'Rolls Royce') domain = 'rolls-roycemotorcars.com';
                      if (brand.name === 'Tata') domain = 'tatamotors.com';
                      target.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
                    }}
                    className="h-10 w-10 object-contain brightness-0 invert opacity-60 group-hover/brand:filter-none group-hover/brand:opacity-100 transition-all duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Glassmorphism on Dark */}
      <section className="py-24 bg-[#0F0F0F] text-white overflow-hidden relative">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />

        <div className="container relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">Why Choose DriveYoo?</h2>
            <p className="text-gray-400 text-lg">We don't just rent cars; we deliver unparalleled driving experiences.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/[0.08] hover:border-white/10 transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center mb-6 group-hover:border-yellow-500/30 group-hover:shadow-[0_0_30px_-5px_rgba(234,179,8,0.3)] transition-all duration-500">
                  <feature.icon className="h-8 w-8 text-white group-hover:text-yellow-400 transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-100">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed font-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars Section - Light/Grey Contrast */}
      <section className="py-24 bg-gray-50">
        <div className="container">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Vehicles</h2>
              <p className="text-lg text-gray-500">Hand-picked selection of our finest cars.</p>
            </div>
            <Button variant="outline" className="hidden md:flex group border-gray-300 hover:bg-gray-100 text-gray-900" asChild>
              <Link to="/cars">
                View Gallery <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {featuredCars.length > 0 ? (
              featuredCars.map((car) => (
                <CarCard key={car.id} car={car} className="bg-white border-0 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500" />
              ))
            ) : (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[350px] bg-white rounded-3xl animate-pulse shadow-sm" />
              ))
            )}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Button size="lg" variant="outline" className="w-full border-gray-300" asChild>
              <Link to="/cars">View Gallery</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80"
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity fixed-background"
            alt="Driving"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        <div className="container relative z-10 text-center text-white">
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight">
              Ready to Hit the Road?
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed font-light">
              Join thousands of satisfied customers who trust DriveYoo for their premium car rental needs.
            </p>
            <div className="pt-8">
              <Button size="xl" className="h-16 px-12 text-lg rounded-full bg-white text-black hover:bg-gray-100 transition-all font-semibold shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)] hover:scale-105" asChild>
                <Link to="/cars">
                  Start Your Journey
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
