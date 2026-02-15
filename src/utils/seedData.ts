import { supabase } from '@/lib/supabase';

// Type definitions
interface CarData {
    brand: string;
    model: string;
    year: number;
    price_per_day: number;
    type: string;
    fuel_type: string;
    transmission: string;
    seats: number;
    images: string[];
    features: string[];
    rating: number;
    status: 'available' | 'rented';
}

interface BrandConfig {
    models: ModelConfig[];
    priceMultiplier: number;
}

interface ModelConfig {
    name: string;
    type: CarType;
    fuelType: FuelType;
    basePrice: number;
    seats: number[];
    images: string[];
}

type CarType = 'sedan' | 'suv' | 'luxury' | 'sports' | 'electric' | 'hybrid' | 'truck';
type FuelType = 'gasoline' | 'diesel' | 'electric' | 'hybrid';
type TransmissionType = 'automatic' | 'manual';
type CarStatus = 'available' | 'rented';

// Comprehensive brand configurations with realistic data
const BRAND_CONFIGS: Record<string, BrandConfig> = {
    'BMW': {
        priceMultiplier: 1.2,
        models: [
            {
                name: 'X5',
                type: 'suv',
                fuelType: 'diesel',
                basePrice: 12000,
                seats: [5, 7],
                images: ['https://images.unsplash.com/photo-1555215695-3004980adade?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'X7',
                type: 'suv',
                fuelType: 'diesel',
                basePrice: 15000,
                seats: [7],
                images: ['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'M3',
                type: 'sports',
                fuelType: 'gasoline',
                basePrice: 14000,
                seats: [4, 5],
                images: ['https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'M5',
                type: 'sports',
                fuelType: 'gasoline',
                basePrice: 18000,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: '3 Series',
                type: 'sedan',
                fuelType: 'gasoline',
                basePrice: 10000,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1555816286-5619e8afa7f7?q=80&w=2670&auto=format&fit=crop']
            }
        ]
    },
    'Mercedes': {
        priceMultiplier: 1.2,
        models: [
            {
                name: 'C-Class',
                type: 'sedan',
                fuelType: 'gasoline',
                basePrice: 11000,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'E-Class',
                type: 'sedan',
                fuelType: 'gasoline',
                basePrice: 14000,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'S-Class',
                type: 'luxury',
                fuelType: 'gasoline',
                basePrice: 20000,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'GLE',
                type: 'suv',
                fuelType: 'diesel',
                basePrice: 16000,
                seats: [5, 7],
                images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'AMG GT',
                type: 'sports',
                fuelType: 'gasoline',
                basePrice: 22000,
                seats: [2, 4],
                images: ['https://images.unsplash.com/photo-1618843479619-f3d0d3c7a3b4?q=80&w=2670&auto=format&fit=crop']
            }
        ]
    },
    'Audi': {
        priceMultiplier: 1.15,
        models: [
            {
                name: 'A4',
                type: 'sedan',
                fuelType: 'gasoline',
                basePrice: 9500,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2670&auto=format&fit=croP']
            },
            {
                name: 'A6',
                type: 'sedan',
                fuelType: 'gasoline',
                basePrice: 12000,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'Q5',
                type: 'suv',
                fuelType: 'diesel',
                basePrice: 11000,
                seats: [5, 7],
                images: ['https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'Q7',
                type: 'suv',
                fuelType: 'diesel',
                basePrice: 14000,
                seats: [7],
                images: ['https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'RS5',
                type: 'sports',
                fuelType: 'gasoline',
                basePrice: 16000,
                seats: [4, 5],
                images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'e-tron',
                type: 'electric',
                fuelType: 'electric',
                basePrice: 13000,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1617886903355-9354bb57751f?q=80&w=2670&auto=format&fit=crop']
            }
        ]
    },
    'Toyota': {
        priceMultiplier: 0.9,
        models: [
            {
                name: 'Camry',
                type: 'sedan',
                fuelType: 'hybrid',
                basePrice: 8000,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'Corolla',
                type: 'sedan',
                fuelType: 'hybrid',
                basePrice: 6500,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1623869675781-80aa31f338e4?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'RAV4',
                type: 'suv',
                fuelType: 'hybrid',
                basePrice: 9000,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'Highlander',
                type: 'suv',
                fuelType: 'hybrid',
                basePrice: 11000,
                seats: [7],
                images: ['https://images.unsplash.com/photo-1581540222194-0def2dda95b8?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'Land Cruiser',
                type: 'suv',
                fuelType: 'diesel',
                basePrice: 14000,
                seats: [7],
                images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=2670&auto=format&fit=crop']
            }
        ]
    },
    'Tesla': {
        priceMultiplier: 1.3,
        models: [
            {
                name: 'Model 3',
                type: 'electric',
                fuelType: 'electric',
                basePrice: 10000,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2671&auto=format&fit=crop']
            },
            {
                name: 'Model Y',
                type: 'electric',
                fuelType: 'electric',
                basePrice: 12000,
                seats: [5, 7],
                images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2671&auto=format&fit=crop']
            },
            {
                name: 'Model S',
                type: 'electric',
                fuelType: 'electric',
                basePrice: 15000,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2671&auto=format&fit=crop']
            },
            {
                name: 'Model X',
                type: 'electric',
                fuelType: 'electric',
                basePrice: 17000,
                seats: [7],
                images: ['https://images.unsplash.com/photo-1571878625770-4c0f0e4d8d8d?q=80&w=2670&auto=format&fit=crop']
            }
        ]
    },
    'Honda': {
        priceMultiplier: 0.85,
        models: [
            {
                name: 'Civic',
                type: 'sedan',
                fuelType: 'gasoline',
                basePrice: 6000,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'Accord',
                type: 'sedan',
                fuelType: 'hybrid',
                basePrice: 7500,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'CR-V',
                type: 'suv',
                fuelType: 'gasoline',
                basePrice: 8000,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1549927681-0b673b8243ab?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'Pilot',
                type: 'suv',
                fuelType: 'gasoline',
                basePrice: 10000,
                seats: [7],
                images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2670&auto=format&fit=crop']
            }
        ]
    },
    'Ford': {
        priceMultiplier: 0.8,
        models: [
            {
                name: 'Mustang',
                type: 'sports',
                fuelType: 'gasoline',
                basePrice: 12000,
                seats: [4],
                images: ['https://images.unsplash.com/photo-1584345604476-8ec5f5d0c6a2?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'F-150',
                type: 'truck',
                fuelType: 'gasoline',
                basePrice: 9000,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1593950315186-76a92975b60c?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'Explorer',
                type: 'suv',
                fuelType: 'gasoline',
                basePrice: 8500,
                seats: [7],
                images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'Edge',
                type: 'suv',
                fuelType: 'gasoline',
                basePrice: 7500,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1581540222194-0def2dda95b8?q=80&w=2670&auto=format&fit=crop']
            }
        ]
    },
    'Nissan': {
        priceMultiplier: 0.85,
        models: [
            {
                name: 'Altima',
                type: 'sedan',
                fuelType: 'gasoline',
                basePrice: 6500,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2670&auto=format&fit=croP']
            },
            {
                name: 'Maxima',
                type: 'sedan',
                fuelType: 'gasoline',
                basePrice: 7500,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'Rogue',
                type: 'suv',
                fuelType: 'gasoline',
                basePrice: 7000,
                seats: [5, 7],
                images: ['https://images.unsplash.com/photo-1581540222194-0def2dda95b8?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'Pathfinder',
                type: 'suv',
                fuelType: 'gasoline',
                basePrice: 9000,
                seats: [7],
                images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2670&auto=format&fit=crop']
            }
        ]
    },
    'Porsche': {
        priceMultiplier: 1.5,
        models: [
            {
                name: '911',
                type: 'sports',
                fuelType: 'gasoline',
                basePrice: 25000,
                seats: [2, 4],
                images: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'Cayenne',
                type: 'suv',
                fuelType: 'gasoline',
                basePrice: 18000,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'Panamera',
                type: 'luxury',
                fuelType: 'gasoline',
                basePrice: 22000,
                seats: [4, 5],
                images: ['https://images.unsplash.com/photo-1611821064430-3a0f79837e14?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'Macan',
                type: 'suv',
                fuelType: 'gasoline',
                basePrice: 14000,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1611654267623-af6b7c876e8d?q=80&w=2670&auto=format&fit=crop']
            }
        ]
    },
    'Lexus': {
        priceMultiplier: 1.1,
        models: [
            {
                name: 'ES',
                type: 'sedan',
                fuelType: 'hybrid',
                basePrice: 10000,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'RX',
                type: 'suv',
                fuelType: 'hybrid',
                basePrice: 12000,
                seats: [5, 7],
                images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'LS',
                type: 'luxury',
                fuelType: 'gasoline',
                basePrice: 16000,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2670&auto=format&fit=crop']
            },
            {
                name: 'NX',
                type: 'suv',
                fuelType: 'hybrid',
                basePrice: 10500,
                seats: [5],
                images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2670&auto=format&fit=crop']
            }
        ]
    }
};

// Standard feature sets
const STANDARD_FEATURES = [
    'GPS',
    'Bluetooth',
    'Heated Seats',
    'Backup Camera',
    'Apple CarPlay'
];

const PREMIUM_FEATURES = [
    ...STANDARD_FEATURES,
    'Android Auto',
    'Leather Seats',
    'Sunroof',
    'Adaptive Cruise Control',
    'Lane Keep Assist',
    'Parking Sensors',
    'Keyless Entry',
    'Premium Audio System'
];

const LUXURY_FEATURES = [
    ...PREMIUM_FEATURES,
    'Ventilated Seats',
    'Massage Seats',
    'Head-Up Display',
    'Wireless Charging',
    'Ambient Lighting',
    'Night Vision',
    '360 Camera',
    'Air Suspension'
];

// Utility functions
function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomSubset<T>(arr: T[], minCount: number, maxCount: number): T[] {
    const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, arr.length));
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRating(): number {
    // Weighted toward higher ratings (4.0-5.0)
    const base = Math.random();
    const rating = base > 0.7
        ? 4.5 + (Math.random() * 0.5) // 30% chance of 4.5-5.0
        : 4.0 + (Math.random() * 0.5); // 70% chance of 4.0-4.5
    return Math.round(rating * 10) / 10;
}

function calculatePrice(
    basePrice: number,
    brandMultiplier: number,
    year: number,
    type: CarType
): number {
    // Year adjustment: newer cars cost more
    const yearFactor = 1 + ((year - 2020) * 0.05);

    // Type adjustment
    const typeMultipliers: Record<CarType, number> = {
        'sedan': 1.0,
        'suv': 1.1,
        'luxury': 1.4,
        'sports': 1.3,
        'electric': 1.2,
        'hybrid': 1.05,
        'truck': 1.0
    };

    const typeFactor = typeMultipliers[type] || 1.0;

    // Add some random variation (±10%)
    const randomFactor = 0.9 + (Math.random() * 0.2);

    const finalPrice = Math.round(basePrice * brandMultiplier * yearFactor * typeFactor * randomFactor);

    return finalPrice;
}

function selectFeatures(type: CarType, price: number): string[] {
    if (type === 'luxury' || price > 18000) {
        return getRandomSubset(LUXURY_FEATURES, 8, 12);
    } else if (type === 'sports' || type === 'electric' || price > 12000) {
        return getRandomSubset(PREMIUM_FEATURES, 6, 10);
    } else {
        return getRandomSubset(STANDARD_FEATURES, 5, 8);
    }
}

function getTransmission(type: CarType): TransmissionType {
    // Most modern cars are automatic, especially luxury/electric
    if (type === 'luxury' || type === 'electric') {
        return 'automatic';
    }

    // Sports cars might have manual option
    if (type === 'sports') {
        return Math.random() > 0.3 ? 'automatic' : 'manual';
    }

    // Most others are automatic with rare manual
    return Math.random() > 0.9 ? 'manual' : 'automatic';
}

function getStatus(): CarStatus {
    // 75% available, 25% rented
    return Math.random() > 0.25 ? 'available' : 'rented';
}

// Main seeding function
export const seedCars = async (count: number = 100): Promise<CarData[]> => {
    if (count <= 0) {
        throw new Error('Count must be a positive integer');
    }

    const cars: CarData[] = [];
    const brands = Object.keys(BRAND_CONFIGS);
    const years = [2020, 2021, 2022, 2023, 2024];

    for (let i = 0; i < count; i++) {
        const brand = getRandomElement(brands);
        const brandConfig = BRAND_CONFIGS[brand];
        const modelConfig = getRandomElement(brandConfig.models);

        const year = getRandomElement(years);
        const seats = getRandomElement(modelConfig.seats);
        const transmission = getTransmission(modelConfig.type);

        const pricePerDay = calculatePrice(
            modelConfig.basePrice,
            brandConfig.priceMultiplier,
            year,
            modelConfig.type
        );

        const features = selectFeatures(modelConfig.type, pricePerDay);
        const rating = generateRating();
        const status = getStatus();

        cars.push({
            brand,
            model: modelConfig.name,
            year,
            price_per_day: pricePerDay,
            type: modelConfig.type,
            fuel_type: modelConfig.fuelType,
            transmission,
            seats,
            images: modelConfig.images,
            features,
            rating,
            status
        });
    }

    // Insert in batches to avoid payload size limits
    const BATCH_SIZE = 100;
    const batches = Math.ceil(cars.length / BATCH_SIZE);

    for (let i = 0; i < batches; i++) {
        const start = i * BATCH_SIZE;
        const end = Math.min((i + 1) * BATCH_SIZE, cars.length);
        const batch = cars.slice(start, end);

        const { error } = await supabase.from('cars').insert(batch);

        if (error) {
            console.error(`Error seeding cars batch ${i + 1}/${batches}:`, error);
            throw error;
        }

        console.log(`Successfully seeded batch ${i + 1}/${batches} (${batch.length} cars)`);
    }

    console.log(`✓ Successfully seeded ${cars.length} cars`);
    return cars;
};

// Export utility function for clearing the table
export const clearCars = async (): Promise<void> => {
    const { error } = await supabase.from('cars').delete().neq('id', 0);

    if (error) {
        console.error('Error clearing cars table:', error);
        throw error;
    }

    console.log('✓ Successfully cleared cars table');
};

// Export utility function for getting statistics
export const getCarsStatistics = async (): Promise<{
    total: number;
    available: number;
    rented: number;
    byBrand: Record<string, number>;
    byType: Record<string, number>;
}> => {
    const { data: cars, error } = await supabase
        .from('cars')
        .select('brand, type, status');

    if (error) {
        console.error('Error fetching cars statistics:', error);
        throw error;
    }

    const stats = {
        total: cars?.length || 0,
        available: cars?.filter(c => c.status === 'available').length || 0,
        rented: cars?.filter(c => c.status === 'rented').length || 0,
        byBrand: {} as Record<string, number>,
        byType: {} as Record<string, number>
    };

    cars?.forEach(car => {
        stats.byBrand[car.brand] = (stats.byBrand[car.brand] || 0) + 1;
        stats.byType[car.type] = (stats.byType[car.type] || 0) + 1;
    });

    return stats;
};

// Export type definitions for use in other files
export type { CarData, CarType, FuelType, TransmissionType, CarStatus };
