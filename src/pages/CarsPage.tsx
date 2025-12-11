import { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CarCard } from '@/components/CarCard';
import { SearchFiltersComponent } from '@/components/SearchFilters';
import { mockCars } from '@/data/mockData';
import { SearchFilters } from '@/types';
import { Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CarsPageProps {
  user?: { name: string; role: 'customer' | 'admin' } | null;
  onLogout?: () => void;
}

export function CarsPage({ user, onLogout }: CarsPageProps) {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredCars = useMemo(() => {
    return mockCars.filter((car) => {
      if (filters.brand && car.brand !== filters.brand) return false;
      if (filters.type && car.type !== filters.type) return false;
      if (filters.fuelType && car.fuelType !== filters.fuelType) return false;
      if (filters.seats && car.seats < filters.seats) return false;
      if (filters.minPrice && car.pricePerDay < filters.minPrice) return false;
      if (filters.maxPrice && car.pricePerDay > filters.maxPrice) return false;
      return true;
    });
  }, [filters]);

  const resetFilters = () => setFilters({});

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={onLogout} />
      
      <main className="flex-1 py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Browse Our Fleet</h1>
            <p className="text-muted-foreground">
              {filteredCars.length} vehicles available
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-80 shrink-0">
              <div className="sticky top-24">
                <SearchFiltersComponent
                  filters={filters}
                  onFiltersChange={setFilters}
                  onReset={resetFilters}
                />
              </div>
            </aside>

            {/* Cars Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredCars.length} of {mockCars.length} cars
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {filteredCars.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-lg font-medium mb-2">No cars found</p>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to find what you're looking for.
                  </p>
                  <Button variant="outline" onClick={resetFilters}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className={cn(
                  "grid gap-6",
                  viewMode === 'grid' 
                    ? "sm:grid-cols-2 xl:grid-cols-3" 
                    : "grid-cols-1"
                )}>
                  {filteredCars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
