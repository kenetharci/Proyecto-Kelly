import { Router } from "express"
import { PostgresUserRepository } from "../../repositories/PostgresUserRepository"
import { authMiddleware, adminMiddleware, type AuthRequest } from "../middleware/authMiddleware"
import { AuthService } from "../../adapters/AuthService"

const router = Router()
const userRepository = new PostgresUserRepository()
const authService = new AuthService()

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await userRepository.findAll()
    const usersWithoutPassword = users.map(({ password, ...user }) => user)
    res.json(usersWithoutPassword)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
})

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { email, password, name, phone, role } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password and name are required" })
    }

    const existingUser = await userRepository.findByEmail(email)
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" })
    }

    const hashedPassword = await authService.hashPassword(password)

    const newUser = await userRepository.create({
      email,
      password: hashedPassword,
      name,
      phone: phone || "",
      role: role || "user",
      avatarUrl: undefined,
      notificationsEnabled: true
    })

    const { password: _, ...userWithoutPassword } = newUser
    res.status(201).json(userWithoutPassword)
  } catch (error) {
    console.error("Error creating user:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await userRepository.findById(req.user!.userId)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const { password, ...userWithoutPassword } = user
    res.json(userWithoutPassword)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
})

router.put("/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { email, name, phone } = req.body
    const user = await userRepository.update(req.user!.userId, { email, name, phone })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const { password, ...userWithoutPassword } = user
    res.json(userWithoutPassword)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
})

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const success = await userRepository.delete(req.params.id)

    if (!success) {
      return res.status(404).json({ error: "User not found" })
    }

    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
