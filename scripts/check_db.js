import { createClient } from '@supabase/supabase-js'
const url = 'https://okpgqwalzlmecapksjot.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rcGdxd2FsemxtZWNhcGtzam90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDc4MjgsImV4cCI6MjA4NjcyMzgyOH0.o1kB_vuO6GiC7Uwtkw7S_xmm-CTfcr3GEEgBdb3FkgE'


console.log('Testing connection to:', url)
const supabase = createClient(url, key)

async function check() {
    const { data, error } = await supabase.from('cars').select('*')

    if (error) {
        console.error('CONNECTION ERROR:', error.message)
        return
    }

    console.log('Connection Successful.')
    console.log(`Found ${data.length} cars in the database.`)

    if (data.length > 0) {
        console.log('First car sample:', data[0])
        // Check for nulls in critical fields
        const badCars = data.filter(c => !c.brand || !c.model || !c.images)
        if (badCars.length > 0) {
            console.warn(`WARNING: Found ${badCars.length} cars with missing data (brand, model, or images).`)
            console.log('Sample bad car:', badCars[0])
        }
    } else {
        console.log('The "cars" table is EMPTY. This explains why the UI is blank/loading.')
        console.log('Please run the "supabase/seed_fallback.sql" script in your Supabase SQL Editor.')
    }
}

check()
