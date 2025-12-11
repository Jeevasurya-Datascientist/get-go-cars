import { SearchFilters, CarType, FuelType } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { carBrands, carTypes, fuelTypes } from '@/data/mockData';

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onReset: () => void;
}

export function SearchFiltersComponent({ filters, onFiltersChange, onReset }: SearchFiltersProps) {
  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

  return (
    <div className="space-y-6 p-6 rounded-xl bg-card border border-border/50 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Filters
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Select
            value={filters.brand || ''}
            onValueChange={(value) => updateFilter('brand', value || undefined)}
          >
            <SelectTrigger id="brand">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Brands</SelectItem>
              {carBrands.map((brand) => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Car Type</Label>
          <Select
            value={filters.type || ''}
            onValueChange={(value) => updateFilter('type', (value || undefined) as CarType | undefined)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              {carTypes.map((type) => (
                <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fuel">Fuel Type</Label>
          <Select
            value={filters.fuelType || ''}
            onValueChange={(value) => updateFilter('fuelType', (value || undefined) as FuelType | undefined)}
          >
            <SelectTrigger id="fuel">
              <SelectValue placeholder="All Fuel Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Fuel Types</SelectItem>
              {fuelTypes.map((fuel) => (
                <SelectItem key={fuel} value={fuel} className="capitalize">{fuel}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="seats">Minimum Seats</Label>
          <Select
            value={filters.seats?.toString() || ''}
            onValueChange={(value) => updateFilter('seats', value ? parseInt(value) : undefined)}
          >
            <SelectTrigger id="seats">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
              <SelectItem value="7">7+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <Label>Price Range</Label>
            <span className="text-sm text-muted-foreground">
              ${filters.minPrice || 0} - ${filters.maxPrice || 600}
            </span>
          </div>
          <Slider
            value={[filters.minPrice || 0, filters.maxPrice || 600]}
            onValueChange={([min, max]) => {
              onFiltersChange({ ...filters, minPrice: min, maxPrice: max });
            }}
            max={600}
            step={10}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
