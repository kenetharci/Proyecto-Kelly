import pool from "../infrastructure/database/connection"

const migrate = async () => {
    console.log("Starting migration...")

    try {
        const client = await pool.connect()
        try {
            await client.query('BEGIN')

            console.log("Adding contact_name column...")
            await client.query(`
        ALTER TABLE reports 
        ADD COLUMN IF NOT EXISTS contact_name VARCHAR(255)
      `)

            console.log("Adding contact_email column...")
            await client.query(`
        ALTER TABLE reports 
        ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255)
      `)

            console.log("Adding contact_phone column...")
            await client.query(`
        ALTER TABLE reports 
        ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(20)
      `)

            console.log("Adding admin_notes column...")
            await client.query(`
        ALTER TABLE reports 
        ADD COLUMN IF NOT EXISTS admin_notes TEXT
      `)

            await client.query('COMMIT')
            console.log("Migration completed successfully!")
        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            client.release()
        }
    } catch (error) {
        console.error("Migration failed:", error)
    } finally {
        await pool.end()
    }
}

migrate()
