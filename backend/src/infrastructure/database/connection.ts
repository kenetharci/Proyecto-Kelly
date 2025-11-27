import { Pool } from "pg"

import { config } from "dotenv"

config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 20, // Máximo de conexiones en el pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Evento de conexión exitosa
pool.on("connect", () => {
  console.log("✅ Conectado a PostgreSQL")
})

// Evento de error
pool.on("error", (err) => {
  console.error("❌ Error inesperado en PostgreSQL:", err)
  process.exit(-1)
})

// Función para verificar la conexión
export async function testConnection() {
  try {
    const client = await pool.connect()
    const result = await client.query("SELECT NOW()")
    client.release()
    console.log("🔍 Test de conexión exitoso:", result.rows[0].now)
    return true
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error)
    return false
  }
}

export default pool
