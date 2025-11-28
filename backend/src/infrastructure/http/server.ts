import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import authRoutes from "./routes/authRoutes"
import reportRoutes from "./routes/reportRoutes"
import userRoutes from "./routes/userRoutes"
import commentRoutes from "./routes/commentRoutes"
import categoryRoutes from "./routes/categoryRoutes"
import uploadRoutes from "./routes/uploadRoutes"
import { testConnection } from "../database/connection"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3001",
      process.env.MOBILE_URL || "http://localhost:19000",
      "http://localhost:8081", // Expo default
    ],
    credentials: true,
  }),
)

app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/reports", reportRoutes)
app.use("/api/users", userRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/upload", uploadRoutes)

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../../../uploads")))

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Urban Report API is running" })
})

const startServer = async () => {
  console.log("🚀 Starting Urban Report API...")

  const dbConnected = await testConnection()

  if (!dbConnected) {
    console.error("❌ Failed to connect to database. Please check your configuration.")
    process.exit(1)
  }

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`)
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`)
  })
}

startServer()

export default app
