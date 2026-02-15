import fs from 'fs'

// Generate random cars similar to original seed.sql
const brands = [
    { brand: 'BMW', model: 'M3', type: 'Sports', fuel_type: 'gasoline', transmission: 'automatic', image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2670&auto=format&fit=crop' },
    { brand: 'BMW', model: 'X5', type: 'SUV', fuel_type: 'diesel', transmission: 'automatic', image: 'https://images.unsplash.com/photo-1555215695-3004980adade?q=80&w=2670&auto=format&fit=crop' },
    { brand: 'Mercedes', model: 'C-Class', type: 'Sedan', fuel_type: 'gasoline', transmission: 'automatic', image: 'https://unsplash.com/photos/a-silver-sports-car-driving-down-a-street-next-to-palm-trees-hoBxOMee0yg?q=80&w=2670&auto=format&fit=crop' },
    { brand: 'Tesla', model: 'Model S', type: 'Electric', fuel_type: 'electric', transmission: 'automatic', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2671&auto=format&fit=crop' },
    { brand: 'Toyota', model: 'Camry', type: 'Sedan', fuel_type: 'hybrid', transmission: 'automatic', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=2670&auto=format&fit=crop' }
]

const features = ['GPS', 'Bluetooth', 'Heated Seats', 'Backup Camera', 'Apple CarPlay']

function generateSQL() {
    let sql = 'INSERT INTO cars (brand, model, type, fuel_type, seats, price_per_day, images, status, rating, year, transmission, features) VALUES\n'
    const rows = []

    for (let i = 0; i < 50; i++) {
        const template = brands[Math.floor(Math.random() * brands.length)]
        const year = 2020 + Math.floor(Math.random() * 5)
        const price = 2000 + Math.floor(Math.random() * 18000)
        const seats = [2, 4, 5, 7][Math.floor(Math.random() * 4)]
        const rating = (4 + Math.random()).toFixed(1)
        const status = Math.random() > 0.8 ? 'rented' : 'available'

        // Postgres array format
        const images = `'{"${template.image}"}'`
        const feats = `'{"${features.join('","')}"}'`

        rows.push(`('${template.brand}', '${template.model}', '${template.type}', '${template.fuel_type}', ${seats}, ${price}, ${images}, '${status}', ${rating}, ${year}, '${template.transmission}', ${feats})`)
    }

    sql += rows.join(',\n') + ';'

    fs.writeFileSync('supabase/seed_fallback.sql', sql)
    console.log('Generated fallback seed data at supabase/seed_fallback.sql')
}

generateSQL()
