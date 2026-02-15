import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// OLD Credentials
const oldUrl = 'https://uxvcwrslreqptvilaeej.supabase.co'
const oldKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4dmN3cnNscmVxcHR2aWxhZWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzODEyMDcsImV4cCI6MjA4MDk1NzIwN30.-c8kjgYxWGjgx27sZUBqbN_5FmR9IvHl9_Z3Uhg9biM'

const supabase = createClient(oldUrl, oldKey)

async function migrate() {
    console.log('Fetching cars from old Supabase project...')
    const { data: cars, error } = await supabase.from('cars').select('*')

    if (error) {
        console.error('Error fetching cars (Code: ' + error.code + ', Hint: ' + error.hint + '):', error.message)
        console.error(JSON.stringify(error, null, 2))
        return
    }

    console.log(`Fetched ${cars.length} cars.`)

    if (cars.length === 0) {
        console.log('No cars to migrate.')
        return
    }

    let sql = '-- Seed migrated cars\n'
    sql += 'INSERT INTO cars (id, created_at, brand, model, type, fuel_type, seats, price_per_day, images, status, rating, year, transmission, features) VALUES\n'

    const values = cars.map(car => {
        // Sanitization helper
        const escape = (str) => {
            if (str === null || str === undefined) return 'NULL'
            if (typeof str === 'number') return str
            if (Array.isArray(str)) {
                // Postgres array format: '{"val1","val2"}'
                // Escape double quotes in elements if needed
                const content = str.map(s => `"${s.replace(/"/g, '\\"')}"`).join(',')
                return `'${"{" + content + "}"}'`
            }
            if (typeof str === 'boolean') return str ? 'TRUE' : 'FALSE'
            return `'${str.replace(/'/g, "''")}'`
        }

        return `(${escape(car.id)}, ${escape(car.created_at)}, ${escape(car.brand)}, ${escape(car.model)}, ${escape(car.type)}, ${escape(car.fuel_type)}, ${escape(car.seats)}, ${escape(car.price_per_day)}, ${escape(car.images)}, ${escape(car.status)}, ${escape(car.rating)}, ${escape(car.year)}, ${escape(car.transmission)}, ${escape(car.features)})`
    }).join(',\n')

    sql += values + ';'

    // Use ON CONFLICT DO NOTHING to avoid errors if run multiple times
    sql = sql.replace('INSERT INTO cars', 'INSERT INTO cars') + '\nON CONFLICT (id) DO NOTHING;'

    fs.writeFileSync('supabase/seed_migrated_cars.sql', sql)
    console.log('Saved to supabase/seed_migrated_cars.sql')
}

migrate()
