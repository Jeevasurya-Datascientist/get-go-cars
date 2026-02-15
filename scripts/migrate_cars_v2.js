import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// OLD Credentials
const oldUrl = 'https://uxvcwrslreqptvilaeej.supabase.co'
const oldKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4dmN3cnNscmVxcHR2aWxhZWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzODEyMDcsImV4cCI6MjA4MDk1NzIwN30.-c8kjgYxWGjgx27sZUBqbN_5FmR9IvHl9_Z3Uhg9biM'

const supabase = createClient(oldUrl, oldKey)

async function migrate() {
    console.log('Attempting to fetch cars from old Supabase project...')

    try {
        const { data: cars, error } = await supabase.from('cars').select('*')

        if (error) {
            console.error('API Error fetching cars:', error)
            throw error
        }

        if (!cars || cars.length === 0) {
            console.log('No cars found in the old database.')
            return
        }

        console.log(`Successfully fetched ${cars.length} cars. Generating SQL...`)

        let sql = '-- Seed migrated cars\n'
        sql += 'INSERT INTO cars (id, created_at, brand, model, type, fuel_type, seats, price_per_day, images, status, rating, year, transmission, features) VALUES\n'

        const values = cars.map(car => {
            // Sanitization helper
            const escape = (str) => {
                if (str === null || str === undefined) return 'NULL'
                if (typeof str === 'number') return str
                if (Array.isArray(str)) {
                    // Postgres array format: '{"val1","val2"}'
                    const content = str.map(s => `"${s.replace(/"/g, '\\"')}"`).join(',')
                    return `'${"{" + content + "}"}'`
                }
                if (typeof str === 'boolean') return str ? 'TRUE' : 'FALSE'
                // Escape single quotes for SQL
                return `'${String(str).replace(/'/g, "''")}'`
            }

            // Ensure specific fields are not NULL if possible, or provide defaults if schema requires it
            // Schema requires: brand, model, type, fuel_type, seats, price_per_day, year
            // If fetched data has these as null, we might need valid defaults or skip.
            // But let's trust the old DB had valid data.

            return `(${escape(car.id)}, ${escape(car.created_at)}, ${escape(car.brand)}, ${escape(car.model)}, ${escape(car.type)}, ${escape(car.fuel_type)}, ${escape(car.seats)}, ${escape(car.price_per_day)}, ${escape(car.images)}, ${escape(car.status)}, ${escape(car.rating)}, ${escape(car.year)}, ${escape(car.transmission)}, ${escape(car.features)})`
        }).join(',\n')

        sql += values + ';'
        sql = sql.replace('INSERT INTO cars', 'INSERT INTO cars') + '\nON CONFLICT (id) DO NOTHING;'

        fs.writeFileSync('supabase/seed_migrated_cars.sql', sql)
        console.log('SUCCESS: Saved data to supabase/seed_migrated_cars.sql')
        console.log('INSTRUCTION: Copy the content of supabase/seed_migrated_cars.sql and run it in your new Supabase SQL Editor.')

    } catch (err) {
        console.error('FATAL ERROR during migration:', err.message)
        console.error('If this network error persists, please use the FALLBACK seed script provided as "scripts/seed_fallback.js" to populate test data.')
    }
}

migrate()
