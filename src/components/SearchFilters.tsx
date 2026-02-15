import { SearchFilters, CarType, FuelType } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter, ArrowUpDown } from 'lucide-react';

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onReset: () => void;
}

// Static data for filters
const carBrands = ['Toyota', 'BMW', 'Mercedes', 'Audi', 'Tesla', 'Ford', 'Honda', 'Nissan', 'Porsche', 'Lexus'];
const carTypes = [
  { label: 'Sedan', value: 'sedan' },
  { label: 'SUV', value: 'suv' },
  { label: 'Luxury', value: 'luxury' },
  { label: 'Sports', value: 'sports' },
  { label: 'Compact', value: 'compact' },
  { label: 'Van', value: 'van' },
];
const fuelTypes = [
  { label: 'Gasoline', value: 'petrol' },
  { label: 'Diesel', value: 'diesel' },
  { label: 'Electric', value: 'electric' },
  { label: 'Hybrid', value: 'hybrid' },
];

const commonFeatures = [
  'GPS', 'Bluetooth', 'Heated Seats', 'Backup Camera', 'Apple CarPlay',
  'Android Auto', 'Sunroof', 'Leather Seats', 'Autopilot', 'Massage Seats', 'Sport Mode'
];

export function SearchFiltersComponent({ filters, onFiltersChange, onReset }: SearchFiltersProps) {
  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleFeatureToggle = (feature: string) => {
    const currentFeatures = filters.features || [];
    const newFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];
    updateFilter('features', newFeatures);
  };

  const hasActiveFilters = Object.values(filters).some(v =>
    v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true)
  );

  return (
    <div className="space-y-6 p-6 rounded-xl bg-card border border-border/40 shadow-sm sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto hidden-scrollbar">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-8 px-2 text-muted-foreground hover:text-destructive">
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Search & Sort */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search brand, model..."
            value={filters.searchQuery || ''}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={filters.sortBy || 'newest'}
          onValueChange={(value: any) => updateFilter('sortBy', value)}
        >
          <SelectTrigger>
            <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest Added</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Accordion Filters */}
      <Accordion type="multiple" defaultValue={['price', 'brand', 'type']} className="w-full">

        {/* Price Range */}
        <AccordionItem value="price" className="border-b-0">
          <AccordionTrigger className="hover:no-underline py-2">
            <span className="text-sm font-medium">Price Range</span>
          </AccordionTrigger>
          <AccordionContent className="pt-4 px-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-normal text-muted-foreground">₹{filters.minPrice || 0}</Badge>
                <Badge variant="outline" className="font-normal text-muted-foreground">₹{filters.maxPrice || 50000}</Badge>
              </div>
              <Slider
                value={[filters.minPrice || 0, filters.maxPrice || 50000]}
                onValueChange={([min, max]) => {
                  onFiltersChange({ ...filters, minPrice: min, maxPrice: max });
                }}
                max={50000}
                step={1000}
                className="w-full"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brand */}
        <AccordionItem value="brand" className="border-b-0">
          <AccordionTrigger className="hover:no-underline py-2">
            <span className="text-sm font-medium">Brand</span>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <Select
              value={filters.brand || 'all'}
              onValueChange={(value) => updateFilter('brand', value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {carBrands.map((brand) => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        {/* Vehicle Type */}
        <AccordionItem value="type" className="border-b-0">
          <AccordionTrigger className="hover:no-underline py-2">
            <span className="text-sm font-medium">Vehicle Type</span>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="flex flex-wrap gap-2">
              {carTypes.map((type) => {
                const isSelected = filters.type === type.value;
                return (
                  <Badge
                    key={type.value}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer capitalize ${!isSelected && 'hover:bg-accent'}`}
                    onClick={() => updateFilter('type', isSelected ? undefined : type.value as CarType)}
                  >
                    {type.label}
                  </Badge>
                )
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Transmission */}
        <AccordionItem value="transmission" className="border-b-0">
          <AccordionTrigger className="hover:no-underline py-2">
            <span className="text-sm font-medium">Transmission</span>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <RadioGroup
              value={filters.transmission || 'all'}
              onValueChange={(val) => updateFilter('transmission', val === 'all' ? undefined : val as any)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="trans-all" />
                <Label htmlFor="trans-all" className="font-normal cursor-pointer">Any</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="automatic" id="trans-auto" />
                <Label htmlFor="trans-auto" className="font-normal cursor-pointer">Auto</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manual" id="trans-manual" />
                <Label htmlFor="trans-manual" className="font-normal cursor-pointer">Manual</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Seats */}
        <AccordionItem value="seats" className="border-b-0">
          <AccordionTrigger className="hover:no-underline py-2">
            <span className="text-sm font-medium">Seats</span>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <Select
              value={filters.seats?.toString() || 'all'}
              onValueChange={(value) => updateFilter('seats', value === 'all' ? undefined : parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="2">2+ Seats</SelectItem>
                <SelectItem value="4">4+ Seats</SelectItem>
                <SelectItem value="5">5+ Seats</SelectItem>
                <SelectItem value="7">7+ Seats</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        {/* Fuel Type */}
        <AccordionItem value="fuel" className="border-b-0">
          <AccordionTrigger className="hover:no-underline py-2">
            <span className="text-sm font-medium">Fuel Type</span>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="space-y-2">
              {fuelTypes.map((fuel) => (
                <div key={fuel.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`fuel-${fuel.value}`}
                    checked={filters.fuelType === fuel.value}
                    onCheckedChange={(checked) => {
                      updateFilter('fuelType', checked ? fuel.value as FuelType : undefined);
                    }}
                  />
                  <Label htmlFor={`fuel-${fuel.value}`} className="text-sm font-normal cursor-pointer capitalize">
                    {fuel.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Features */}
        <AccordionItem value="features" className="border-b-0">
          <AccordionTrigger className="hover:no-underline py-2">
            <span className="text-sm font-medium">Features</span>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {commonFeatures.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={`feat-${feature}`}
                    checked={(filters.features || []).includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                  />
                  <Label htmlFor={`feat-${feature}`} className="text-sm font-normal cursor-pointer">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
