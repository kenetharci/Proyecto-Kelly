import { Router } from "express"
import { PostgresCommentRepository } from "../../repositories/PostgresCommentRepository"
import { authMiddleware, type AuthRequest } from "../middleware/authMiddleware"

const router = Router()
const commentRepository = new PostgresCommentRepository()

router.get("/report/:reportId", authMiddleware, async (req, res) => {
  try {
    const comments = await commentRepository.findByReportId(req.params.reportId)
    res.json(comments)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
})

router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { reportId, message } = req.body

    if (!reportId || (!message && !req.body.content)) {
      return res.status(400).json({ error: "Report ID and message/content are required" })
    }

    const comment = await commentRepository.create({
      reportId,
      userId: req.user!.userId,
      content: message || req.body.content, // Handle both message and content
      isAdmin: req.user!.role === "admin",
    })

    res.status(201).json(comment)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
